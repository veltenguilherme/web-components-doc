import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseButtonComponent, BaseButtonType, BaseButtonVariant } from 'structra-ui';
import {
  DataListComponent,
  DashboardSectionComponent,
  DetailsFieldComponent,
  DetailsViewComponent,
  ListItemComponent,
  StatCardComponent,
  StatusBadgeComponent,
  type DetailsViewItem,
  type StatusBadgeVariant,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
} from 'structra-ui';
import { ActionMenuComponent, type MenuNodeItem } from 'structra-ui';

export interface DemoPedidoListRow {
  readonly id: string;
  readonly titulo: string;
  readonly subtitulo: string;
  readonly meta: string;
  readonly estado: StatusBadgeVariant;
  readonly estadoLabel: string;
}

@Component({
  selector: 'app-demo-data-display',
  standalone: true,
  imports: [
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    BaseButtonComponent,
    StatusBadgeComponent,
    DetailsViewComponent,
    DetailsFieldComponent,
    StatCardComponent,
    DataListComponent,
    ListItemComponent,
    DashboardSectionComponent,
    ActionMenuComponent,
  ],
  templateUrl: './demo-data-display.component.html',
  styleUrl: './demo-data-display.component.scss',
})
export class DemoDataDisplayComponent {
  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;

  readonly sampleDetails: DetailsViewItem[] = [
    { label: 'Nome', value: 'Maria Silva' },
    { label: 'E-mail', value: 'maria.silva@exemplo.pt' },
    { label: 'Telefone', value: '+351 912 345 678' },
    { label: 'Estado', value: 'Ativo' },
    { label: 'Última atualização', value: '14/04/2026 10:32' },
  ];

  readonly pedidosRecentes: readonly DemoPedidoListRow[] = [
    {
      id: 'p1',
      titulo: 'Pedido #10432',
      subtitulo: 'ACME Lda.',
      meta: '€ 240,00 · há 2 h',
      estado: 'warning',
      estadoLabel: 'Pendente',
    },
    {
      id: 'p2',
      titulo: 'Pedido #10431',
      subtitulo: 'Livraria Horizonte',
      meta: '€ 89,90 · ontem',
      estado: 'success',
      estadoLabel: 'Pago',
    },
    {
      id: 'p3',
      titulo: 'Pedido #10428',
      subtitulo: 'Móveis Silva',
      meta: '€ 1.020,00 · 12/04',
      estado: 'info',
      estadoLabel: 'Em análise',
    },
  ];

  statClickCount = 0;
  lastListMenu: string | null = null;

  onStatCardDemo(): void {
    this.statClickCount += 1;
  }

  onCollapsedChange(next: boolean): void {
    this.collapsedChange.emit(next);
  }

  menuPedido(rowId: string): MenuNodeItem<string>[] {
    return [
      {
        kind: 'item',
        id: 'open',
        label: 'Abrir detalhe',
        icon: 'fa-solid fa-arrow-up-right-from-square',
      },
      { kind: 'divider' },
      {
        kind: 'item',
        id: 'pdf',
        label: 'Comprovativo PDF',
        icon: 'fa-solid fa-file-pdf',
      },
      {
        kind: 'item',
        id: 'cancel',
        label: 'Cancelar pedido',
        icon: 'fa-solid fa-ban',
        danger: true,
      },
    ];
  }

  onPedidoMenu(actionId: string, rowId: string): void {
    this.lastListMenu = `${rowId}: ${actionId}`;
  }
}
