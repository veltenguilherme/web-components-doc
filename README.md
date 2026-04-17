# Structra Docs (`structra-docs`)

Projeto **Angular** de **documentação e showcase** que consome o pacote **`structra-ui`** (build ng-packagr do monorepo **StructraLab** / `web-components`).

**Não** é o repositório da biblioteca: é uma aplicação à parte, com exemplos reais de componentes importados de `structra-ui`.

## Objetivo

- Demonstrar o consumo real da lib (`import { … } from 'structra-ui'`).
- Manter layout simples (shell, rotas, home, página de componentes).
- Servir de base para evoluir a documentação.

## Pré-requisitos

- **Node.js** LTS (recomendado 18 ou 20).
- Repositório **irmão** `../web-components` (StructraLab), para:
  - compilar a lib (`ng build structra-ui`);
  - referenciar `structra-ui` em `file:../web-components/dist/structra-ui`;
  - carregar o tema global em `angular.json` (`../web-components/src/styles.scss`).

## Instalação

```bash
cd D:\Projetos\web-components-doc

# 1) Gerar o pacote local da lib (no monorepo StructraLab)
cd ..\web-components
npx ng build structra-ui
cd ..\web-components-doc

# 2) Instalar dependências do site de docs
npm install
```

Para publicar no npm e consumir por versão, use `npm install structra-ui@^x.y.z` e remova ou substitua a entrada `file:` em `package.json`.

## Executar

```bash
npm start
```

Por omissão: `http://localhost:4200/`.

## Build

```bash
npm run build
```

Output: `dist/structra-docs`.

## Consumo da `structra-ui`

### TypeScript

```ts
import {
  STRUCTRA_UI,
  BaseButtonComponent,
  TextFieldComponent,
  AppThemeService,
} from 'structra-ui';
```

### Estilos globais

Em `angular.json` → `projects.structra-docs.architect.build.options.styles` está incluído o ficheiro completo do StructraLab:

`../web-components/src/styles.scss`

Isto traz tokens, Material, ag-Grid e regras CDK alinhadas à demo principal. O ficheiro `src/styles.scss` deste projeto só acrescenta ajustes mínimos do site de documentação.

### Peers

A `structra-ui` declara peers para `@angular/forms`, `@angular/cdk`, `@angular/material`, `@angular/router` e `@angular/animations`. Mantenha as versões alinhadas (ex.: Angular 17.3.x).

### `app.config.ts`

- `provideAnimations()` — necessário para Material / animações.
- `MAT_DATE_LOCALE` — definido para `pt-PT` (datas nos exemplos).

## Estrutura de pastas

```
src/app/
  features/
    home/                  — início, instalação, links
    components-showcase/   — exemplos reais (formulário, abas, resumo, etc.)
  layout/                  — shell com `AppThemeService` + classe de tema
  shared/components/       — `CodeSnippetComponent`
```

## Rotas

| Caminho       | Conteúdo                |
| ------------- | ----------------------- |
| `/home`       | Home                    |
| `/components` | Showcase com componentes |

## Próximos passos

- Acrescentar mais exemplos (ex.: `DropdownSearchField`, `DataGrid`, menus) à medida que forem necessários.
- Quando a lib publicar CSS próprio no pacote npm, avaliar reduzir a dependência do `styles.scss` completo do monorepo.

## Licença

MIT (alinhado ao ecossistema Structra, se aplicável).
