import {AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Logger} from '../log/logger';
import {FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ErrorMessageHandler} from '../shared/error-message-handler';
import {FormHandler} from '../shared/form-handler';
import {ErrorMessages} from '../shared/error-messages';
import {HttpReadValue} from './http-read-value';
import {InputValidatorPatterns} from '../shared/input-validator-patterns';
import {getValidFloat, getValidString} from '../shared/form-util';
import {ErrorMessage, ValidatorType} from '../shared/error-message';

@Component({
  selector: 'app-http-read-value',
  templateUrl: './http-read-value.component.html',
  styleUrls: ['../global.css'],
})
export class HttpReadValueComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input()
  httpReadValue: HttpReadValue;
  @Input()
  valueNames: string[];
  @Input()
  disableFactorToValue = false;
  @Input()
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
              private translate: TranslateService
  ) {
    this.errorMessageHandler = new ErrorMessageHandler(logger);
    this.formHandler = new FormHandler();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.httpReadValue) {
      if (changes.httpReadValue.currentValue) {
        this.httpReadValue = changes.httpReadValue.currentValue;
      } else {
        this.httpReadValue = new HttpReadValue();
      }
      this.updateForm();
    }
    if (changes.form) {
      this.expandParentForm();
    }
  }

  ngOnInit() {
    this.errorMessages = new ErrorMessages('HttpReadValueComponent.error.', [
      new ErrorMessage('factorToValue', ValidatorType.pattern),
    ], this.translate);
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

  public getTranslatedValueName(valueName: string) {
    const textKey = `${this.translationPrefix}${valueName}`;
    return this.translatedStrings[textKey];
  }

  expandParentForm() {
    this.formHandler.addFormControl(this.form, 'name',
      this.httpReadValue && this.httpReadValue.name,
      [Validators.required]);
    this.formHandler.addFormControl(this.form, 'data',
      this.httpReadValue && this.httpReadValue.data);
    this.formHandler.addFormControl(this.form, 'path',
      this.httpReadValue && this.httpReadValue.path);
    this.formHandler.addFormControl(this.form, 'extractionRegex',
      this.httpReadValue && this.httpReadValue.extractionRegex);
    if (!this.disableFactorToValue) {
      this.formHandler.addFormControl(this.form, 'factorToValue',
        this.httpReadValue && this.httpReadValue.factorToValue,
        [Validators.pattern(InputValidatorPatterns.FLOAT)]);
    }
  }

  updateForm() {
    this.formHandler.setFormControlValue(this.form, 'name', this.httpReadValue.name);
    this.formHandler.setFormControlValue(this.form, 'data', this.httpReadValue.data);
    this.formHandler.setFormControlValue(this.form, 'path', this.httpReadValue.path);
    this.formHandler.setFormControlValue(this.form, 'extractionRegex', this.httpReadValue.extractionRegex);
    if (!this.disableFactorToValue) {
      this.formHandler.setFormControlValue(this.form, 'factorToValue', this.httpReadValue.factorToValue);
    }
  }

  updateModelFromForm(): HttpReadValue | undefined {
    const name = getValidString(this.form.controls.name.value);
    const data = getValidString(this.form.controls.data.value);
    const path = getValidString(this.form.controls.path.value);
    const extractionRegex = getValidString(this.form.controls.extractionRegex.value);
    let factorToValue;
    if (!this.disableFactorToValue) {
      factorToValue = getValidFloat(this.form.controls.factorToValue.value);
    }

    if (!(name || data || path || extractionRegex || factorToValue)) {
      return undefined;
    }

    this.httpReadValue.name = name;
    this.httpReadValue.data = data;
    this.httpReadValue.path = path;
    this.httpReadValue.extractionRegex = extractionRegex;
    this.httpReadValue.factorToValue = factorToValue;
    return this.httpReadValue;
  }
}
