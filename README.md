# Structra Docs (`structra-docs`)

Site **Angular 17** que serve de **showcase** da biblioteca [**structra-ui**](https://www.npmjs.com/package/structra-ui) publicada no npm. O objetivo é mostrar o consumo real da lib (imports, providers, tema) de forma parecida com o **StructraLab**, mas em um repositório separado só da documentação/demo.

## O que este projeto é (e o que não é)

- **É:** uma app Angular que depende de `structra-ui` via `package.json` (semver, ex.: `^0.1.7`).
- **Não é:** o código-fonte da lib; isso fica no monorepo **StructraLab** / `web-components`.

## Pré-requisitos

- **Node.js** LTS (18 ou 20 recomendado).
- **npm** compatível com o lockfile do repositório.
- Versões de **Angular** e de **@angular/cdk** / **@angular/material** alinhadas às *peer dependencies* declaradas no pacote `structra-ui` que você estiver usando (hoje, faixa típica **17.3.x**).

## Instalação

Na pasta do repositório:

```bash
cd web-components-doc
npm install
```

Isso baixa o `structra-ui` do registro npm conforme a versão indicada no `package.json`. Para atualizar só a lib:

```bash
npm update structra-ui
```

Para ver a última versão publicada:

```bash
npm view structra-ui version
```

## Tema global (SCSS)

No `angular.json`, o build inclui o **`styles.scss` completo do StructraLab** apontando para o repositório **irmão**:

`../web-components/src/styles.scss`

Isso traz tokens, tema Material, ag-Grid, overlays de diálogo CDK, etc. **Não substitui** o pacote npm: o `structra-ui` traz principalmente a API em TypeScript; o arquivo acima monta o **bundle de estilos** igual ao lab.

Em **CI** sem o clone do monorepo ao lado, você precisa ou:

- versionar uma cópia desses SCSS no próprio repo de docs e trocar o `input` no `angular.json`, ou  
- publicar/consumir um pacote de tema, se a sua organização tiver esse fluxo.

## Rodar em desenvolvimento

```bash
npm start
```

Por padrão o Angular sobe em **`http://localhost:4200/`**. A rota principal mostra o showcase de componentes (demo oficial espelhada em `src/app/official-demo/`).

## Build de produção

```bash
npm run build
```

Artefatos em **`dist/structra-docs/`**.

## Rotas

| Caminho       | Comportamento |
| ------------- | ------------- |
| `/`           | Página única com o showcase (`DemoPageComponent`). |
| `/components` | Redireciona para `/` (compatibilidade com links antigos). |
| `/home`       | Redireciona para `/` (idem). |

## Uso da `structra-ui` neste repo

Exemplo de imports (ajuste os símbolos ao que você for usar):

```ts
import {
  STRUCTRA_UI,
  BaseButtonComponent,
  TextFieldComponent,
  AppThemeService,
} from 'structra-ui';
```

Configuração global da app: **`src/app/app.config.ts`** — por exemplo `provideAnimations()`, `MAT_DATE_LOCALE` (`pt-PT` nos exemplos atuais), e demais providers que os componentes exijam.

## Estrutura de pastas (resumo)

```
src/
  app/
    app.component.*      # shell mínimo (toast + router-outlet)
    app.config.ts
    app.routes.ts
    official-demo/       # demo espelhada: abas, formulário, grid, menus, dialog, etc.
  styles.scss            # ajustes leves só do site de docs
```

## Scripts úteis (`package.json`)

| Script   | Descrição              |
| -------- | ---------------------- |
| `start`  | `ng serve` (dev).      |
| `build`  | `ng build`.            |
| `watch`  | build em modo watch.   |
| `test`   | testes unitários Karma.|

## Licença

MIT, alinhada ao ecossistema Structra quando aplicável.
