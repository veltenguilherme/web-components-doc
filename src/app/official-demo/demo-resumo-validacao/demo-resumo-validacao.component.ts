import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import {
  CheckboxFieldComponent,
  SwitchFieldComponent,
} from 'structra-ui';
import {
  IntegerFieldComponent,
  TextFieldComponent,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  ValidationSummaryComponent,
  type ValidationSummaryItem,
} from 'structra-ui';
import { collectValidationSummaryItems } from '../_utils/collect-validation-summary-items';
import { subscribeLiveValidationSummarySync } from '../_utils/live-validation-summary.sync';

const RESUMO_FIELD_META = {
  'identificacao.nome': { label: 'Nome', fieldId: 'demo-resumo-nome' },
  'identificacao.email': { label: 'E-mail', fieldId: 'demo-resumo-email' },
  'preferencias.aceite': { label: 'Aceite', fieldId: 'demo-resumo-aceite' },
  'preferencias.prioridade': {
    label: 'Prioridade',
    fieldId: 'demo-resumo-prioridade',
  },
} as const;

@Component({
  selector: 'app-demo-resumo-validacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    NgTemplateOutlet,
    TextFieldComponent,
    IntegerFieldComponent,
    CheckboxFieldComponent,
    SwitchFieldComponent,
    BaseButtonComponent,
    FormColComponent,
    FormGroupComponent,
    FormRowComponent,
    ValidationSummaryComponent,
  ],
  templateUrl: './demo-resumo-validacao.component.html',
  styleUrl: './demo-resumo-validacao.component.scss',
})
export class DemoResumoValidacaoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  /** `FormGroupDirective` do `<form [formGroup]>` — `resetForm` repõe `submitted` (erro visível nos campos / grupos). */
  @ViewChild('resumoForm', { read: FormGroupDirective, static: false })
  private resumoFormDir?: FormGroupDirective;

  /** `true` após submeter com erros: o resumo atualiza ao corrigir campos. */
  private summaryLive = false;

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;

  readonly form = this.fb.group({
    identificacao: this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }),
    preferencias: this.fb.group({
      aceite: [false, Validators.requiredTrue],
      prioridade: [null as number | null, Validators.required],
    }),
  });

  summaryItems: ValidationSummaryItem[] = [];
  summaryVisible = false;

  /** Demo: resumo de erros fixo no topo da tela (`app-validation-summary` com `[pinned]="true"`). */
  summaryPinned = false;

  ngOnInit(): void {
    subscribeLiveValidationSummarySync(this.destroyRef, {
      root: this.form,
      meta: RESUMO_FIELD_META as Record<
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

  onCloseSummaryPanel(): void {
    this.summaryVisible = false;
    this.summaryLive = false;
    this.cdr.markForCheck();
  }

  /** Ao mudar o modo pinned, limpa o formulário e o resumo para voltar a testar «Validar». */
  onSummaryPinnedChange(): void {
    const value = {
      identificacao: { nome: '', email: '' },
      preferencias: { aceite: false, prioridade: null },
    };
    // `FormGroup.reset()` não repõe `FormGroupDirective.submitted`; `resetForm` do directive sim.
    if (this.resumoFormDir) {
      this.resumoFormDir.resetForm(value);
    } else {
      this.form.reset(value);
    }
    this.summaryItems = [];
    this.summaryVisible = false;
    this.summaryLive = false;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.summaryItems = collectValidationSummaryItems(
        this.form,
        '',
        RESUMO_FIELD_META as Record<
          string,
          { label: string; fieldId: string }
        >,
      );
      this.summaryVisible = true;
      this.summaryLive = true;
    } else {
      this.summaryItems = [];
      this.summaryVisible = false;
      this.summaryLive = false;
    }
    this.cdr.markForCheck();
  }
}
