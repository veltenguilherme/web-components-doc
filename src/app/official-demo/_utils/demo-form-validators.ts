import { AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeastOneInArray(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  return Array.isArray(v) && v.length > 0 ? null : { required: true };
}
