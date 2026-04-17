import type { UiSelectOption } from 'structra-ui';

/** Estado de paginação/select compartilhado entre seções da demo (campos + grupos). */
export interface DemoEstadosBindings {
  estadoOptions: UiSelectOption<string>[];
  pageSizeEstados: number;
  estadosHasMore: boolean;
  estadosLoading: boolean;
  buscaEstadoOptions: UiSelectOption<string>[];
  pageSizeBusca: number;
  buscaEstadosHasMore: boolean;
  buscaEstadosLoading: boolean;
}
