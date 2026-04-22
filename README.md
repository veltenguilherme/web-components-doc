# Structra Docs (`structra-docs`)

Site **Angular 21** que consome [**structra-ui**](https://www.npmjs.com/package/structra-ui) pelo npm. Showcase e demos — o código da lib fica no repo `web-components`.

Link público: [StructraLab](https://structralab.com/).

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

Com **grid (AG Grid)**:

```bash
npm install structra-ui ag-grid-community ag-grid-angular
```

## AG Grid

Registre os módulos Community **uma vez** no `main.ts` (antes do `bootstrapApplication`):

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
