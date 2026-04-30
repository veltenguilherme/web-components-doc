import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AppBreadcrumbComponent,
  AppShellComponent,
  AppShellSidebarTemplateDirective,
  AppSidebarBrandDirective,
  AppSidebarComponent,
  AppShellSidebarToggleComponent,
  AppSidebarToolbarDirective,
  AppTopbarComponent,
  AppUserMenuComponent,
  ButtonComponent,
  FormGroupComponent,
  LayoutStackAlign,
  LayoutStackComponent,
  type BreadcrumbItem,
  type MenuNodeItem,
} from 'structra-ui';

@Component({
  selector: 'app-demo-app-shell',
  standalone: true,
  imports: [
    FormGroupComponent,
    AppShellComponent,
    AppShellSidebarTemplateDirective,
    AppSidebarBrandDirective,
    AppSidebarComponent,
    AppShellSidebarToggleComponent,
    AppSidebarToolbarDirective,
    AppTopbarComponent,
    AppUserMenuComponent,
    AppBreadcrumbComponent,
    ButtonComponent,
    LayoutStackComponent,
  ],
  templateUrl: './demo-app-shell.component.html',
  styleUrl: './demo-app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoAppShellComponent {
  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();
  readonly LayoutStackAlign = LayoutStackAlign;

  sidebarCollapsed = false;
  mobileNavOpen = false;

  shellActiveNav = 'dashboard';

  readonly shellNavItems: MenuNodeItem<string>[] = [
    {
      kind: 'group',
      label: 'Principal',
      alwaysExpanded: true,
      items: [
        {
          kind: 'item',
          id: 'dashboard',
          label: 'Painel',
          icon: 'fa-solid fa-gauge-high',
        },
        {
          kind: 'item',
          id: 'reports',
          label: 'Relatórios',
          icon: 'fa-solid fa-chart-line',
        },
        {
          kind: 'item',
          id: 'analytics',
          label: 'Análises',
          icon: 'fa-solid fa-chart-pie',
        },
        {
          kind: 'item',
          id: 'calendar',
          label: 'Calendário',
          icon: 'fa-solid fa-calendar-days',
        },
        {
          kind: 'item',
          id: 'messages',
          label: 'Mensagens',
          icon: 'fa-solid fa-envelope',
        },
        {
          kind: 'item',
          id: 'tasks',
          label: 'Tarefas',
          icon: 'fa-solid fa-list-check',
        },
      ],
    },
    { kind: 'divider' },
    {
      kind: 'submenu',
      id: 'sub-reg',
      label: 'Registros',
      icon: 'fa-solid fa-folder-tree',
      items: [
        {
          kind: 'item',
          id: 'customers',
          label: 'Clientes',
          icon: 'fa-solid fa-users',
        },
        {
          kind: 'item',
          id: 'orders',
          label: 'Pedidos',
          icon: 'fa-solid fa-file-invoice',
        },
        {
          kind: 'item',
          id: 'suppliers',
          label: 'Fornecedores',
          icon: 'fa-solid fa-truck-field',
        },
        {
          kind: 'item',
          id: 'inventory',
          label: 'Inventário',
          icon: 'fa-solid fa-boxes-stacked',
        },
        {
          kind: 'item',
          id: 'invoices',
          label: 'Faturas',
          icon: 'fa-solid fa-file-lines',
        },
      ],
    },
    { kind: 'divider' },
    {
      kind: 'submenu',
      id: 'sub-support',
      label: 'Suporte',
      icon: 'fa-solid fa-life-ring',
      items: [
        {
          kind: 'item',
          id: 'portal-cliente',
          label: 'Portal do cliente',
          icon: 'fa-solid fa-arrow-up-right-from-square',
        },
        {
          kind: 'item',
          id: 'tickets',
          label: 'Pedidos de assistência',
          icon: 'fa-solid fa-ticket',
        },
        {
          kind: 'item',
          id: 'kb',
          label: 'Base de conhecimento',
          icon: 'fa-solid fa-book',
        },
      ],
    },
    { kind: 'divider' },
    {
      kind: 'group',
      label: 'Administração',
      items: [
        {
          kind: 'item',
          id: 'users',
          label: 'Utilizadores',
          icon: 'fa-solid fa-user-group',
        },
        {
          kind: 'item',
          id: 'roles',
          label: 'Funções e permissões',
          icon: 'fa-solid fa-user-shield',
        },
        {
          kind: 'item',
          id: 'audit',
          label: 'Auditoria',
          icon: 'fa-solid fa-clipboard-list',
        },
        {
          kind: 'item',
          id: 'integrations',
          label: 'Integrações',
          icon: 'fa-solid fa-plug',
        },
        {
          kind: 'item',
          id: 'notifications',
          label: 'Notificações',
          icon: 'fa-solid fa-bell',
        },
        {
          kind: 'item',
          id: 'backup',
          label: 'Cópias de segurança',
          icon: 'fa-solid fa-database',
        },
      ],
    },
    {
      kind: 'item',
      id: 'settings',
      label: 'Definições',
      icon: 'fa-solid fa-gear',
    },
  ];

  readonly userMenuItems: MenuNodeItem<string>[] = [
    {
      kind: 'item',
      id: 'profile',
      label: 'Perfil',
      icon: 'fa-solid fa-user',
    },
    {
      kind: 'item',
      id: 'prefs',
      label: 'Configurações',
      icon: 'fa-solid fa-sliders',
    },
    { kind: 'divider' },
    {
      kind: 'item',
      id: 'logout',
      label: 'Terminar sessão',
      icon: 'fa-solid fa-right-from-bracket',
      danger: true,
    },
  ];

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/' },
    { label: 'Área de demonstração' },
    { label: 'App shell' },
  ];

  lastUserAction = '—';
  lastNavAction = '—';

  onShellNav(id: string): void {
    this.shellActiveNav = id;
    this.lastNavAction = id;
    this.mobileNavOpen = false;
  }

  onUserMenu(id: string): void {
    this.lastUserAction = id;
  }

  onCollapsedChange(next: boolean): void {
    this.collapsedChange.emit(next);
  }
}
