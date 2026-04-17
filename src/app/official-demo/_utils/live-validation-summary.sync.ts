import { DestroyRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  collectValidationSummaryItems,
  type ValidationFieldMeta,
} from './collect-validation-summary-items';
import type { ValidationSummaryItem } from 'structra-ui';

export interface LiveValidationSummarySyncOptions {
  root: AbstractControl;
  meta: ValidationFieldMeta;
  /** Enquanto `true`, recalcula o resumo em cada alteração do formulário (após tentativa de validação). */
  isLive: () => boolean;
  onSynced: (items: ValidationSummaryItem[]) => void;
  markForCheck: () => void;
}

/**
 * Mantém `summaryItems` alinhado ao modelo: à medida que o usuário corrige campos, as linhas
 * do resumo desaparecem. Ativar `isLive` só após submeter com erros (e desativar ao fechar / válido).
 */
export function subscribeLiveValidationSummarySync(
  destroyRef: DestroyRef,
  options: LiveValidationSummarySyncOptions,
): void {
  const { root, meta, isLive, onSynced, markForCheck } = options;
  merge(root.valueChanges, root.statusChanges)
    .pipe(debounceTime(0), takeUntilDestroyed(destroyRef))
    .subscribe(() => {
      if (!isLive()) {
        return;
      }
      const items = collectValidationSummaryItems(root, '', meta);
      onSynced(items);
      markForCheck();
    });
}
