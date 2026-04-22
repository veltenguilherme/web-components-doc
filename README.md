# Structra Docs (`structra-docs`)

Site **Angular 21** que consome a lib [**structra-ui**](https://www.npmjs.com/package/structra-ui) pelo npm. Showcase e demos.

Site oficial: [StructraLab](https://structralab.com/).

## Instalar este repositório

```bash
npm install
```

Para atualizar só a lib:

```bash
npm update structra-ui
```

## Outro projeto Angular

```bash
npm install structra-ui
```

## AG Grid

Neste repositório o registo dos módulos Community **já está** em `src/main.ts` (necessário para as demos de `DataGrid` da lib; ver também o package [`structra-ui`](https://www.npmjs.com/package/structra-ui) no npm). Em outro projecto Angular, faça o mesmo **uma vez** antes do `bootstrapApplication`:

```ts
import {
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
```

## Rodar em desenvolvimento

```bash
npm start
```

## Licença

MIT
