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
import { DataGridComponent, type DataGridColumn } from 'structra-ui';
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
import { subscribeLiveValidationSummarySync } from '../_utils/live-validation-summary.sync';
import { filtrarPessoasPorConsulta } from '../_utils/filtrar-pessoas-consulta';
import {
  type PessoaGridItem,
  generateDemoPessoas,
} from './_utils/generate-demo-pessoas';

const GRID_DEMO_META: Record<string, { label: string; fieldId: string }> = {
  'pessoa.nome': { label: 'Nome', fieldId: 'demo-grid-nome' },
  'pessoa.sobrenome': { label: 'Sobrenome', fieldId: 'demo-grid-sobrenome' },
};

@Component({
  selector: 'app-demo-grid',
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
    DataGridComponent,
  ],
  templateUrl: './demo-grid.component.html',
  styleUrl: './demo-grid.component.scss',
})
export class DemoGridComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly confirmDialog = inject(ConfirmDialogService);

  /** Para `resetForm()` e limpar `submitted` após sucesso (evita erro vermelho nos vazios). */
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
  /** Resultado da pesquisa (somente leitura; sem coluna de ações). */
  pessoasConsulta: PessoaGridItem[] = [];

  readonly gridColumns: DataGridColumn<PessoaGridItem>[] = [
    {
      key: '__actions',
      header: 'Ações',
      type: 'actions',
      width: 104,
      sortable: false,
    },
    { key: 'nome', header: 'Nome', flex: 1, type: 'text', sortable: true },
    {
      key: 'sobrenome',
      header: 'Sobrenome',
      flex: 1,
      type: 'text',
      sortable: true,
    },
  ];

  readonly gridColumnsConsulta: DataGridColumn<PessoaGridItem>[] = [
    { key: 'nome', header: 'Nome', flex: 1, type: 'text', sortable: true },
    {
      key: 'sobrenome',
      header: 'Sobrenome',
      flex: 1,
      type: 'text',
      sortable: true,
    },
  ];

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
      meta: GRID_DEMO_META,
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
    this.pessoasConsulta = this.filtrarConsulta();
    this.cdr.markForCheck();
  }

  /** Filtro por nome e/ou sobrenome: vazio mostra tudo; com os dois termos usa OR. */
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
        GRID_DEMO_META,
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

  onGridEdit(row: PessoaGridItem): void {
    this.editingId = row.id;
    this.form.patchValue({
      pessoa: { nome: row.nome, sobrenome: row.sobrenome },
    });
    this.cdr.markForCheck();
  }

  onGridRemove(row: PessoaGridItem): void {
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
    // `FormGroupDirective.resetForm` repõe valores e `submitted = false`;
    // só `form.reset()` deixa `submitted` true e a UI trata vazios como erro.
    this.formDir?.resetForm(value);
    if (!this.formDir) {
      this.form.reset(value);
    }
  }
}
