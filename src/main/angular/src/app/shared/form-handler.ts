import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';

declare const $: any;

export class FormHandler {

  formControlNamesRequired: string[] = [];

  public addFormControl(formGroup: FormGroup, formControlName: string, formState?: any,
                        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    if (Array.isArray(validatorOrOpts)) {
      (validatorOrOpts as []).forEach((validatorFn: ValidatorFn) => {
        this.registerRequiredValidator(validatorFn, formControlName);
      });
    } else {
      this.registerRequiredValidator(validatorOrOpts, formControlName);
    }
    const control = new FormControl(formState, validatorOrOpts, asyncValidator);
    formGroup.addControl(formControlName, control);
  }

  public setFormControlValue(formGroup: FormGroup, formControlName: string, value: any) {
    const control = formGroup.controls[formControlName];
    if (control) {
      control.setValue(value);
    }
  }

  registerRequiredValidator(validatorFn: any, formControlName: string) {
    if (validatorFn === Validators.required) {
      this.formControlNamesRequired.push(formControlName);
    }
  }

  public markLabelsRequired() {
    this.formControlNamesRequired.forEach(formControlName => {
      if (typeof $ !== 'undefined') {
        $(`input[ng-reflect-name="${formControlName}"]`).parent().children('label').addClass('required');
        $(`select[ng-reflect-name="${formControlName}"]`).parent().children('label').addClass('required');
        $(`sui-select[ng-reflect-name="${formControlName}"]`).parent().children('label').addClass('required');
      }
    });
  }
}
