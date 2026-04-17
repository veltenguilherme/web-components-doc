import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import {
  ConfirmDialogService,
  LoadingDialogService,
  ToastService,
} from 'structra-ui';
import { CheckboxFieldComponent, SwitchFieldComponent } from 'structra-ui';
import {
  CepFieldComponent,
  CpfCnpjFieldComponent,
  DateFieldComponent,
  DecimalFieldComponent,
  PhoneFieldComponent,
  TextareaFieldComponent,
  TextFieldComponent,
  cepMaskCompleteValidator,
  cpfCnpjMaskCompleteValidator,
  phoneBrMaskCompleteValidator,
} from 'structra-ui';
import {
  MultiselectFieldComponent,
  SelectFieldComponent,
  type SelectPageRequested,
  type UiSelectOption,
} from 'structra-ui';
import {
  DEMO_FIELD_CTX_MENU_ACTION,
  DEMO_FIELD_CTX_MENU_DROPDOWN,
  DEMO_FIELD_CTX_MENU_GROUPED,
  DEMO_FIELD_CTX_MENU_SUBMENU,
} from '../_models/demo-field-context-menu-presets';
import {
  AdaptiveDataViewComponent,
  DataToolbarComponent,
  type CardListMapFn,
  type DataGridColumn,
} from 'structra-ui';
import {
  FormActionsAlign,
  FormActionsComponent,
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  FormSectionComponent,
  FormTabComponent,
  FormTabsComponent,
  LayoutStackAlign,
  LayoutStackComponent,
  ValidationSummaryComponent,
  sectionHasVisibleInvalid,
  subscribeMarkForCheckOnInvalidUiRefresh,
  subtreeHasVisibleInvalid,
  type ValidationSummaryItem,
} from 'structra-ui';
import {
  collectValidationSummaryItems,
  type ValidationFieldMeta,
} from '../_utils/collect-validation-summary-items';
import {
  demoSimulatedDelay,
  DEMO_SIMULATED_CLIENTE_SAVE_MS,
  DEMO_SIMULATED_IO_MS,
} from '../_utils/demo-async-sim.util';
import { subscribeLiveValidationSummarySync } from '../_utils/live-validation-summary.sync';
import type { DemoEstadosBindings } from '../_models/demo-estados-bindings.model';
import type { DemoContatoCliente, DemoContatoGridRow } from './_models/demo-cliente-contato.model';

const CLIENTE_FIELD_META: ValidationFieldMeta = {
  'identificacao.razaoSocial': {
    label: 'Razão social / Nome',
    fieldId: 'demo-cli-razao',
  },
  'identificacao.cpfCnpj': { label: 'CPF/CNPJ', fieldId: 'demo-cli-doc' },
  'identificacao.tipoPessoa': {
    label: 'Tipo de pessoa',
    fieldId: 'demo-cli-tipo-pessoa',
  },
  'contatoPrincipal.email': { label: 'E-mail', fieldId: 'demo-cli-email' },
  'endereco.cep': { label: 'CEP', fieldId: 'demo-cli-cep' },
  'endereco.logradouro': { label: 'Logradouro', fieldId: 'demo-cli-logra' },
  'endereco.numero': { label: 'Número', fieldId: 'demo-cli-num' },
  'endereco.bairro': { label: 'Bairro', fieldId: 'demo-cli-bairro' },
  'endereco.cidade': { label: 'Cidade', fieldId: 'demo-cli-cidade' },
  'endereco.estado': { label: 'Estado', fieldId: 'demo-cli-estado' },
  'comercial.status': { label: 'Status', fieldId: 'demo-cli-status' },
  'abasCliente.obrigatorio.referenciaInterna': {
    label: 'Referência interna',
    fieldId: 'demo-cli-abas-ref',
  },
  'abasCliente.obrigatorio.setorResponsavel': {
    label: 'Área / setor',
    fieldId: 'demo-cli-abas-setor',
  },
};

/** Registro da lista «Consulta» (demo em memória). */
interface ClienteSalvoMemoria {
  id: string;
  formRaw: Record<string, unknown>;
  contatos: DemoContatoCliente[];
}

/** Linha da grade de clientes guardados. */
type ClienteListaGridRow = {
  id: string;
  razaoSocial: string;
  cidade: string;
  tipoPessoa: string;
  emailPrincipal: string;
};

@Component({
  selector: 'app-demo-formulario-exemplo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseButtonComponent,
    LayoutStackComponent,
    FormGroupComponent,
    FormSectionComponent,
    FormRowComponent,
    FormColComponent,
    FormActionsComponent,
    FormTabComponent,
    FormTabsComponent,
    ValidationSummaryComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    CpfCnpjFieldComponent,
    CepFieldComponent,
    PhoneFieldComponent,
    DateFieldComponent,
    DecimalFieldComponent,
    SelectFieldComponent,
    MultiselectFieldComponent,
    CheckboxFieldComponent,
    SwitchFieldComponent,
    DataToolbarComponent,
    AdaptiveDataViewComponent,
  ],
  templateUrl: './demo-formulario-exemplo.component.html',
  styleUrl: './demo-formulario-exemplo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoFormularioExemploComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly toast = inject(ToastService);
  private readonly loadingDialog = inject(LoadingDialogService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  @ViewChild('clienteSummaryAnchor', { read: ElementRef })
  private clienteSummaryAnchor?: ElementRef<HTMLElement>;

  @ViewChild(FormGroupDirective, { static: false })
  private clienteFormDirective?: FormGroupDirective;

  /** `FormGroupDirective` do subgrupo de contato — `onSubmit` marca `submitted` para a UI dos campos. */
  @ViewChild('contatoEdicaoFormDir', { read: FormGroupDirective, static: false })
  private contatoEdicaoFormDir?: FormGroupDirective;

  @Input({ required: true }) estados!: DemoEstadosBindings;
  @Output() readonly estadosPage = new EventEmitter<SelectPageRequested>();

  readonly BaseButtonType = BaseButtonType;
  readonly LayoutStackAlign = LayoutStackAlign;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly FormActionsAlign = FormActionsAlign;

  /**
   * Presets do menu «…» (mesmos `MenuNodeItem[]` da demo Menus: dropdown, action, grupos, submenu).
   * Cada campo com sufixo usa um preset diferente para mostrar a árvore completa.
   */
  readonly formCtxMenuRazao = DEMO_FIELD_CTX_MENU_DROPDOWN;
  readonly formCtxMenuCpf = DEMO_FIELD_CTX_MENU_ACTION;
  readonly formCtxMenuEmail = DEMO_FIELD_CTX_MENU_GROUPED;
  readonly formCtxMenuCep = DEMO_FIELD_CTX_MENU_SUBMENU;
  readonly formCtxMenuUf = DEMO_FIELD_CTX_MENU_DROPDOWN;
  readonly formCtxMenuObs = DEMO_FIELD_CTX_MENU_ACTION;

  /** Última escolha no menu contextual de exemplo (`—` se ainda não houve). */
  formularioContextoDemo = '—';

  readonly tipoPessoaOptions: UiSelectOption<string>[] = [
    { label: 'Pessoa física', value: 'PF' },
    { label: 'Pessoa jurídica', value: 'PJ' },
  ];

  readonly statusClienteOptions: UiSelectOption<string>[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Prospecto', value: 'prospecto' },
    { label: 'Suspenso', value: 'suspenso' },
  ];

  readonly faixaFaturamentoOptions: UiSelectOption<string>[] = [
    { label: 'Até R$ 120 mil', value: 'ate120' },
    { label: 'R$ 120 mil a R$ 480 mil', value: '120_480' },
    { label: 'R$ 480 mil a R$ 4,8 mi', value: '480_4800' },
    { label: 'Acima de R$ 4,8 mi', value: 'acima4800' },
  ];

  readonly segmentosOptions: UiSelectOption<string>[] = [
    { label: 'Indústria', value: 'industria' },
    { label: 'Comércio', value: 'comercio' },
    { label: 'Serviços', value: 'servicos' },
    { label: 'Tecnologia', value: 'tech' },
    { label: 'Saúde', value: 'saude' },
  ];

  readonly categoriaAtendimentoOptions: UiSelectOption<string>[] = [
    { label: 'Padrão', value: 'padrao' },
    { label: 'Premium', value: 'premium' },
    { label: 'VIP', value: 'vip' },
  ];

  readonly prioridadeOptions: UiSelectOption<string>[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'Média', value: 'media' },
    { label: 'Alta', value: 'alta' },
  ];

  clienteForm = this.fb.group({
    identificacao: this.fb.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      cpfCnpj: ['', [Validators.required, cpfCnpjMaskCompleteValidator()]],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],
      tipoPessoa: ['PJ' as string | null, Validators.required],
    }),
    contatoPrincipal: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', phoneBrMaskCompleteValidator(false)],
      celular: ['', phoneBrMaskCompleteValidator(false)],
      site: [''],
    }),
    endereco: this.fb.group({
      cep: ['', [Validators.required, cepMaskCompleteValidator()]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: [null as string | null, Validators.required],
    }),
    comercial: this.fb.group({
      limiteCredito: [null as number | null],
      faixaFaturamento: [null as string | null],
      status: ['inativo' as string | null, Validators.required],
      segmentos: [[] as string[]],
      observacoes: [''],
    }),
    preferencias: this.fb.group({
      aceitaComunicacoes: [true],
      clienteAtivo: [true],
      categoriaAtendimento: ['padrao' as string | null],
      prioridade: ['normal' as string | null],
      dataCadastro: [null as string | null],
      responsavelInterno: [''],
    }),
    abasCliente: this.fb.group({
      obrigatorio: this.fb.group({
        referenciaInterna: ['', Validators.required],
        setorResponsavel: ['', Validators.required],
      }),
      opcional: this.fb.group({
        notasAdicionais: [''],
        codigoConvenio: [''],
      }),
    }),
    consultaCadastros: this.fb.group({
      termo: [''],
    }),
  });

  contatoEdicaoForm = this.fb.group({
    nome: ['', Validators.required],
    cargo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', phoneBrMaskCompleteValidator(true)],
    celular: ['', phoneBrMaskCompleteValidator(false)],
    ativo: [true],
  });

  contatos: DemoContatoCliente[] = [];

  /** Grade de contatos: atualizado quando a lista em memória muda. */
  contatosFiltradosRows: DemoContatoGridRow[] = [];

  /** Grade de clientes guardados: atualizado só quando a lista ou o termo mudam. */
  clientesListaFiltradosRows: ClienteListaGridRow[] = [];

  /** Lista em memória após «Salvar»; `id` coincide com edição ativa quando aplicável. */
  clientesSalvos: ClienteSalvoMemoria[] = [];

  /** `null` = novo cadastro; caso contrário, índice na lista ao regravar. */
  clienteEdicaoListaId: string | null = null;

  contatoEdicaoId: string | null = null;

  /** Aba ativa em «Dados extra (abas)» (exemplo `app-form-tabs` no mesmo `clienteForm`). */
  abasClienteActiveKey: 'obrigatorio' | 'opcional' = 'obrigatorio';

  clienteSummaryItems: ValidationSummaryItem[] = [];
  clienteSummaryVisible = false;
  private clienteSummaryLive = false;
  private clienteSubmitAttempted = false;

  /** Skeleton / `loading` nos campos enquanto se simula persistência após «Salvar» válido. */
  clienteSalvarLoading = false;

  /** Resumo fixo no topo do viewport (`app-validation-summary` com `[pinned]="true"`). */
  readonly clienteValidationSummaryPinned = true;

  /**
   * `true` após «Adicionar contato» / «Salvar» com erros: alinha o ícone do grupo «Contatos» a
   * `subtreeHasVisibleInvalid` sem resumo de validação no subformulário.
   */
  private contatoCadastroSubmitAttempted = false;

  contatosListaLoading = false;

  readonly contatosGridColumns: DataGridColumn<DemoContatoGridRow>[] = [
    { key: 'nome', header: 'Nome', flex: 1.2, type: 'text', sortable: true },
    { key: 'cargo', header: 'Cargo', flex: 1, type: 'text', sortable: true },
    { key: 'email', header: 'E-mail', flex: 1.2, type: 'text', sortable: true },
    { key: 'telefone', header: 'Telefone', flex: 0.9, type: 'text', sortable: false },
    { key: 'celular', header: 'Celular', flex: 0.9, type: 'text', sortable: false },
    { key: 'principal', header: 'Principal', width: 100, type: 'text', sortable: false },
    { key: 'ativo', header: 'Ativo', width: 80, type: 'text', sortable: false },
    { key: '__actions', header: 'Ações', type: 'actions', width: 168 },
  ];

  readonly mapContatoCard: CardListMapFn<DemoContatoGridRow> = (row) => ({
    title: row.nome,
    subtitle: `${row.cargo} · ${row.email}${row.principal === 'Sim' ? ' · Principal' : ''}`,
    avatarText: `${row.nome.charAt(0) ?? '?'}${(row.cargo?.charAt(0) ?? '?').toUpperCase()}`,
  });

  readonly clientesListaGridColumns: DataGridColumn<ClienteListaGridRow>[] = [
    { key: 'razaoSocial', header: 'Razão social / Nome', flex: 1.4, type: 'text', sortable: true },
    { key: 'cidade', header: 'Cidade', flex: 1, type: 'text', sortable: true },
    { key: 'tipoPessoa', header: 'Tipo', width: 140, type: 'text', sortable: true },
    { key: 'emailPrincipal', header: 'E-mail', flex: 1.2, type: 'text', sortable: true },
    { key: '__actions', header: 'Ações', type: 'actions', width: 168 },
  ];

  readonly mapClienteListaCard: CardListMapFn<ClienteListaGridRow> = (row) => ({
    title: row.razaoSocial || '—',
    subtitle: `${row.cidade || '—'} · ${row.tipoPessoa} · ${row.emailPrincipal || '—'}`,
    avatarText: (row.razaoSocial?.trim().charAt(0) ?? '?').toUpperCase(),
  });

  ngOnInit(): void {
    subscribeMarkForCheckOnInvalidUiRefresh(
      this.clienteForm,
      this.hostRef.nativeElement,
      this.cdr,
      this.destroyRef,
    );

    subscribeLiveValidationSummarySync(this.destroyRef, {
      root: this.clienteForm,
      meta: CLIENTE_FIELD_META,
      isLive: () => this.clienteSummaryLive,
      onSynced: (items) => {
        this.clienteSummaryItems = items;
        if (items.length === 0) {
          this.clienteSummaryLive = false;
          this.clienteSummaryVisible = false;
        }
      },
      markForCheck: () => this.cdr.markForCheck(),
    });

    merge(
      this.contatoEdicaoForm.valueChanges,
      this.contatoEdicaoForm.statusChanges,
    )
      .pipe(debounceTime(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    this.clienteForm
      .get('consultaCadastros')
      ?.valueChanges.pipe(debounceTime(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.atualizarFilasFiltradas());

    this.atualizarFilasFiltradas();

    queueMicrotask(() => this.simularCargaInicialContatos());
  }

  private simularCargaInicialContatos(): void {
    this.contatosListaLoading = true;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      this.contatosListaLoading = false;
      this.cdr.markForCheck();
    }, 450);
  }

  /** Recalcula linhas da grade de contatos e da grade de clientes guardados. */
  private atualizarFilasFiltradas(): void {
    this.contatosFiltradosRows = this.contatos.map((c) => this.toGridRow(c));

    const qCli = (
      this.clienteForm.get('consultaCadastros.termo')?.value ?? ''
    )
      .toString()
      .trim()
      .toLowerCase();
    const rowsCli = this.clientesSalvos.map((r) => this.toClienteListaRow(r));
    this.clientesListaFiltradosRows = !qCli.length
      ? rowsCli
      : rowsCli.filter(
        (r) =>
          r.razaoSocial.toLowerCase().includes(qCli) ||
          r.cidade.toLowerCase().includes(qCli) ||
          r.emailPrincipal.toLowerCase().includes(qCli) ||
          r.tipoPessoa.toLowerCase().includes(qCli),
      );

    this.cdr.markForCheck();
  }

  async onClienteListaEdit(row: ClienteListaGridRow): Promise<void> {
    const ref = this.loadingDialog.open({
      message: 'Carregando…',
    });
    try {
      await demoSimulatedDelay(DEMO_SIMULATED_IO_MS);
      const reg = this.clientesSalvos.find((c) => c.id === row.id);
      if (!reg) {
        return;
      }
      this.clienteEdicaoListaId = reg.id;
      /*
       * Repor sempre o estado do `clienteForm` antes do `patchValue`: evita valores, `dirty`/`touched`
       * e validações pendentes de um rascunho anterior ao carregar o registro da lista.
       */
      this.resetClienteFormParaNovoCadastro();
      this.clienteForm.patchValue(reg.formRaw as never, { emitEvent: true });
      this.limparFlagSubmetidoClienteForm();
      this.clienteForm.markAsUntouched();
      this.clienteForm.markAsPristine();
      this.clienteForm.updateValueAndValidity({ emitEvent: true });
      this.contatos = reg.contatos.map((c) => ({ ...c }));
      this.resetContatoEdicao();
      this.clienteSubmitAttempted = false;
      this.contatoCadastroSubmitAttempted = false;
      this.clienteSummaryVisible = false;
      this.clienteSummaryLive = false;
      this.clienteSummaryItems = [];
      this.abasClienteActiveKey = 'obrigatorio';
      this.atualizarFilasFiltradas();
      this.cdr.markForCheck();
    } finally {
      ref.close();
    }
  }

  onClienteListaRemove(row: ClienteListaGridRow): void {
    void this.confirmRemoveClienteLista(row);
  }

  private async confirmRemoveClienteLista(row: ClienteListaGridRow): Promise<void> {
    const ok = await this.confirmDialog.confirm({
      title: 'Remover cliente',
      message: `Deseja remover ${row.razaoSocial} da lista em memória?`,
      confirmLabel: 'Sim',
      cancelLabel: 'Não',
      variant: 'danger',
    });
    if (!ok) {
      return;
    }
    this.clientesSalvos = this.clientesSalvos.filter((c) => c.id !== row.id);
    if (this.clienteEdicaoListaId === row.id) {
      this.clienteEdicaoListaId = null;
      this.resetClienteFormParaNovoCadastro();
      this.contatos = [];
      this.resetContatoEdicao();
      this.clienteSubmitAttempted = false;
    }
    this.atualizarFilasFiltradas();
    this.cdr.markForCheck();
  }

  private toGridRow(c: DemoContatoCliente): DemoContatoGridRow {
    return {
      id: c.id,
      nome: c.nome,
      cargo: c.cargo,
      email: c.email,
      telefone: c.telefone || '—',
      celular: c.celular || '—',
      principal: c.principal ? 'Sim' : 'Não',
      ativo: c.ativo ? 'Sim' : 'Não',
    };
  }

  private toClienteListaRow(reg: ClienteSalvoMemoria): ClienteListaGridRow {
    const idf = reg.formRaw['identificacao'] as Record<string, unknown> | undefined;
    const cp = reg.formRaw['contatoPrincipal'] as Record<string, unknown> | undefined;
    const end = reg.formRaw['endereco'] as Record<string, unknown> | undefined;
    const tipoCod = (idf?.['tipoPessoa'] as string | null | undefined) ?? '';
    return {
      id: reg.id,
      razaoSocial: ((idf?.['razaoSocial'] as string | undefined) ?? '').toString(),
      cidade: ((end?.['cidade'] as string | undefined) ?? '').toString(),
      tipoPessoa: this.labelTipoPessoa(tipoCod),
      emailPrincipal: ((cp?.['email'] as string | undefined) ?? '').toString(),
    };
  }

  private labelTipoPessoa(cod: string): string {
    const opt = this.tipoPessoaOptions.find((o) => o.value === cod);
    return opt?.label ?? cod;
  }

  /** Grava no snapshot tudo excepto o termo da consulta de clientes (mantém-se na toolbar). */
  private snapshotClienteFormParaPersistencia(): Record<string, unknown> {
    const full = this.clienteForm.getRawValue() as Record<string, unknown> & {
      consultaCadastros?: unknown;
    };
    const { consultaCadastros: _omit, ...rest } = full;
    return rest;
  }

  /**
   * Após `ngSubmit`, o `FormGroupDirective` mantém `submitted === true`; `FormGroup.reset()` não repõe.
   * Isso faz `controlInvalidUi` mostrar erro em campos inválidos mesmo sem `dirty` (ex.: após «Editar»).
   */
  private limparFlagSubmetidoClienteForm(): void {
    const dir = this.clienteFormDirective as { submitted?: boolean } | undefined;
    if (dir) {
      dir.submitted = false;
    }
  }

  private resetClienteFormParaNovoCadastro(): void {
    const termoCadastros = this.clienteForm.get('consultaCadastros.termo')?.value ?? '';
    const value = {
      identificacao: {
        razaoSocial: '',
        nomeFantasia: '',
        cpfCnpj: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        tipoPessoa: 'PJ',
      },
      contatoPrincipal: {
        email: '',
        telefone: '',
        celular: '',
        site: '',
      },
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: null,
      },
      comercial: {
        limiteCredito: null,
        faixaFaturamento: null,
        status: 'inativo',
        segmentos: [],
        observacoes: '',
      },
      preferencias: {
        aceitaComunicacoes: true,
        clienteAtivo: true,
        categoriaAtendimento: 'padrao',
        prioridade: 'normal',
        dataCadastro: null,
        responsavelInterno: '',
      },
      abasCliente: {
        obrigatorio: { referenciaInterna: '', setorResponsavel: '' },
        opcional: { notasAdicionais: '', codigoConvenio: '' },
      },
      consultaCadastros: { termo: termoCadastros },
    };
    if (this.clienteFormDirective) {
      this.clienteFormDirective.resetForm(value);
    } else {
      this.clienteForm.reset(value);
      this.limparFlagSubmetidoClienteForm();
    }
    this.clienteForm.markAsPristine();
    this.clienteForm.markAsUntouched();
  }

  onEstadosPage(req: SelectPageRequested): void {
    this.estadosPage.emit(req);
  }

  onValidarCliente(): void {
    this.clienteSubmitAttempted = true;
    this.clienteForm.markAllAsTouched();
    if (this.clienteForm.invalid) {
      this.clienteSummaryItems = collectValidationSummaryItems(
        this.clienteForm,
        '',
        CLIENTE_FIELD_META,
      );
      this.clienteSummaryVisible = true;
      this.clienteSummaryLive = true;
      this.cdr.markForCheck();
      if (!this.clienteValidationSummaryPinned) {
        this.scrollClienteValidationSummaryIntoView();
      }
    } else {
      this.clienteSummaryItems = [];
      this.clienteSummaryVisible = false;
      this.clienteSummaryLive = false;
      this.clienteSubmitAttempted = false;
      this.cdr.markForCheck();
    }
  }

  /** Escolha no menu «…» de exemplo (sufixo dos campos envolvidos). */
  onFormularioContextoSelect(origem: string, id: string): void {
    this.formularioContextoDemo = `${origem} → ${id}`;
    this.cdr.markForCheck();
  }

  /** Após o resumo ficar visível, leva o usuário até o painel de erros. */
  private scrollClienteValidationSummaryIntoView(): void {
    afterNextRender(
      () => {
        this.clienteSummaryAnchor?.nativeElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      { injector: this.injector },
    );
  }

  async onSalvarCliente(): Promise<void> {
    this.onValidarCliente();
    if (this.clienteForm.invalid) {
      return;
    }
    this.clienteSalvarLoading = true;
    this.cdr.markForCheck();
    try {
      await demoSimulatedDelay(DEMO_SIMULATED_CLIENTE_SAVE_MS);
      const id =
        this.clienteEdicaoListaId ??
        (typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `cli-${Date.now()}`);
      const novo: ClienteSalvoMemoria = {
        id,
        formRaw: this.snapshotClienteFormParaPersistencia(),
        contatos: this.contatos.map((c) => ({ ...c })),
      };
      const idx = this.clientesSalvos.findIndex((c) => c.id === id);
      this.clientesSalvos =
        idx >= 0
          ? [...this.clientesSalvos.slice(0, idx), novo, ...this.clientesSalvos.slice(idx + 1)]
          : [...this.clientesSalvos, novo];
      this.clienteEdicaoListaId = null;
      this.resetClienteFormParaNovoCadastro();
      this.contatos = [];
      this.resetContatoEdicao();
      this.clienteSubmitAttempted = false;
      this.clienteSummaryVisible = false;
      this.clienteSummaryLive = false;
      this.clienteSummaryItems = [];
      this.atualizarFilasFiltradas();
      this.toast.show({
        type: 'success',
        title: 'Sucesso',
        message: 'O registro foi salvo.',
        position: 'bottom',
      });
    } finally {
      this.clienteSalvarLoading = false;
      this.cdr.markForCheck();
    }
  }

  onCloseClienteSummary(): void {
    this.clienteSummaryVisible = false;
    this.clienteSummaryLive = false;
    this.cdr.markForCheck();
  }

  onBeforeClienteSummaryItem(item: ValidationSummaryItem): void {
    const fid = item.fieldId?.trim();
    if (fid === 'demo-cli-abas-ref' || fid === 'demo-cli-abas-setor') {
      this.abasClienteActiveKey = 'obrigatorio';
      this.cdr.markForCheck();
    } else if (fid === 'demo-cli-abas-notas' || fid === 'demo-cli-abas-convenio') {
      this.abasClienteActiveKey = 'opcional';
      this.cdr.markForCheck();
    }
    const el = fid ? document.getElementById(fid) : null;
    el?.focus();
  }

  onAdicionarContato(): void {
    this.contatoCadastroSubmitAttempted = true;
    this.marcarContatoEdicaoTentativaVisual();
    if (!this.validarContatoEdicao()) {
      return;
    }
    const v = this.contatoEdicaoForm.getRawValue();
    const primeiroContato = this.contatos.length === 0;
    const novo: DemoContatoCliente = {
      id: `ct-${Date.now()}`,
      nome: v.nome!.trim(),
      cargo: v.cargo!.trim(),
      email: (v.email ?? '').toString().trim(),
      telefone: (v.telefone ?? '').toString(),
      celular: (v.celular ?? '').toString(),
      principal: primeiroContato,
      ativo: !!v.ativo,
    };
    if (novo.principal) {
      this.contatos = this.contatos.map((c) => ({ ...c, principal: false }));
    }
    this.contatos = [...this.contatos, novo];
    this.resetContatoEdicao();
    this.atualizarFilasFiltradas();
  }

  onCancelarContatoEdicao(): void {
    this.resetContatoEdicao();
    this.cdr.markForCheck();
  }

  onSalvarContatoEdicao(): void {
    if (!this.contatoEdicaoId) {
      return;
    }
    this.contatoCadastroSubmitAttempted = true;
    this.marcarContatoEdicaoTentativaVisual();
    if (!this.validarContatoEdicao()) {
      return;
    }
    const v = this.contatoEdicaoForm.getRawValue();
    const id = this.contatoEdicaoId;

    let list = this.contatos.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          nome: v.nome!.trim(),
          cargo: v.cargo!.trim(),
          email: (v.email ?? '').toString().trim(),
          telefone: (v.telefone ?? '').toString(),
          celular: (v.celular ?? '').toString(),
          ativo: !!v.ativo,
          principal: c.principal,
        };
      }
      return c;
    });

    if (!list.some((c) => c.principal) && list.length > 0) {
      list = list.map((c, i) =>
        i === 0 ? { ...c, principal: true } : { ...c, principal: false },
      );
    }
    this.contatos = list;
    this.resetContatoEdicao();
    this.atualizarFilasFiltradas();
  }

  /**
   * Os campos usam `controlInvalidUi`: obrigatório + inválido + (`dirty` **ou** `FormGroupDirective.submitted`).
   * O `inject(FormGroupDirective)` dos campos pode resolver o **formulário raiz** (`clienteForm`), cujo
   * `submitted` não muda com o botão «Adicionar contato». Chamamos `onSubmit` no `FormGroupDirective` **deste**
   * `div [formGroup]="contatoEdicaoForm"` para alinhar `submitted` e disparar `ngSubmit` nos campos.
   */
  private marcarContatoEdicaoTentativaVisual(): void {
    this.contatoEdicaoForm.markAllAsTouched();
    const ev = new Event('submit', { bubbles: true, cancelable: true }) as SubmitEvent;
    this.contatoEdicaoFormDir?.onSubmit(ev);
    this.contatoEdicaoForm.updateValueAndValidity({ emitEvent: true });
  }

  private limparContatoEdicaoFormSubmitted(): void {
    const d = this.contatoEdicaoFormDir as { submitted?: boolean } | undefined;
    if (d) {
      d.submitted = false;
    }
  }

  private resetContatoEdicao(): void {
    this.contatoEdicaoId = null;
    this.contatoEdicaoForm.reset({
      nome: '',
      cargo: '',
      email: '',
      telefone: '',
      celular: '',
      ativo: true,
    });
    this.contatoCadastroSubmitAttempted = false;
    this.limparContatoEdicaoFormSubmitted();
  }

  async onContatoListaEdit(row: DemoContatoGridRow): Promise<void> {
    const ref = this.loadingDialog.open({
      message: 'Carregando…',
    });
    try {
      await demoSimulatedDelay(DEMO_SIMULATED_IO_MS);
      const c = this.contatos.find((x) => x.id === row.id);
      if (!c) {
        return;
      }
      this.contatoEdicaoId = c.id;
      this.contatoEdicaoForm.patchValue(
        {
          nome: c.nome,
          cargo: c.cargo,
          email: c.email,
          telefone: c.telefone,
          celular: c.celular,
          ativo: c.ativo,
        },
        { emitEvent: true },
      );
      this.contatoEdicaoForm.markAsUntouched();
      for (const key of Object.keys(this.contatoEdicaoForm.controls)) {
        this.contatoEdicaoForm.get(key)?.markAsUntouched();
      }
      this.contatoCadastroSubmitAttempted = false;
      this.limparContatoEdicaoFormSubmitted();
      this.cdr.markForCheck();
    } finally {
      ref.close();
    }
  }

  onContatoListaRemove(row: DemoContatoGridRow): void {
    void this.confirmRemoveContatoLista(row);
  }

  private async confirmRemoveContatoLista(row: DemoContatoGridRow): Promise<void> {
    const ok = await this.confirmDialog.confirm({
      title: 'Remover contato',
      message: `Deseja remover o contato ${row.nome} da lista?`,
      confirmLabel: 'Sim',
      cancelLabel: 'Não',
      variant: 'danger',
    });
    if (!ok) {
      return;
    }
    const removed = this.contatos.find((c) => c.id === row.id);
    const eraPrincipal = removed?.principal === true;
    this.contatos = this.contatos.filter((c) => c.id !== row.id);
    if (this.contatoEdicaoId === row.id) {
      this.resetContatoEdicao();
    }
    if (eraPrincipal && this.contatos.length > 0) {
      this.contatos = this.contatos.map((c, i) =>
        i === 0 ? { ...c, principal: true } : { ...c, principal: false },
      );
    }
    this.atualizarFilasFiltradas();
    this.cdr.markForCheck();
  }

  /**
   * Os campos (`controlInvalidUi`) só pintam erro com `dirty` ou `FormGroupDirective.submitted`.
   * «Adicionar contato» / «Salvar» no subformulário são `type="button"` — nunca há submit do grupo
   * de contatos; `markAllAsTouched()` não define `dirty`, por isso marcamos folhos como dirty e
   * reemitimos validação para a UI dos `app-text-field` / `app-phone-field`.
   */
  private marcarContatoEdicaoParaExibirErros(): void {
    const visit = (c: AbstractControl): void => {
      if (c instanceof FormGroup) {
        for (const key of Object.keys(c.controls)) {
          const ch = c.controls[key];
          if (ch) {
            visit(ch);
          }
        }
        return;
      }
      if (c instanceof FormArray) {
        for (let i = 0; i < c.length; i++) {
          visit(c.at(i));
        }
        return;
      }
      c.markAsDirty({ onlySelf: true });
      c.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    };
    visit(this.contatoEdicaoForm);
  }

  private validarContatoEdicao(): boolean {
    if (this.contatoEdicaoForm.invalid) {
      this.marcarContatoEdicaoParaExibirErros();
      this.cdr.markForCheck();
      return false;
    }
    this.cdr.markForCheck();
    return true;
  }

  get contatoSecaoSubtitulo(): string {
    return this.contatoEdicaoId
      ? 'Edite e confirme; a lista fica abaixo.'
      : 'Preencha e adicione; a lista fica abaixo.';
  }

  get labelBotaoPrincipalContato(): string {
    return this.contatoEdicaoId ? 'Salvar' : 'Adicionar contato';
  }

  onAcaoPrincipalContato(): void {
    if (this.contatoEdicaoId) {
      this.onSalvarContatoEdicao();
    } else {
      this.onAdicionarContato();
    }
  }

  /**
   * Critério alinhado ao `app-form-group` com `formGroupPath`: `dirty` ou formulário já submetido
   * (`FormGroupDirective.submitted` ou tentativa de validação na demo).
   */
  private clienteIconFormSubmitted(): boolean {
    return !!this.clienteFormDirective?.submitted || this.clienteSubmitAttempted;
  }

  /** Grupo pai sem `formGroupPath` único: agrega identificação + contato principal. */
  grupoIdentificacaoContatoPrincipalInvalido(): boolean {
    const s = this.clienteIconFormSubmitted();
    return (
      sectionHasVisibleInvalid(this.clienteForm, 'identificacao', s) ||
      sectionHasVisibleInvalid(this.clienteForm, 'contatoPrincipal', s)
    );
  }

  grupoAbasClienteInvalido(): boolean {
    return sectionHasVisibleInvalid(this.clienteForm, 'abasCliente', this.clienteIconFormSubmitted());
  }

  /** Aviso no separador (mesmo critério que `app-form-group` + `sectionHasVisibleInvalid`). */
  abasClienteTabWarning(tabKey: 'obrigatorio' | 'opcional'): boolean {
    return sectionHasVisibleInvalid(
      this.clienteForm,
      `abasCliente.${tabKey}`,
      this.clienteIconFormSubmitted(),
    );
  }

  /**
   * Subformulário `contatoEdicaoForm` (sem `formGroupPath` no grupo «Contatos»): o rascunho não entra no «Salvar»
   * do cliente com `clienteIconFormSubmitted()` — o aviso só após «Adicionar contato» / «Salvar» no subformulário.
   */
  grupoContatosParentInvalido(): boolean {
    const g = this.contatoEdicaoForm;
    if (!g.invalid) {
      return false;
    }
    const submittedContatoDraft =
      this.contatoCadastroSubmitAttempted || !!this.contatoEdicaoFormDir?.submitted;
    return subtreeHasVisibleInvalid(g, submittedContatoDraft);
  }
}
