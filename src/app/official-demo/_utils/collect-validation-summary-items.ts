import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import type { ValidationSummaryItem } from 'structra-ui';

export type ValidationFieldMeta = Record<
  string,
  { label: string; fieldId: string }
>;

function firstErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) {
    return 'Valor inválido';
  }
  if (errors['required']) {
    return 'Campo obrigatório';
  }
  if (errors['requiredTrue']) {
    return 'Tem de aceitar para continuar';
  }
  if (errors['email']) {
    return 'E-mail inválido';
  }
  if (errors['minlength']) {
    const r = errors['minlength'] as { requiredLength?: number };
    return `Mínimo de ${r?.requiredLength ?? '?'} caracteres`;
  }
  if (errors['maskIncomplete'] != null && errors['maskIncomplete'] !== false) {
    const mi = errors['maskIncomplete'];
    if (typeof mi === 'object' && mi !== null && 'message' in mi) {
      const msg = String((mi as { message: unknown }).message ?? '').trim();
      if (msg.length > 0) {
        return msg;
      }
    }
    return 'Campo obrigatório';
  }
  if (errors['maxlength']) {
    const r = errors['maxlength'] as { requiredLength?: number };
    return `Máximo de ${r?.requiredLength ?? '?'} caracteres`;
  }
  return 'Valor inválido';
}

/**
 * Percorre um {@link FormGroup} aninhado e devolve itens para o resumo de validação,
 * só para controles folha com `path` em `meta`.
 */
export function collectValidationSummaryItems(
  control: AbstractControl,
  path: string,
  meta: ValidationFieldMeta,
): ValidationSummaryItem[] {
  const out: ValidationSummaryItem[] = [];
  if (control instanceof FormGroup) {
    for (const key of Object.keys(control.controls)) {
      const child = control.get(key);
      if (!child) {
        continue;
      }
      const childPath = path ? `${path}.${key}` : key;
      out.push(...collectValidationSummaryItems(child, childPath, meta));
    }
    return out;
  }
  if (!control.invalid || !control.errors) {
    return out;
  }
  const m = meta[path];
  if (!m) {
    return out;
  }
  out.push({
    message: `${m.label}: ${firstErrorMessage(control.errors)}`,
    fieldId: m.fieldId,
  });
  return out;
}
