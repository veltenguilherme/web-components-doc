# Structra Docs (`structra-docs`)

Aplicação **Angular 17** de **showcase** que consome **sempre** o pacote npm [**structra-ui**](https://www.npmjs.com/package/structra-ui) — sem `file:`, sem compilar a biblioteca a partir do monorepo.

A demo replica o StructraLab para validar o consumo publicado da lib.

## Pré-requisitos

- **Node.js** LTS (18 ou 20 recomendado).
- **Angular 17.3.x** alinhado às *peer dependencies* de `structra-ui`.

## Instalação

```bash
cd web-components-doc
npm install
```

A dependência `structra-ui` está no `package.json` com intervalo semver (ex.: `^0.1.6`). Para actualizar:

```bash
npm update structra-ui
```

Consulta a versão mais recente com `npm view structra-ui version`. **≥ 0.1.6:** o `app-dialog` / `app-drawer` já não expõem `HTMLElement.title` no host — evita o tooltip nativo do browser por cima do overlay.

### Tema global (SCSS)

O `angular.json` inclui o `styles.scss` completo do StructraLab a partir do repositório **irmão** `../web-components/src/styles.scss` (tokens, Material, ag-Grid, CDK, etc.). Isto **não** substitui o pacote npm: só alimenta o bundle de estilos. Para CI sem clone do monorepo ao lado, aponta esse *input* para uma cópia versionada dos SCSS ou para o caminho que a equipa definir.

## Executar

```bash
npm start
```

Por omissão: `http://localhost:4200/` — showcase de componentes na raiz.

## Build

```bash
npm run build
```

Saída: `dist/structra-docs`.

## Rotas

| Caminho        | Comportamento                             |
| -------------- | ----------------------------------------- |
| `/`            | Showcase principal (`DemoPageComponent`). |
| `/components` | Redirecciona para `/`.                    |
| `/home`       | Redirecciona para `/`.                    |

## Consumo de `structra-ui`

```ts
import {
  STRUCTRA_UI,
  BaseButtonComponent,
  TextFieldComponent,
  AppThemeService,
} from 'structra-ui';
```

Ver `src/app/app.config.ts` (`provideAnimations()`, `MAT_DATE_LOCALE`, etc.).

## Estrutura (resumo)

```
src/app/
  app.config.ts
  app.routes.ts
  official-demo/
```

## Licença

MIT (alinhado ao ecossistema Structra, se aplicável).
