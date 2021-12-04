import { ValidatorFn, FormControl, FormGroup, FormArray } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class BaseModel {
  constructor() {
    // define non enumerable properties so these are omitted in JSON.stringify.
    Object.defineProperty(this, '$formGroup', {
      get: this.getFormGroup,
      enumerable: false
    });
    Object.defineProperty(this, '_formGroup', {
      enumerable: false,
      writable: true
    });
    Object.defineProperty(this, 'addedFormControls', {
      get: this.getAddedFormControls,
      enumerable: false
    });
    Object.defineProperty(this, '_addedFormControls', {
      enumerable: false,
      writable: true
    });
  }

  /**
   * use $formGroup in angular's formBuilder to make a model driven (reactive) form.
   *   this.form = this.formBuilder.group({
   *       pet: this.pet.$formGroup,
   *   });
   */
  $formGroup: FormGroup;

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  protected _formGroup: FormGroup;

  addedFormControls;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private _addedFormControls = {};
  private static clearFormArray(formGroup: FormGroup, key: string): FormArray {
    if (formGroup) {
      const formArray = formGroup.controls[key] as FormArray;
      for (let i = formArray.length - 1; i >= 0; i--) {
        formArray.removeAt(i);
      }
      return formArray;
    }
  }

  /**
   * set the values.
   * @param values Can be used to set a webapi response to this newly constructed model
   */
  abstract setValues(values: any): void;

  /**
   * set the FormGroup values to the model values.
   */
  abstract setFormGroupValues(): void;
  protected abstract getFormGroup(): FormGroup;

  /**
   * add one or more additional validators to the control
   * @param key Name of the control (is the same as the name of the attached model property)
   * @param validators Validator(s) to add to the control
   */
  addValidatorToControl(
    key: string,
    validators: ValidatorFn | ValidatorFn[]
  ): void {
    const control = this.$formGroup.controls[key];
    const vals: any = validators instanceof Array ? validators : [validators];
    if (control.validator) {
      vals.push(control.validator);
    }
    control.setValidators(vals);
  }

  /**
   * add a new form control of type FormControl or FormGroup to this model.
   * Note: arrays (FormArray) are not supported.
   */
  protected addFormControl(
    key: string,
    control: FormGroup | FormControl
  ): void {
    const existingControl = this.$formGroup.controls[key];
    if (!existingControl) {
      this.$formGroup.addControl(key, control);
      this._addedFormControls[key] = control;
    } else {
      // if a control with the given key exists, replace it (the actual given control might have been changed)
      this.$formGroup.setControl(key, control);
    }
  }

  protected getAddedFormControls(): {} {
    return this._addedFormControls;
  }

  /**
   * set values in model properties for added form controls
   * Note: arrays (FormArray) are not supported.
   */
  protected setValuesInAddedPropertiesOfAttachedFormControls(
    values: any,
    useFormGroupValuesToModel: boolean
  ): void {
    const rawValues = this.getValuesToUse(values, useFormGroupValuesToModel);
    for (const key in this.addedFormControls) {
      if (rawValues[key]) {
        if (useFormGroupValuesToModel) {
          const control = this.addedFormControls[key];
          if (control instanceof FormControl) {
            this[key] = rawValues[key];
          } else if (control instanceof FormGroup) {
            this[key].setValues(rawValues[key], useFormGroupValuesToModel);
          } else if (control instanceof FormArray) {
            throw new Error(`control of type FormArray not supported here`);
          } else {
            throw new Error(`control of type ${control} not supported here`);
          }
        } else {
          this[key] = rawValues[key];
        }
      }
    }
  }

  /**
   * set values in added form controls
   * Note: arrays (FormArray) are not supported.
   */
  protected setFormGroupValuesInAddedFormControls(): void {
    // eslint-disable-next-line guard-for-in
    for (const key in this.addedFormControls) {
      const control = this.addedFormControls[key];
      if (control instanceof FormControl) {
        (control as FormControl).setValue(this[key]);
      } else if (control instanceof FormGroup) {
        this[key].setFormGroupValues();
      } else if (control instanceof FormArray) {
        throw new Error(`control of type FormArray not supported here`);
      } else {
        throw new Error(`control of type ${control} not supported here`);
      }
    }
  }

  protected fillModelArray<T>(
    object: BaseModel,
    key: string,
    values: Array<T>,
    useFormGroupValuesToModel: boolean,
    // eslint-disable-next-line @typescript-eslint/ban-types
    subTypeFactoryFn: Function,
    // eslint-disable-next-line no-undef-init
    type = undefined
  ): void {
    if (values) {
      object[key] = new Array<T>();
      for (const value of values) {
        if (type) {
          if (this.isSubType(value)) {
            const subTypeInstance = subTypeFactoryFn(
              value,
              useFormGroupValuesToModel
            );
            object[key].push(subTypeInstance);
          } else {
            object[key].push(new type(value, useFormGroupValuesToModel));
          }
        } else {
          object[key].push(value);
        }
      }
      // generate FormArray control elements
      // this.fillFormArray<T>(key, object[key], type);
    }
  }

  protected isSubType(value: any): boolean {
    return value.hasOwnProperty('$type') && value.$type;
  }

  protected getValuesToUse(
    values: any,
    useFormGroupValuesToModel: boolean
  ): any {
    let result = values;
    if (useFormGroupValuesToModel) {
      if (this.hasFormGroup(values)) {
        result = (values as any).$formGroup.getRawValue();
      } else if (values instanceof FormGroup) {
        result = (values as FormGroup).getRawValue();
      }
    }
    return result;
  }

  protected hasFormGroup(values: any): boolean {
    return !!values.$formGroup;
  }

  protected fillFormArray<T>(
    key: string,
    modelValues: any,
    // eslint-disable-next-line no-undef-init
    type = undefined
  ): void {
    const formArray = BaseModel.clearFormArray(this.$formGroup, key);
    for (const modelValue of modelValues) {
      if (type) {
        modelValue.setFormGroupValues();
        formArray.push((modelValue as BaseModel).$formGroup);
      } else {
        const formControl = new FormControl(modelValue);
        formArray.push(formControl);
      }
    }
  }

  /**
   * Lässt in einem BaseModel nur die als "dirty" markierten Felder des zugehörigen FormGroups zurück, und löscht den Rest
   * => Es bleibt ein Delta-Objekt mit allen Neuerungen übrig
   */
  public generateDelta(): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    function getDirtyState(form: FormGroup): Object {
      // eslint-disable-next-line @typescript-eslint/ban-types
      return Object.keys(form.controls).reduce<Object>(
        (dirtyState, controlKey) => {
          const control = form.controls[controlKey];

          if (!control.dirty) {
            return dirtyState;
          }

          if (control instanceof FormGroup) {
            return { ...dirtyState, [controlKey]: getDirtyState(control) };
          }

          if (control instanceof FormArray) {
            return control.controls
              .filter((c) => {
                const tmp = getDirtyState(c as FormGroup);
                return Object.entries(tmp).length === 0 ? false : true;
              })
              .map((c) => {
                getDirtyState(c as FormGroup);
              });
          }

          return { ...dirtyState, [controlKey]: control.value };
        },
        {}
      );
    }
    return getDirtyState(this._formGroup);
  }

  /**
   * this protected method casts to, with parameter called typeStr of type string and value of type any
   * result can be of type any
   * see implementation for full documentation
   */
  protected castTo(typeStr: string, value: any): any {
    if (!(value === null || value === undefined)) {
      if (typeStr === 'number') {
        return parseFloat(value);
      }

      if (typeStr === 'Date') {
        // isses schon ein Date?
        if (value instanceof Date) {
          return value;
        }

        // numbers auch zum Date casten
        if (typeof value === 'number') {
          return new Date(value);
        }

        // nein? dann mach zu Date!
        const pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z){1}$/g;
        if ((value as string).match && (value as string).match(pattern)) {
          return Date.parse(value);
        } else {
          // invalid utc ISO date
          console.error('Datum konnte nicht verarbeitet werden: ', value);
          return value;
        }
      }
    }
    return value;
  }
}
