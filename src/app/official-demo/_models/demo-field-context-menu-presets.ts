import type { MenuNodeItem } from 'structra-ui';

/**
 * Presets de `MenuNodeItem` para o botão «…» dos campos (`contextMenuItems`).
 * Os mesmos modelos servem para dropdown «Ações», action-menu, grupos/divisores e submenus na demo Menus.
 * Qualquer campo com `app-base-field` aceita a árvore completa (grupos, divisores, submenus, danger, loading).
 */

/** Estilo dropdown clássico: grupos + divisor + itens (como o cartão «Dropdown»). */
export const DEMO_FIELD_CTX_MENU_DROPDOWN: MenuNodeItem<string>[] = [
  {
    kind: 'group',
    label: 'Documento',
    items: [
      {
        kind: 'item',
        id: 'ctx-dd-novo',
        label: 'Novo',
        description: 'Cria um registro em branco',
        icon: 'fa-solid fa-file-circle-plus',
      },
      {
        kind: 'item',
        id: 'ctx-dd-duplicar',
        label: 'Duplicar',
        icon: 'fa-solid fa-copy',
      },
    ],
  },
  { kind: 'divider' },
  {
    kind: 'item',
    id: 'ctx-dd-exportar',
    label: 'Exportar',
    icon: 'fa-solid fa-file-export',
  },
  {
    kind: 'item',
    id: 'ctx-dd-indisponivel',
    label: 'Indisponível',
    description: 'Exemplo desativado',
    icon: 'fa-solid fa-ban',
    disabled: true,
  },
];

/** Estilo action-menu: danger, disabled, loading (como o cartão «Action menu»). */
export const DEMO_FIELD_CTX_MENU_ACTION: MenuNodeItem<string>[] = [
  {
    kind: 'item',
    id: 'ctx-act-abrir',
    label: 'Abrir',
    description: 'Ação normal',
    icon: 'fa-solid fa-folder-open',
  },
  {
    kind: 'item',
    id: 'ctx-act-indisponivel',
    label: 'Indisponível',
    icon: 'fa-solid fa-ban',
    disabled: true,
  },
  { kind: 'divider' },
  {
    kind: 'item',
    id: 'ctx-act-eliminar',
    label: 'Eliminar',
    description: 'Destrutivo',
    icon: 'fa-solid fa-trash',
    danger: true,
  },
  {
    kind: 'item',
    id: 'ctx-act-processar',
    label: 'A processar…',
    icon: 'fa-solid fa-hourglass-half',
    loading: true,
  },
];

/** Grupos com títulos e divisores (como «Grupos e divisores»). */
export const DEMO_FIELD_CTX_MENU_GROUPED: MenuNodeItem<string>[] = [
  {
    kind: 'group',
    label: 'Ficheiro',
    items: [
      {
        kind: 'item',
        id: 'ctx-gr-novo',
        label: 'Novo',
        icon: 'fa-solid fa-file-circle-plus',
      },
      {
        kind: 'item',
        id: 'ctx-gr-guardar',
        label: 'Guardar',
        icon: 'fa-solid fa-floppy-disk',
      },
    ],
  },
  { kind: 'divider' },
  {
    kind: 'group',
    label: 'Editar',
    items: [
      {
        kind: 'item',
        id: 'ctx-gr-copiar',
        label: 'Copiar',
        icon: 'fa-solid fa-copy',
      },
      {
        kind: 'item',
        id: 'ctx-gr-colar',
        label: 'Colar',
        icon: 'fa-solid fa-paste',
      },
    ],
  },
];

/** Submenus aninhados (como o cartão «Submenus»). */
export const DEMO_FIELD_CTX_MENU_SUBMENU: MenuNodeItem<string>[] = [
  {
    kind: 'item',
    id: 'ctx-sm-rapida',
    label: 'Ação rápida',
    icon: 'fa-solid fa-bolt',
  },
  { kind: 'divider' },
  {
    kind: 'submenu',
    id: 'ctx-sm-mais',
    label: 'Mais opções',
    description: 'Abre ao lado',
    icon: 'fa-solid fa-layer-group',
    items: [
      {
        kind: 'item',
        id: 'ctx-sm-n1',
        label: 'Opção aninhada 1',
        icon: 'fa-solid fa-1',
      },
      {
        kind: 'submenu',
        id: 'ctx-sm-sub',
        label: 'Subnível',
        icon: 'fa-solid fa-arrow-right',
        items: [
          {
            kind: 'item',
            id: 'ctx-sm-pa',
            label: 'Profundo A',
            icon: 'fa-solid fa-circle',
          },
          {
            kind: 'item',
            id: 'ctx-sm-pb',
            label: 'Profundo B',
            icon: 'fa-solid fa-circle',
          },
        ],
      },
    ],
  },
];
