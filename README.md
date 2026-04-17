# Structra Docs (`structra-docs`)

Site **Angular 17** que funciona como **showcase** da biblioteca [**structra-ui**](https://www.npmjs.com/package/structra-ui) instalada pelo **npm**. Aqui não existe fork da lib: só há a app de documentação, rotas e demos que **importam e usam** o pacote publicado.

## O que este repositório é (e o que não é)

- **É:** uma aplicação Angular que declara `structra-ui` no `package.json` (por exemplo `^0.1.8`) e consome componentes, serviços e utilitários **somente** por esse pacote.
- **Não é:** o código-fonte da biblioteca — isso acompanha o ciclo de release do próprio pacote `structra-ui`.

## Pré-requisitos

- **Node.js** em versão LTS (18 ou 20, por exemplo).
- **npm** compatível com o `package-lock.json` do projeto.
- Versões de **Angular**, **@angular/cdk** e **@angular/material** alinhadas às *peer dependencies* do `structra-ui` que você estiver usando (hoje, faixa típica **17.3.x**).

## Instalação

Na pasta do repositório:

```bash
npm install
```

Isso instala o `structra-ui` a partir do registro npm, na versão fixada no `package.json`. Para atualizar só a biblioteca:

```bash
npm update structra-ui
```

Para ver a última versão publicada:

```bash
npm view structra-ui version
```

## Estilos globais (tema)

Os componentes precisam dos **estilos globais** indicados na documentação do **`structra-ui`** (tokens, tema Material, ag-Grid, overlays do CDK, etc.). No `angular.json`, a lista em `styles` deve seguir o que o pacote orientar — costuma haver um ou mais arquivos SCSS/CSS de tema além do `src/styles.scss` deste site.

O arquivo **`src/styles.scss`** guarda só ajustes **mínimos** da própria documentação (por exemplo cores de fundo da página), sem duplicar a implementação da biblioteca.

## Rodar em desenvolvimento

```bash
npm start
```

Por padrão o Angular sobe em **`http://localhost:4200/`**. A rota principal exibe o showcase de componentes (demos em `src/app/official-demo/`).

## Build de produção

```bash
npm run build
```

Saída em **`dist/structra-docs/`**.

## Rotas

| Caminho        | Comportamento |
| -------------- | ------------- |
| `/`            | Página única com o showcase (`DemoPageComponent`). |
| `/components`  | Redireciona para `/` (links antigos). |
| `/home`        | Redireciona para `/` (idem). |

## Uso da `structra-ui` neste repositório

Exemplo de imports (ajuste os símbolos ao que você for usar):

```ts
import {
  STRUCTRA_UI,
  BaseButtonComponent,
  TextFieldComponent,
  AppThemeService,
} from 'structra-ui';
```

Configuração global da app: **`src/app/app.config.ts`** — por exemplo `provideAnimations()`, `MAT_DATE_LOCALE` (use **`pt-BR`** se quiser datas no padrão brasileiro) e demais providers exigidos pelos componentes.

## Estrutura de pastas (resumo)

```
src/
  app/
    app.component.*      # shell mínimo (toast + router-outlet)
    app.config.ts
    app.routes.ts
    official-demo/       # demos: abas, formulário, grid, menus, diálogo, etc. (tudo via structra-ui)
  styles.scss            # ajustes leves só do site de documentação
```

## Scripts úteis (`package.json`)

| Script   | Descrição |
| -------- | --------- |
| `start`  | `ng serve` (desenvolvimento). |
| `build`  | `ng build`. |
| `watch`  | Build em modo watch. |
| `test`   | Testes unitários com Karma. |

## Licença

MIT, alinhada ao ecossistema Structra quando aplicável.
