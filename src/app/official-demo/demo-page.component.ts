import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DemoArenaSecao } from './_enums/demo-arena-secao.enum';
import { DemoCamposComponent } from './demo-campos/demo-campos.component';
import { DemoGruposComponent } from './demo-grupos/demo-grupos.component';
import { DemoAbasComponent } from './demo-abas/demo-abas.component';
import { DemoGridComponent } from './demo-grid/demo-grid.component';
import { DemoCardListComponent } from './demo-card-list/demo-card-list.component';
import { DemoFormActionsToolbarComponent } from './demo-form-actions-toolbar/demo-form-actions-toolbar.component';
import { DemoLoadingSkeletonComponent } from './demo-loading-skeleton/demo-loading-skeleton.component';
import { DemoTemaComponent } from './demo-tema/demo-tema.component';
import { DemoResumoValidacaoComponent } from './demo-resumo-validacao/demo-resumo-validacao.component';
import { DemoFormularioExemploComponent } from './demo-formulario-exemplo/demo-formulario-exemplo.component';
import { DemoMenusComponent } from './demo-menus/demo-menus.component';
import { DemoOverlayComponent } from './demo-overlay/demo-overlay.component';
import { DemoAppShellComponent } from './demo-app-shell/demo-app-shell.component';
import { DemoDataDisplayComponent } from './demo-data-display/demo-data-display.component';
import { DemoDialogsNotificationsComponent } from './demo-dialogs-notifications/demo-dialogs-notifications.component';
import { DemoEstadosBindings } from './_models/demo-estados-bindings.model';
import {
  AppThemeService,
  FormTabComponent,
  FormTabsComponent,
} from 'structra-ui';
import { DemoEstadosService } from './services/demo-estados.service';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    NgClass,
    FormTabsComponent,
    FormTabComponent,
    DemoCamposComponent,
    DemoGruposComponent,
    DemoResumoValidacaoComponent,
    DemoAbasComponent,
    DemoGridComponent,
    DemoCardListComponent,
    DemoFormActionsToolbarComponent,
    DemoLoadingSkeletonComponent,
    DemoMenusComponent,
    DemoOverlayComponent,
    DemoAppShellComponent,
    DemoDataDisplayComponent,
    DemoDialogsNotificationsComponent,
    DemoTemaComponent,
    DemoFormularioExemploComponent,
  ],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.scss',
})
export class DemoPageComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  readonly libTheme = inject(AppThemeService);
  private readonly demoEstados = inject(DemoEstadosService);

  /** Separador principal: demos isoladas vs. formulário completo. */
  demoPrincipalTabKey = 'componentes';

  /** Expõe o enum ao template (evita strings literais em `[collapsed]` / handlers). */
  readonly DemoArenaSecao = DemoArenaSecao;

  /** Seções principais da página (`app-form-group` exterior), fechadas por padrão. */
  demoArenaCollapsed: Record<DemoArenaSecao, boolean> = {
    [DemoArenaSecao.Campos]: true,
    [DemoArenaSecao.GruposLayout]: true,
    [DemoArenaSecao.ResumoValidacao]: true,
    [DemoArenaSecao.Abas]: true,
    [DemoArenaSecao.Grid]: true,
    [DemoArenaSecao.CardList]: true,
    [DemoArenaSecao.FormActionsToolbar]: true,
    [DemoArenaSecao.LoadingSkeleton]: true,
    [DemoArenaSecao.Menus]: true,
    [DemoArenaSecao.Overlay]: true,
    [DemoArenaSecao.AppShell]: true,
    [DemoArenaSecao.DataDisplay]: true,
    [DemoArenaSecao.DialogsNotifications]: true,
    [DemoArenaSecao.Tema]: true,
  };

  get estadosBindings(): DemoEstadosBindings {
    return this.demoEstados.estadosBindings;
  }

  demoArenaCollapsedState(which: DemoArenaSecao): boolean {
    return this.demoArenaCollapsed[which];
  }

  onDemoArenaCollapsed(which: DemoArenaSecao, next: boolean): void {
    this.demoArenaCollapsed = { ...this.demoArenaCollapsed, [which]: next };
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.demoEstados.ensureInitialized();
  }

  onEstadosPage(req: Parameters<DemoEstadosService['onEstadosPage']>[0]): void {
    this.demoEstados.onEstadosPage(req);
    this.cdr.markForCheck();
  }

  onEstadosBuscaPage(
    req: Parameters<DemoEstadosService['onEstadosBuscaPage']>[0],
  ): void {
    this.demoEstados.onEstadosBuscaPage(req);
    this.cdr.markForCheck();
  }
}
