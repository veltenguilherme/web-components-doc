import { Routes } from '@angular/router';

/**
 * Aplicação de documentação mínima: uma única página (demo de componentes) na raiz.
 * Redireciona rotas antigas (`/components`, `/home`) para `/`.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./official-demo/demo-page.component').then((m) => m.DemoPageComponent),
  },
  { path: 'components', redirectTo: '', pathMatch: 'full' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
