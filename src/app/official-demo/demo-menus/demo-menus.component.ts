import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  BaseButtonComponent,
  BaseButtonType,
  BaseButtonVariant,
} from 'structra-ui';
import {
  DropdownSearchFieldComponent,
  MultiselectFieldComponent,
  SelectFieldComponent,
  type DropdownSearchPageRequested,
  type SelectPageRequested,
} from 'structra-ui';
import {
  CepFieldComponent,
  CpfCnpjFieldComponent,
  DateFieldComponent,
  DecimalFieldComponent,
  IntegerFieldComponent,
  PasswordFieldComponent,
  PhoneFieldComponent,
  TextareaFieldComponent,
  TextFieldComponent,
} from 'structra-ui';
import {
  ActionMenuComponent,
  ContextMenuComponent,
  DrawerComponent,
  DropdownMenuComponent,
  DrawerSide,
  DrawerSize,
  MenuDropdownPlacement,
  type MenuNodeItem,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
  LayoutStackAlign,
  LayoutStackComponent,
} from 'structra-ui';
import { DemoEstadosBindings } from '../_models/demo-estados-bindings.model';
import {
  DEMO_FIELD_CTX_MENU_ACTION,
  DEMO_FIELD_CTX_MENU_DROPDOWN,
  DEMO_FIELD_CTX_MENU_GROUPED,
  DEMO_FIELD_CTX_MENU_SUBMENU,
} from '../_models/demo-field-context-menu-presets';

@Component({
  selector: 'app-demo-menus',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    LayoutStackComponent,
    BaseButtonComponent,
    DropdownMenuComponent,
    ActionMenuComponent,
    ContextMenuComponent,
    DrawerComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    PasswordFieldComponent,
    IntegerFieldComponent,
    DecimalFieldComponent,
    DateFieldComponent,
    CepFieldComponent,
    CpfCnpjFieldComponent,
    PhoneFieldComponent,
    DropdownSearchFieldComponent,
    SelectFieldComponent,
    MultiselectFieldComponent,
  ],
  templateUrl: './demo-menus.component.html',
  styleUrl: './demo-menus.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoMenusComponent {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  @Input({ required: true }) estados!: DemoEstadosBindings;

  @Output() readonly estadosPage = new EventEmitter<SelectPageRequested>();
  @Output() readonly estadosBuscaPage = new EventEmitter<DropdownSearchPageRequested>();

  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly LayoutStackAlign = LayoutStackAlign;
  readonly MenuDropdownPlacement = MenuDropdownPlacement;
  readonly DrawerSide = DrawerSide;
  readonly DrawerSize = DrawerSize;

  readonly formCtx = this.fb.group({
    estadoBusca: [null as string | null],
    texto: [''],
    observacao: [''],
    senha: [''],
    inteiro: [null as number | null],
    decimal: [null as number | null],
    data: [null as string | null],
    cep: [''],
    cpfCnpj: [''],
    telefone: [''],
    telefoneFixo: [''],
    select: [null as string | null],
    multi: [[] as string[]],
  });

  drawerOpen = false;

  /** Cartão «Dropdown» e campos que usam o preset «dropdown» no sufixo. */
  readonly dropdownItems = DEMO_FIELD_CTX_MENU_DROPDOWN;

  readonly contextItems: MenuNodeItem<string>[] = [
    { kind: 'item', id: 'copiar', label: 'Copiar', icon: 'fa-solid fa-copy' },
    { kind: 'divider' },
    {
      kind: 'item',
      id: 'bloqueado',
      label: 'Ação bloqueada',
      disabled: true,
    },
    { kind: 'item', id: 'colar', label: 'Colar', icon: 'fa-solid fa-paste' },
  ];

  /** Cartão «Action menu» e campos com o mesmo preset no sufixo. */
  readonly actionMenuDemoItems = DEMO_FIELD_CTX_MENU_ACTION;

  /** Cartão «Grupos e divisores». */
  readonly groupedMenuDemoItems = DEMO_FIELD_CTX_MENU_GROUPED;

  /** Cartão «Submenus». */
  readonly submenuDemoItems = DEMO_FIELD_CTX_MENU_SUBMENU;

  /** Presets para o botão «…» — o mesmo `MenuNodeItem[]` dos cartões acima. */
  readonly ctxMenuCampoDropdown = DEMO_FIELD_CTX_MENU_DROPDOWN;
  readonly ctxMenuCampoAction = DEMO_FIELD_CTX_MENU_ACTION;
  readonly ctxMenuCampoGrouped = DEMO_FIELD_CTX_MENU_GROUPED;
  readonly ctxMenuCampoSubmenu = DEMO_FIELD_CTX_MENU_SUBMENU;

  lastAction = '—';

  onMenuSelect(id: string): void {
    this.lastAction = id;
  }

  onCampoContextSelect(campo: string, id: string): void {
    this.lastAction = `${campo} → ${id}`;
  }

  openDrawer(): void {
    this.drawerOpen = true;
  }
}
