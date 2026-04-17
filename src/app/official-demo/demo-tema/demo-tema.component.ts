import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BaseButtonComponent,
  BaseButtonType,
  BaseButtonVariant,
} from 'structra-ui';
import {
  CardListComponent,
  DataGridComponent,
  type CardListMapFn,
  type DataGridColumn,
} from 'structra-ui';
import {
  MultiselectFieldComponent,
  SelectFieldComponent,
} from 'structra-ui';
import {
  BR_ESTADOS_NOME_SIGLA,
  IntegerFieldComponent,
  TextFieldComponent,
  mapEstadosToOptions,
} from 'structra-ui';
import {
  FormActionsAlign,
  FormActionsComponent,
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  FormTabComponent,
  FormTabsComponent,
} from 'structra-ui';
import {
  AppThemeService,
  type AppThemeId,
} from 'structra-ui';
import {
  type PessoaGridItem,
  generateDemoPessoas,
} from '../demo-grid/_utils/generate-demo-pessoas';

@Component({
  selector: 'app-demo-tema',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseButtonComponent,
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    FormTabsComponent,
    FormTabComponent,
    FormActionsComponent,
    TextFieldComponent,
    IntegerFieldComponent,
    SelectFieldComponent,
    MultiselectFieldComponent,
    DataGridComponent,
    CardListComponent,
  ],
  templateUrl: './demo-tema.component.html',
  styleUrl: './demo-tema.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTemaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly theme = inject(AppThemeService);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly FormActionsAlign = FormActionsAlign;

  readonly themeIds = this.theme.themeOptions;

  readonly showcaseForm = this.fb.group({
    nome: ['', Validators.required],
    quantidade: [null as number | null, Validators.required],
    estado: [null as string | null, Validators.required],
    segmentos: [[] as string[]],
    tabA: [''],
    tabB: [''],
    invalido: ['', Validators.required],
    readonlyCampo: [{ value: 'Só leitura', disabled: false }],
    disabledCampo: [{ value: 'Desativado', disabled: true }],
  });

  readonly estadoOpts = mapEstadosToOptions(BR_ESTADOS_NOME_SIGLA.slice(0, 8));
  readonly segmentoOpts = [
    { value: 'ind', label: 'Industrial' },
    { value: 'com', label: 'Comercial' },
    { value: 'srv', label: 'Serviços' },
  ];

  readonly gridRows: PessoaGridItem[] = generateDemoPessoas(12);
  readonly gridColumns: DataGridColumn<PessoaGridItem>[] = [
    { key: 'nome', header: 'Nome', flex: 1 },
    { key: 'sobrenome', header: 'Apelido', flex: 1 },
  ];

  readonly cardItems = this.gridRows.slice(0, 4);
  readonly cardMap: CardListMapFn<PessoaGridItem> = (p) => ({
    title: p.nome,
    subtitle: p.sobrenome,
  });

  setTheme(id: AppThemeId): void {
    this.theme.setTheme(id);
  }

  primaryTabKey = 'a';

  ngOnInit(): void {
    const inv = this.showcaseForm.get('invalido');
    if (inv) {
      // A UI de erro da lib usa `dirty` ou submit do form (não só `touched`); marcar dirty
      // para o exemplo «obrigatório vazio» abrir já com borda/mensagem vermelhas na demo.
      inv.markAsDirty();
      inv.markAsTouched();
    }
  }
}
