import { JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import { CheckboxFieldComponent } from 'structra-ui';
import {
  IntegerFieldComponent,
  PhoneFieldComponent,
  TextFieldComponent,
  TextareaFieldComponent,
  phoneBrMaskCompleteValidator,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  FormTabComponent,
  FormTabsComponent,
  LayoutStackAlign,
  LayoutStackComponent,
  ValidationSummaryComponent,
  sectionHasVisibleInvalid,
  subscribeMarkForCheckOnInvalidUiRefresh,
  type ValidationSummaryItem,
} from 'structra-ui';
import { collectValidationSummaryItems } from '../_utils/collect-validation-summary-items';
import { subscribeLiveValidationSummarySync } from '../_utils/live-validation-summary.sync';

type AbasTabKey = 'identificacao' | 'preferencias' | 'complemento';

/** Mesmo padrão que `demo-resumo-validacao`: `Nome do campo: mensagem` via {@link collectValidationSummaryItems}. */
const ABAS_FIELD_META = {
  'identificacao.contato.nome': {
    label: 'Nome completo',
    fieldId: 'demo-abas-nome',
  },
  'identificacao.contato.email': { label: 'E-mail', fieldId: 'demo-abas-email' },
  'identificacao.perfil.cargo': { label: 'Cargo', fieldId: 'demo-abas-cargo' },
  'identificacao.perfil.empresa': { label: 'Empresa', fieldId: 'demo-abas-empresa' },
  'preferencias.aceite': { label: 'Aceite', fieldId: 'demo-abas-aceite' },
  'preferencias.prioridade': {
    label: 'Prioridade',
    fieldId: 'demo-abas-prioridade',
  },
  'complemento.observacoes': {
    label: 'Observações',
    fieldId: 'demo-abas-observacoes',
  },
  'complemento.telefone': { label: 'Telefone', fieldId: 'demo-abas-telefone' },
} as const;

@Component({
  selector: 'app-demo-abas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextFieldComponent,
    TextareaFieldComponent,
    IntegerFieldComponent,
    PhoneFieldComponent,
    CheckboxFieldComponent,
    BaseButtonComponent,
    LayoutStackComponent,
    FormColComponent,
    FormGroupComponent,
    FormRowComponent,
    FormTabsComponent,
    FormTabComponent,
    ValidationSummaryComponent,
  ],
  templateUrl: './demo-abas.component.html',
  styleUrl: './demo-abas.component.scss',
})
export class DemoAbasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly LayoutStackAlign = LayoutStackAlign;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;

  /** Mensagem de erro visível no campo (com `[showErrorMessage]="true"`). */
  readonly strMensagemErroNomeCompleto =
    'Informe o nome completo com pelo menos 10 caracteres.';

  /** Navegação do resumo: campo → aba */
  private readonly fieldIdToTabKey: Record<string, AbasTabKey> = {
    'demo-abas-nome': 'identificacao',
    'demo-abas-email': 'identificacao',
    'demo-abas-cargo': 'identificacao',
    'demo-abas-empresa': 'identificacao',
    'demo-abas-aceite': 'preferencias',
    'demo-abas-prioridade': 'preferencias',
    'demo-abas-observacoes': 'complemento',
    'demo-abas-telefone': 'complemento',
  };

  activeTabKey: AbasTabKey = 'identificacao';

  summaryItems: ValidationSummaryItem[] = [];
  summaryVisible = false;

  /** `true` após validar com erros: o resumo atualiza ao corrigir campos. */
  private summaryLive = false;

  /**
   * Equivale a `FormGroupDirective.submitted` para o ícone da aba.
   * O `FormGroupDirective` do `<form>` não é injetável no `app-demo-abas` (fica no filho).
   */
  /** Usado no template (`[uxSubmittedPass]`, `tabWarning`) — mesmo critério que `sectionHasVisibleInvalid`. */
  protected formSubmitAttempted = false;

  readonly form = this.fb.group({
    identificacao: this.fb.group({
      contato: this.fb.group({
        nome: ['', [Validators.required, Validators.minLength(10)]],
        email: ['', [Validators.required, Validators.email]],
      }),
      perfil: this.fb.group({
        cargo: ['', Validators.required],
        empresa: ['', Validators.required],
      }),
    }),
    preferencias: this.fb.group({
      aceite: [false, Validators.requiredTrue],
      prioridade: [null as number | null, Validators.required],
    }),
    complemento: this.fb.group({
      observacoes: ['', Validators.required],
      telefone: [
        '',
        [Validators.required, phoneBrMaskCompleteValidator(false)],
      ],
    }),
  });

  ngOnInit(): void {
    subscribeMarkForCheckOnInvalidUiRefresh(
      this.form,
      this.hostRef.nativeElement,
      this.cdr,
      this.destroyRef,
    );
    subscribeLiveValidationSummarySync(this.destroyRef, {
      root: this.form,
      meta: ABAS_FIELD_META as Record<
        string,
        { label: string; fieldId: string }
      >,
      isLive: () => this.summaryLive,
      onSynced: (items) => {
        this.summaryItems = items;
        if (items.length === 0) {
          this.summaryLive = false;
          this.summaryVisible = false;
        }
      },
      markForCheck: () => this.cdr.markForCheck(),
    });
  }

  readonly onBeforeSummaryItem = (item: ValidationSummaryItem): void => {
    const fid = item.fieldId?.trim();
    if (!fid) {
      return;
    }
    const tab = this.fieldIdToTabKey[fid];
    if (tab && tab !== this.activeTabKey) {
      this.activeTabKey = tab;
      this.cdr.markForCheck();
    }
  };

  /**
   * Igual a `invalidFlagVisible` do `app-form-group`: `subtreeHasVisibleInvalid` com
   * o mesmo critério de “submetido” ({@link formSubmitAttempted}).
   */
  tabWarning(key: AbasTabKey): boolean {
    return sectionHasVisibleInvalid(this.form, key, this.formSubmitAttempted);
  }

  /** Oculta só o painel de resumo; validação e campos mantêm-se como estão. */
  onCloseSummaryPanel(): void {
    this.summaryVisible = false;
    this.summaryLive = false;
    this.cdr.markForCheck();
  }

  onValidar(): void {
    this.formSubmitAttempted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.summaryItems = this.buildSummaryItems();
      this.summaryVisible = true;
      this.summaryLive = true;
    } else {
      this.summaryItems = [];
      this.summaryVisible = false;
      this.summaryLive = false;
      this.formSubmitAttempted = false;
    }
    this.cdr.markForCheck();
  }

  private buildSummaryItems(): ValidationSummaryItem[] {
    return collectValidationSummaryItems(
      this.form,
      '',
      ABAS_FIELD_META as Record<string, { label: string; fieldId: string }>,
    );
  }
}
