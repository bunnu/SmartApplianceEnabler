import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Logger} from '../log/logger';
import {TranslateService} from '@ngx-translate/core';
import {ErrorMessageHandler} from '../shared/error-message-handler';
import {FormHandler} from '../shared/form-handler';
import {ErrorMessages} from '../shared/error-messages';
import {ErrorMessage, ValidatorType} from '../shared/error-message';
import {InputValidatorPatterns} from '../shared/input-validator-patterns';
import {ModbusRead} from './modbus-read';
import {ModbusReadValue} from '../modbus-read-value/modbus-read-value';
import {
  fixExpressionChangedAfterItHasBeenCheckedError,
  getValidFloat,
  getValidInt,
  getValidString
} from '../shared/form-util';
import {ModbusReadValueComponent} from '../modbus-read-value/modbus-read-value.component';

@Component({
  selector: 'app-modbus-read',
  templateUrl: './modbus-read.component.html',
  styleUrls: ['../global.css'],
  viewProviders: [
    {provide: ControlContainer, useExisting: FormGroupDirective}
  ]
})
export class ModbusReadComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input()
  modbusRead: ModbusRead;
  @ViewChildren('modbusReadValues')
  modbusReadValueComps: QueryList<ModbusReadValueComponent>;
  @Input()
  valueNames: string[];
  @Input()
  readRegisterTypes: string[];
  @Input()
  formControlNamePrefix = '';
  @Input()
  maxValues: number;
  form: FormGroup;
  formHandler: FormHandler;
  @Input()
  translationPrefix: string;
  @Input()
  translationKeys: string[];
  @Output()
  remove = new EventEmitter<any>();
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
    this.form = this.parent.form;
    if (changes.modbusRead) {
      if (changes.modbusRead.currentValue) {
        this.modbusRead = changes.modbusRead.currentValue;
      } else {
        this.modbusRead = new ModbusRead();
      }
    }
    this.updateForm(this.form, this.modbusRead, this.formHandler);
  }

  ngOnInit() {
    this.errorMessages = new ErrorMessages('ModbusReadComponent.error.', [
      new ErrorMessage(this.getFormControlName('address'), ValidatorType.required, 'address'),
      new ErrorMessage(this.getFormControlName('address'), ValidatorType.pattern, 'address'),
      new ErrorMessage(this.getFormControlName('bytes'), ValidatorType.pattern, 'bytes'),
      new ErrorMessage(this.getFormControlName('factorToValue'), ValidatorType.pattern, 'factorToValue'),
    ], this.translate);
    this.expandParentForm(this.form, this.modbusRead, this.formHandler);
    this.form.statusChanges.subscribe(() => {
      this.errors = this.errorMessageHandler.applyErrorMessages4ReactiveForm(this.form, this.errorMessages);
    });
    // FIXME prüfen
    // this.translate.get(this.translationKeys).subscribe(translatedStrings => {
    //   this.translatedStrings = translatedStrings;
    // });
  }

  ngAfterViewChecked() {
    this.formHandler.markLabelsRequired();
  }

  getFormControlName(formControlName: string): string {
    return `${this.formControlNamePrefix}${formControlName.charAt(0).toUpperCase()}${formControlName.slice(1)}`;
  }

  getReadValueFormControlPrefix(index: number) {
    return `${this.formControlNamePrefix}readValue${index}.`;
  }

  get type(): string {
    const typeControl = this.form.controls[this.getFormControlName('type')];
    return (typeControl ? typeControl.value : '');
  }

  // TODO move to config
  getByteOrders(): string[] {
    return ['BigEndian', 'LittleEndian'];
  }

  removeModbusRead() {
    this.remove.emit();
  }

  get isAddValuePossible() {
    return !this.modbusRead.readValues || !this.maxValues || this.modbusRead.readValues.length < this.maxValues;
  }

  addValue() {
    fixExpressionChangedAfterItHasBeenCheckedError(this.form);
    const newReadValue = new ModbusReadValue();
    if (!this.modbusRead.readValues) {
      this.modbusRead.readValues = [];
    }
    this.modbusRead.readValues.push(newReadValue);
    this.form.markAsDirty();
  }

  removeValue(index: number) {
    this.modbusRead.readValues.splice(index, 1);
    this.form.markAsDirty();
  }

  expandParentForm(form: FormGroup, modbusRead: ModbusRead, formHandler: FormHandler) {
    formHandler.addFormControl(form, this.getFormControlName('address'),
      modbusRead ? modbusRead.address : undefined,
      [Validators.required, Validators.pattern(InputValidatorPatterns.INTEGER_OR_HEX)]);
    formHandler.addFormControl(form, this.getFormControlName('type'),
      modbusRead ? modbusRead.type : undefined,
      [Validators.required]);
    formHandler.addFormControl(form, this.getFormControlName('bytes'),
      modbusRead ? modbusRead.bytes : undefined,
      [Validators.pattern(InputValidatorPatterns.INTEGER)]);
    formHandler.addFormControl(form, this.getFormControlName('byteOrder'),
      modbusRead ? modbusRead.byteOrder : undefined);
    formHandler.addFormControl(form, this.getFormControlName('factorToValue'),
      modbusRead ? modbusRead.factorToValue : undefined,
      [Validators.pattern(InputValidatorPatterns.FLOAT)]);
  }

  updateForm(form: FormGroup, modbusRead: ModbusRead, formHandler: FormHandler) {
    formHandler.setFormControlValue(form, this.getFormControlName('address'), modbusRead.address);
    formHandler.setFormControlValue(form, this.getFormControlName('type'), modbusRead.type);
    formHandler.setFormControlValue(form, this.getFormControlName('bytes'), modbusRead.bytes);
    formHandler.setFormControlValue(form, this.getFormControlName('byteOrder'), modbusRead.byteOrder);
    formHandler.setFormControlValue(form, this.getFormControlName('factorToValue'),
      modbusRead.factorToValue);
  }

  updateModelFromForm(): ModbusRead | undefined {
    const address = this.form.controls[this.getFormControlName('address')].value;
    const type = this.form.controls[this.getFormControlName('type')].value;
    const bytes = this.form.controls[this.getFormControlName('bytes')].value;
    const byteOrder = this.form.controls[this.getFormControlName('byteOrder')].value;
    const factorToValue = this.form.controls[this.getFormControlName('factorToValue')].value;
    const modbusReadValues = [];
    this.modbusReadValueComps.forEach(modbusReadValueComp => {
      const modbusReadValue = modbusReadValueComp.updateModelFromForm();
      if (modbusReadValue) {
        modbusReadValues.push(modbusReadValue);
      }
    });

    if (!(address || type || bytes || byteOrder || factorToValue || modbusReadValues.length > 0)) {
      return undefined;
    }

    this.modbusRead.address = getValidString(address);
    this.modbusRead.type = getValidString(type);
    this.modbusRead.bytes = getValidInt(bytes);
    this.modbusRead.byteOrder = getValidString(byteOrder);
    this.modbusRead.factorToValue = getValidFloat(factorToValue);
    return this.modbusRead;
  }
}
