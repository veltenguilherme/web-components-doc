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
  AppSidebarComponent,
  AppShellSidebarToggleComponent,
  AppSidebarToolbarDirective,
  AppTopbarComponent,
  AppUserMenuComponent,
  type BreadcrumbItem,
} from 'structra-ui';
import { BaseButtonComponent, BaseButtonType, BaseButtonVariant } from 'structra-ui';
import {
  FormGroupComponent,
  LayoutStackComponent,
  LayoutStackAlign,
} from 'structra-ui';
import type { MenuNodeItem } from 'structra-ui';

@Component({
  selector: 'app-demo-app-shell',
  standalone: true,
  imports: [
    FormGroupComponent,
    AppShellComponent,
    AppShellSidebarTemplateDirective,
    AppSidebarComponent,
    AppShellSidebarToggleComponent,
    AppSidebarToolbarDirective,
    AppTopbarComponent,
    AppUserMenuComponent,
    AppBreadcrumbComponent,
    BaseButtonComponent,
    LayoutStackComponent,
  ],
  templateUrl: './demo-app-shell.component.html',
  styleUrl: './demo-app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoAppShellComponent {
  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;
  readonly LayoutStackAlign = LayoutStackAlign;

  sidebarCollapsed = false;
  mobileNavOpen = false;

  shellActiveNav = 'dashboard';

  readonly shellNavItems: MenuNodeItem<string>[] = [
    {
      kind: 'group',
      label: 'Principal',
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
