import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AppDialogComponent,
  ConfirmDialogService,
  DialogFooterDirective,
  LibDialogSize,
  LoadingDialogService,
  ToastService,
} from 'structra-ui';
import { demoSimulatedDelay, DEMO_SIMULATED_IO_GRID_MS } from '../_utils/demo-async-sim.util';
import { BaseButtonComponent, BaseButtonType, BaseButtonVariant } from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
} from 'structra-ui';

@Component({
  selector: 'app-demo-dialogs-notifications',
  standalone: true,
  imports: [
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    AppDialogComponent,
    DialogFooterDirective,
    BaseButtonComponent,
  ],
  templateUrl: './demo-dialogs-notifications.component.html',
  styleUrl: './demo-dialogs-notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoDialogsNotificationsComponent {
  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly loadingDialog = inject(LoadingDialogService);
  private readonly toast = inject(ToastService);

  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly LibDialogSize = LibDialogSize;
  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;

  dialogOpen = false;
  lastConfirmResult: string | null = null;

  onCollapsedChange(next: boolean): void {
    this.collapsedChange.emit(next);
  }

  openDialog(): void {
    this.dialogOpen = true;
  }

  async onLoadingDemoClick(): Promise<void> {
    const ref = this.loadingDialog.open({
      message: 'A preparar demonstração…',
    });
    try {
      await demoSimulatedDelay(DEMO_SIMULATED_IO_GRID_MS);
    } finally {
      ref.close();
    }
  }

  async onDeleteClick(): Promise<void> {
    const r = await firstValueFrom(
      this.confirm.open({
        title: 'Remover registro',
        message: 'Esta ação não pode ser anulada. Deseja continuar?',
        variant: 'danger',
        confirmLabel: 'Remover',
        cancelLabel: 'Cancelar',
      }),
    );
    this.lastConfirmResult =
      r === true ? 'Confirmado: exclusão aceita.' : r === false ? 'Cancelado pelo usuário.' : 'Fechado sem resultado.';
    // CDK Dialog `closed` pode resolver sem voltar a correr CD neste componente `OnPush`.
    this.cdr.detectChanges();
  }

  showSuccess(): void {
    this.toast.show({
      type: 'success',
      title: 'Guardado',
      message: 'As alterações foram persistidas com sucesso.',
    });
  }

  showError(): void {
    this.toast.show({
      type: 'error',
      title: 'Erro',
      message: 'Não foi possível concluir o pedido. Tente novamente.',
    });
  }

  showWarning(): void {
    this.toast.show({
      type: 'warning',
      message: 'A sua sessão expira em breve.',
      durationMs: 8000,
    });
  }

  showInfo(): void {
    this.toast.show({
      type: 'info',
      message: 'Novo relatório disponível na área de documentos.',
      actionLabel: 'Abrir',
      onAction: () => {
        this.toast.show({ type: 'success', message: 'Ação de demo executada.' });
      },
    });
  }

  showMany(): void {
    this.toast.show({ type: 'info', message: 'Primeira notificação (pilha).' });
    this.toast.show({ type: 'success', message: 'Segunda notificação.' });
    this.toast.show({
      type: 'warning',
      message: 'Terceira — empilhamento no canto superior direito.',
    });
  }
}
