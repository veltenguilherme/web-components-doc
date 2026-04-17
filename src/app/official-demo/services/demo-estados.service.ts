import { Injectable } from '@angular/core';
import {
  BR_ESTADOS_NOME_SIGLA,
  mapEstadosToOptions,
} from 'structra-ui';
import type {
  DropdownSearchPageRequested,
  SelectPageRequested,
} from 'structra-ui';
import type { DemoEstadosBindings } from '../_models/demo-estados-bindings.model';

/**
 * Estado compartilhado das demos que usam select de estados (paginação simulada).
 * Usado pela página monolítica de demo e pelas páginas de documentação.
 */
@Injectable({ providedIn: 'root' })
export class DemoEstadosService {
  readonly pageSizeEstados = 10;
  readonly pageSizeBusca = 5;

  estadoOptions: DemoEstadosBindings['estadoOptions'] = [];
  estadosLoading = false;
  estadosHasMore = true;

  buscaEstadoOptions: DemoEstadosBindings['buscaEstadoOptions'] = [];
  buscaEstadosLoading = false;
  buscaEstadosHasMore = true;

  private initialized = false;

  get estadosBindings(): DemoEstadosBindings {
    return {
      estadoOptions: this.estadoOptions,
      pageSizeEstados: this.pageSizeEstados,
      estadosHasMore: this.estadosHasMore,
      estadosLoading: this.estadosLoading,
      buscaEstadoOptions: this.buscaEstadoOptions,
      pageSizeBusca: this.pageSizeBusca,
      buscaEstadosHasMore: this.buscaEstadosHasMore,
      buscaEstadosLoading: this.buscaEstadosLoading,
    };
  }

  /** Carrega o primeiro lote de estados (idempotente). */
  ensureInitialized(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.onEstadosPage({ page: 0, pageSize: this.pageSizeEstados });
    this.onEstadosBuscaPage({
      page: 0,
      pageSize: this.pageSizeBusca,
      query: '',
    });
  }

  onEstadosPage(req: SelectPageRequested): void {
    this.estadosLoading = true;

    const start = req.page * req.pageSize;
    const slice = BR_ESTADOS_NOME_SIGLA.slice(start, start + req.pageSize);
    const chunk = mapEstadosToOptions(slice);
    if (req.page === 0) {
      this.estadoOptions = chunk;
    } else {
      this.estadoOptions = [...this.estadoOptions, ...chunk];
    }
    this.estadosHasMore = start + chunk.length < BR_ESTADOS_NOME_SIGLA.length;
    this.estadosLoading = false;
  }

  onEstadosBuscaPage(req: DropdownSearchPageRequested): void {
    this.buscaEstadosLoading = true;

    const q = req.query.trim().toLowerCase();
    const all = BR_ESTADOS_NOME_SIGLA;
    const filtered = q.length
      ? all.filter(
          (e) =>
            e.nome.toLowerCase().includes(q) ||
            e.sigla.toLowerCase() === q ||
            e.sigla.toLowerCase().includes(q),
        )
      : [...all];
    const start = req.page * req.pageSize;
    const slice = filtered.slice(start, start + req.pageSize);
    const chunk = mapEstadosToOptions(slice);
    if (req.page === 0) {
      this.buscaEstadoOptions = chunk;
    } else {
      this.buscaEstadoOptions = [...this.buscaEstadoOptions, ...chunk];
    }
    this.buscaEstadosHasMore = start + chunk.length < filtered.length;
    this.buscaEstadosLoading = false;
  }
}
