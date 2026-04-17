import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import {
  CardListComponent,
  DataGridComponent,
  type CardListMapFn,
  type DataGridColumn,
  type DataGridPaginationChangeEvent,
} from 'structra-ui';
import {
  DropdownSearchFieldComponent,
  MultiselectFieldComponent,
  SelectFieldComponent,
  type DropdownSearchPageRequested,
  type SelectPageRequested,
  type UiSelectOption,
} from 'structra-ui';
import {
  CheckboxFieldComponent,
  SwitchFieldComponent,
} from 'structra-ui';
import {
  BR_ESTADOS_NOME_SIGLA,
  CepFieldComponent,
  CpfCnpjFieldComponent,
  DateFieldComponent,
  DecimalFieldComponent,
  IntegerFieldComponent,
  PasswordFieldComponent,
  PhoneFieldComponent,
  TextFieldComponent,
  TextareaFieldComponent,
  mapEstadosToOptions,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
} from 'structra-ui';
import {
  type PessoaGridItem,
  generateDemoPessoas,
} from '../demo-grid/_utils/generate-demo-pessoas';
import { DEMO_SIMULATED_IO_GRID_MS } from '../_utils/demo-async-sim.util';

@Component({
  selector: 'app-demo-loading-skeleton',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseButtonComponent,
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    DataGridComponent,
    CardListComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    PasswordFieldComponent,
    IntegerFieldComponent,
    DecimalFieldComponent,
    DateFieldComponent,
    CepFieldComponent,
    DropdownSearchFieldComponent,
    SelectFieldComponent,
    MultiselectFieldComponent,
    CpfCnpjFieldComponent,
    PhoneFieldComponent,
    CheckboxFieldComponent,
    SwitchFieldComponent,
  ],
  templateUrl: './demo-loading-skeleton.component.html',
  styleUrl: './demo-loading-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoLoadingSkeletonComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;

  readonly form = this.fb.group({
    texto: [''],
    observacao: [''],
    senha: [''],
    inteiro: [null as number | null],
    decimal: [null as number | null],
    data: [null as string | null],
    cep: [''],
    estadoBusca: [null as string | null],
    select: [null as string | null],
    multi: [[] as string[]],
    cpfCnpj: [''],
    telefone: [''],
    telefoneFixo: [''],
    aceite: [false],
    ativo: [false],
  });

  gridLoading = false;
  cardLoading = false;
  cardLoadingMore = false;
  inputLoading = false;
  selectFieldLoading = false;
  selectOptionsLoading = false;
  multiFieldLoading = false;
  multiOptionsLoading = false;
  comboboxFieldLoading = false;
  comboboxOptionsLoading = false;

  readonly skelPageSizeEstados = 10;
  readonly skelPageSizeBusca = 5;

  estadoSelectOpts: UiSelectOption<string>[] = [];
  estadoSelectHasMore = true;
  estadoSelectLoadingMore = false;

  estadoMultiOpts: UiSelectOption<string>[] = [];
  estadoMultiHasMore = true;
  estadoMultiLoadingMore = false;

  estadoBuscaOpts: UiSelectOption<string>[] = [];
  estadoBuscaHasMore = true;
  estadoBuscaLoadingMore = false;

  /** Evita cliques repetidos enquanto a simulação corre. */
  simulacaoEmCurso = false;

  /** Ignora `paginationChanged` do ag-Grid logo após remontar (sincronização interna). */
  private gridPaginationSuppressUntil = 0;

  /** Página 0-based a restaurar após skeleton na grade. */
  gridRestorePage = 0;

  readonly todasPessoas: PessoaGridItem[] = generateDemoPessoas(24);

  /** Cartões em modo remoto: fatias de `todasPessoas` ao fazer scroll / “carregar mais”. */
  cardItems: PessoaGridItem[] = this.todasPessoas.slice(0, 6);

  readonly cardListTotal = this.todasPessoas.length;

  readonly gridColumns: DataGridColumn<PessoaGridItem>[] = [
    { key: 'nome', header: 'Nome', flex: 1, type: 'text', sortable: true },
    {
      key: 'sobrenome',
      header: 'Sobrenome',
      flex: 1,
      type: 'text',
      sortable: true,
    },
  ];

  readonly mapPessoaCard: CardListMapFn<PessoaGridItem> = (p) => ({
    title: `${p.nome} ${p.sobrenome}`.trim(),
    subtitle: `ID ${p.id}`,
    avatarText: `${(p.nome?.charAt(0) ?? '?')}${(p.sobrenome?.charAt(0) ?? '?')}`,
  });

  get cardListHasNext(): boolean {
    return this.cardItems.length < this.todasPessoas.length;
  }

  ngOnInit(): void {
    this.onSkelEstadosSelectPage({ page: 0, pageSize: this.skelPageSizeEstados });
    this.onSkelEstadosMultiPage({ page: 0, pageSize: this.skelPageSizeEstados });
    this.onSkelEstadosBuscaPage({
      page: 0,
      pageSize: this.skelPageSizeBusca,
      query: '',
    });
  }

  onGridPaginationChanged(ev: DataGridPaginationChangeEvent): void {
    if (this.simulacaoEmCurso) {
      return;
    }
    if (Date.now() < this.gridPaginationSuppressUntil) {
      return;
    }
    this.gridRestorePage = ev.currentPage;
    this.gridLoading = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      this.gridLoading = false;
      this.armGridPaginationSuppress();
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

  onCardListLoadMore(): void {
    if (this.simulacaoEmCurso || !this.cardListHasNext) {
      return;
    }
    this.cardLoadingMore = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      const take = 6;
      const start = this.cardItems.length;
      const chunk = this.todasPessoas.slice(start, start + take);
      this.cardItems = [...this.cardItems, ...chunk];
      this.cardLoadingMore = false;
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

  private armGridPaginationSuppress(): void {
    this.gridPaginationSuppressUntil = Date.now() + 400;
  }

  /** Ativa skeletons na grade, na lista de cartões e em todos os campos da seção «Campos». */
  simularCarregamento(): void {
    if (this.simulacaoEmCurso) {
      return;
    }
    this.simulacaoEmCurso = true;

    this.gridLoading = true;
    this.gridRestorePage = 0;
    this.cardItems = [];
    this.cardLoadingMore = false;
    this.cardLoading = true;
    this.inputLoading = true;
    this.selectFieldLoading = true;
    this.multiFieldLoading = true;
    this.comboboxFieldLoading = true;

    this.selectOptionsLoading = true;
    this.multiOptionsLoading = true;
    this.comboboxOptionsLoading = true;
    this.estadoSelectOpts = [];
    this.estadoMultiOpts = [];
    this.estadoBuscaOpts = [];
    this.estadoSelectHasMore = false;
    this.estadoMultiHasMore = false;
    this.estadoBuscaHasMore = false;

    this.cdr.markForCheck();

    window.setTimeout(() => {
      this.gridLoading = false;
      this.armGridPaginationSuppress();
      this.cardItems = this.todasPessoas.slice(0, 6);
      this.cardLoading = false;
      this.inputLoading = false;
      this.selectFieldLoading = false;
      this.multiFieldLoading = false;
      this.comboboxFieldLoading = false;

      const selSlice = BR_ESTADOS_NOME_SIGLA.slice(0, this.skelPageSizeEstados);
      this.estadoSelectOpts = mapEstadosToOptions(selSlice);
      this.estadoSelectHasMore =
        this.estadoSelectOpts.length < BR_ESTADOS_NOME_SIGLA.length;
      this.selectOptionsLoading = false;

      const mulSlice = BR_ESTADOS_NOME_SIGLA.slice(0, this.skelPageSizeEstados);
      this.estadoMultiOpts = mapEstadosToOptions(mulSlice);
      this.estadoMultiHasMore =
        this.estadoMultiOpts.length < BR_ESTADOS_NOME_SIGLA.length;
      this.multiOptionsLoading = false;

      const busSlice = BR_ESTADOS_NOME_SIGLA.slice(0, this.skelPageSizeBusca);
      this.estadoBuscaOpts = mapEstadosToOptions(busSlice);
      this.estadoBuscaHasMore =
        this.estadoBuscaOpts.length < BR_ESTADOS_NOME_SIGLA.length;
      this.comboboxOptionsLoading = false;

      this.simulacaoEmCurso = false;
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

  onSkelEstadosSelectPage(req: SelectPageRequested): void {
    this.estadoSelectLoadingMore = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      const start = req.page * req.pageSize;
      const slice = BR_ESTADOS_NOME_SIGLA.slice(start, start + req.pageSize);
      const chunk = mapEstadosToOptions(slice);
      if (req.page === 0) {
        this.estadoSelectOpts = chunk;
      } else {
        this.estadoSelectOpts = [...this.estadoSelectOpts, ...chunk];
      }
      this.estadoSelectHasMore =
        start + chunk.length < BR_ESTADOS_NOME_SIGLA.length;
      this.estadoSelectLoadingMore = false;
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

  onSkelEstadosMultiPage(req: SelectPageRequested): void {
    this.estadoMultiLoadingMore = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      const start = req.page * req.pageSize;
      const slice = BR_ESTADOS_NOME_SIGLA.slice(start, start + req.pageSize);
      const chunk = mapEstadosToOptions(slice);
      if (req.page === 0) {
        this.estadoMultiOpts = chunk;
      } else {
        this.estadoMultiOpts = [...this.estadoMultiOpts, ...chunk];
      }
      this.estadoMultiHasMore =
        start + chunk.length < BR_ESTADOS_NOME_SIGLA.length;
      this.estadoMultiLoadingMore = false;
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

  onSkelEstadosBuscaPage(req: DropdownSearchPageRequested): void {
    this.estadoBuscaLoadingMore = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      const q = req.query.trim().toLowerCase();
      const all = BR_ESTADOS_NOME_SIGLA;
      const filtered = q.length
        ? all.filter(
          (e) =>
            e.nome.toLowerCase().includes(q) ||
            e.sigla.toLowerCase() === q ||
            e.sigla.toLowerCase().includes(q),
        )
        : [...all];
      const start = req.page * req.pageSize;
      const slice = filtered.slice(start, start + req.pageSize);
      const chunk = mapEstadosToOptions(slice);
      if (req.page === 0) {
        this.estadoBuscaOpts = chunk;
      } else {
        this.estadoBuscaOpts = [...this.estadoBuscaOpts, ...chunk];
      }
      this.estadoBuscaHasMore = start + chunk.length < filtered.length;
      this.estadoBuscaLoadingMore = false;
      this.cdr.markForCheck();
    }, DEMO_SIMULATED_IO_GRID_MS);
  }

}
