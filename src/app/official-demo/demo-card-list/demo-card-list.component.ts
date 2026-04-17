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
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import { ConfirmDialogService } from 'structra-ui';
import { TextFieldComponent } from 'structra-ui';
import {
  CardListComponent,
  type CardListMapFn,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  LayoutStackAlign,
  LayoutStackComponent,
  ValidationSummaryComponent,
  subscribeMarkForCheckOnInvalidUiRefresh,
  type ValidationSummaryItem,
} from 'structra-ui';
import { collectValidationSummaryItems } from '../_utils/collect-validation-summary-items';
import { filtrarPessoasPorConsulta } from '../_utils/filtrar-pessoas-consulta';
import { subscribeLiveValidationSummarySync } from '../_utils/live-validation-summary.sync';
import {
  type PessoaGridItem,
  generateDemoPessoas,
} from '../demo-grid/_utils/generate-demo-pessoas';

const CARD_LIST_DEMO_META: Record<string, { label: string; fieldId: string }> = {
  'pessoa.nome': { label: 'Nome', fieldId: 'demo-card-list-nome' },
  'pessoa.sobrenome': { label: 'Sobrenome', fieldId: 'demo-card-list-sobrenome' },
};

@Component({
  selector: 'app-demo-card-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextFieldComponent,
    BaseButtonComponent,
    LayoutStackComponent,
    FormColComponent,
    FormGroupComponent,
    FormRowComponent,
    ValidationSummaryComponent,
    CardListComponent,
  ],
  templateUrl: './demo-card-list.component.html',
  styleUrl: './demo-card-list.component.scss',
})
export class DemoCardListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly confirmDialog = inject(ConfirmDialogService);

  @ViewChild(FormGroupDirective) private formDir?: FormGroupDirective;

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly LayoutStackAlign = LayoutStackAlign;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;

  readonly form = this.fb.group({
    pessoa: this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
    }),
    consulta: this.fb.group({
      nome: [''],
      sobrenome: [''],
    }),
  });

  pessoas: PessoaGridItem[] = generateDemoPessoas(500);
  pessoasConsulta: PessoaGridItem[] = [];

  /** Demo: simula loading breve ao pesquisar. */
  cardListConsultaLoading = false;

  readonly mapPessoaCard: CardListMapFn<PessoaGridItem> = (p) => ({
    title: `${p.nome} ${p.sobrenome}`.trim(),
    subtitle: `ID ${p.id}`,
    avatarText: `${(p.nome?.charAt(0) ?? '?')}${(p.sobrenome?.charAt(0) ?? '?')}`,
  });

  summaryItems: ValidationSummaryItem[] = [];
  summaryVisible = false;
  private summaryLive = false;

  editingId: number | null = null;

  get primaryButtonLabel(): string {
    return this.editingId != null ? 'Salvar' : 'Adicionar';
  }

  ngOnInit(): void {
    subscribeMarkForCheckOnInvalidUiRefresh(
      this.form,
      this.hostRef.nativeElement,
      this.cdr,
      this.destroyRef,
    );
    subscribeLiveValidationSummarySync(this.destroyRef, {
      root: this.form,
      meta: CARD_LIST_DEMO_META,
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
    this.pessoasConsulta = this.filtrarConsulta();
  }

  onPesquisar(): void {
    this.cardListConsultaLoading = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      this.pessoasConsulta = this.filtrarConsulta();
      this.cardListConsultaLoading = false;
      this.cdr.markForCheck();
    }, 220);
  }

  onLimparConsulta(): void {
    this.form.patchValue({ consulta: { nome: '', sobrenome: '' } });
    this.onPesquisar();
  }

  private filtrarConsulta(): PessoaGridItem[] {
    const raw = this.form.get('consulta')?.getRawValue() as {
      nome: string;
      sobrenome: string;
    };
    return filtrarPessoasPorConsulta(this.pessoas, raw ?? { nome: '', sobrenome: '' });
  }

  private reaplicarConsultaAposMudancaLista(): void {
    this.pessoasConsulta = this.filtrarConsulta();
  }

  onCloseSummaryPanel(): void {
    this.summaryVisible = false;
    this.summaryLive = false;
    this.cdr.markForCheck();
  }

  onAdicionarOuSalvar(): void {
    const pessoa = this.form.get('pessoa');
    if (!pessoa || pessoa.invalid) {
      this.form.markAllAsTouched();
      this.summaryItems = collectValidationSummaryItems(
        this.form,
        '',
        CARD_LIST_DEMO_META,
      );
      this.summaryVisible = true;
      this.summaryLive = true;
      this.cdr.markForCheck();
      return;
    }

    const raw = pessoa.getRawValue() as { nome: string; sobrenome: string };
    const nome = raw.nome.trim();
    const sobrenome = raw.sobrenome.trim();

    this.pararResumoAoVivoELimpar();

    if (this.editingId != null) {
      this.pessoas = this.pessoas.map((p) =>
        p.id === this.editingId ? { ...p, nome, sobrenome } : p,
      );
      this.editingId = null;
      this.resetFormulario();
    } else {
      const nextId = this.nextId();
      this.pessoas = [{ id: nextId, nome, sobrenome }, ...this.pessoas];
      this.resetFormulario();
    }

    this.reaplicarConsultaAposMudancaLista();
    this.cdr.markForCheck();
  }

  cancelarEdicao(): void {
    this.editingId = null;
    this.pararResumoAoVivoELimpar();
    this.resetFormulario();
    this.cdr.markForCheck();
  }

  private pararResumoAoVivoELimpar(): void {
    this.summaryItems = [];
    this.summaryVisible = false;
    this.summaryLive = false;
  }

  onCardEdit(row: PessoaGridItem): void {
    this.editingId = row.id;
    this.form.patchValue({
      pessoa: { nome: row.nome, sobrenome: row.sobrenome },
    });
    this.cdr.markForCheck();
  }

  onCardRemove(row: PessoaGridItem): void {
    void this.confirmRemoveRow(row);
  }

  private async confirmRemoveRow(row: PessoaGridItem): Promise<void> {
    const ok = await this.confirmDialog.confirm({
      title: 'Remover pessoa',
      message: `Deseja remover ${row.nome} ${row.sobrenome} da lista?`,
      confirmLabel: 'Sim',
      cancelLabel: 'Não',
      variant: 'danger',
    });
    if (!ok) {
      return;
    }
    if (this.editingId === row.id) {
      this.cancelarEdicao();
    }
    this.pessoas = this.pessoas.filter((p) => p.id !== row.id);
    this.reaplicarConsultaAposMudancaLista();
    this.cdr.markForCheck();
  }

  private nextId(): number {
    return this.pessoas.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  }

  private resetFormulario(): void {
    const consultaVal =
      (this.form.get('consulta')?.value as { nome: string; sobrenome: string }) ?? {
        nome: '',
        sobrenome: '',
      };
    const value = {
      pessoa: { nome: '', sobrenome: '' },
      consulta: consultaVal,
    };
    this.formDir?.resetForm(value);
    if (!this.formDir) {
      this.form.reset(value);
    }
  }
}
