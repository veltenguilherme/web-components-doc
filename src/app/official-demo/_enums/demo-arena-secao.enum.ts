/** Identificadores das seções principais colapsáveis da página da demo (estado compartilhado no container). */
export enum DemoArenaSecao {
  Campos = 'campos',
  GruposLayout = 'gruposLayout',
  /** Formulário de capa com dois subgrupos e resumo de validação ao validar. */
  ResumoValidacao = 'resumoValidacao',
  /** Abas com formulário único, resumo de validação e alertas por separador. */
  Abas = 'abas',
  /** Grid com dados em memória, paginação e ações em linha. */
  Grid = 'grid',
  /** Lista em cartões com inclusão, edição, remoção e pesquisa em memória. */
  CardList = 'cardList',
  /** Form actions, data toolbar e vista adaptativa grid/card. */
  FormActionsToolbar = 'formActionsToolbar',
  /** Skeleton e estados de loading reutilizáveis. */
  LoadingSkeleton = 'loadingSkeleton',
  /** Dropdown, menu contextual e drawer. */
  Menus = 'menus',
  /** Tokens semânticos e paletas (`AppThemeService`). */
  Tema = 'tema',
  /** Tooltip, popover e base de overlay ancorado. */
  Overlay = 'overlay',
  /** App shell, sidebar, topbar, usuário e breadcrumb. */
  AppShell = 'appShell',
  /** Badges de estado, lista de detalhes e cartões de métrica. */
  DataDisplay = 'dataDisplay',
  /** Modal declarativo, confirmação CDK e toasts globais. */
  DialogsNotifications = 'dialogsNotifications',
}
