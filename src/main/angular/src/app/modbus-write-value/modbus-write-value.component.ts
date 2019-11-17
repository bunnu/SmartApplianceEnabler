import {AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Logger} from '../log/logger';
import {ControlContainer, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ErrorMessageHandler} from '../shared/error-message-handler';
import {FormHandler} from '../shared/form-handler';
import {ErrorMessages} from '../shared/error-messages';
import {ErrorMessage, ValidatorType} from '../shared/error-message';
import {ModbusWriteValue} from './modbus-write-value';
import {getValidString} from '../shared/form-util';

@Component({
  selector: 'app-modbus-write-value',
  templateUrl: './modbus-write-value.component.html',
  styleUrls: ['../global.css'],
  viewProviders: [
    {provide: ControlContainer, useExisting: FormGroupDirective}
  ]
})
export class ModbusWriteValueComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input()
  modbusWriteValue: ModbusWriteValue;
  @Input()
  valueNames: string[];
  @Input()
  formControlNamePrefix = '';
  form: FormGroup;
  formHandler: FormHandler;
  @Input()
  translationPrefix = '';
  @Input()
  translationKeys: string[];
  translatedStrings: string[];
  errors: { [key: string]: string } = {};
  errorMessages: ErrorMessages;
  errorMessageHandler: ErrorMessageHandler;

  constructor(private logger: Logger,
              private parent: FormGroupDirective,
              private translate: TranslateService
  ) {
    this.errorMessageHandler = new ErrorMessageHandler(logger);
    this.formHandler = new FormHandler();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modbusWriteValue) {
      if (changes.modbusWriteValue.currentValue) {
        this.modbusWriteValue = changes.modbusWriteValue.currentValue;
      } else {
        this.modbusWriteValue = new ModbusWriteValue();
      }
    }
    this.form = this.parent.form;
    this.updateForm(this.form, this.modbusWriteValue, this.formHandler);
  }

  ngOnInit() {
    this.errorMessages = new ErrorMessages('ModbusReadValueComponent.error.', [
      new ErrorMessage(this.getFormControlName('factorToValue'), ValidatorType.pattern, 'factorToValue'),
    ], this.translate);
    this.expandParentForm(this.form, this.modbusWriteValue, this.formHandler);
    this.form.statusChanges.subscribe(() => {
      this.errors = this.errorMessageHandler.applyErrorMessages4ReactiveForm(this.form, this.errorMessages);
    });
    this.translate.get(this.translationKeys).subscribe(translatedStrings => {
      this.translatedStrings = translatedStrings;
    });
  }

  ngAfterViewChecked() {
    this.formHandler.markLabelsRequired();
  }

  getFormControlName(formControlName: string): string {
    return `${this.formControlNamePrefix}${formControlName.charAt(0).toUpperCase()}${formControlName.slice(1)}`;
  }

  public getTranslatedValueName(valueName: string) {
    const textKey = `${this.translationPrefix}${valueName}`;
    return this.translatedStrings[textKey];
  }

  expandParentForm(form: FormGroup, modbusWriteValue: ModbusWriteValue, formHandler: FormHandler) {
    formHandler.addFormControl(form, this.getFormControlName('name'),
      modbusWriteValue ? modbusWriteValue.name : undefined,
      [Validators.required]);
    formHandler.addFormControl(form, this.getFormControlName('value'),
      modbusWriteValue ? modbusWriteValue.value : undefined,
      [Validators.required]);
  }

  updateForm(form: FormGroup, modbusWriteValue: ModbusWriteValue, formHandler: FormHandler) {
    formHandler.setFormControlValue(form, this.getFormControlName('name'), modbusWriteValue.name);
    formHandler.setFormControlValue(form, this.getFormControlName('value'), modbusWriteValue.value);
  }

  updateModelFromForm(): ModbusWriteValue | undefined {
    const name = this.form.controls[this.getFormControlName('name')].value;
    const value = this.form.controls[this.getFormControlName('value')].value;

    if (!(name || value)) {
      return undefined;
    }

    this.modbusWriteValue.name = getValidString(name);
    this.modbusWriteValue.value = getValidString(value);
    return this.modbusWriteValue;
  }
}
