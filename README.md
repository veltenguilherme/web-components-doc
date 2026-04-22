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

(Sem versão fixa no comando — o npm usa a última compatível com o que já existe no projeto.)

## AG Grid

Registre os módulos Community **uma vez** no `main.ts` (antes do `bootstrapApplication`):

```ts
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
```

## Rodar em desenvolvimento

```bash
npm start
```

Por padrão: `http://localhost:4200/`.

## Estilos / tema

Veja o [README do pacote no npm](https://www.npmjs.com/package/structra-ui). O `src/styles.scss` deste site só tem ajustes mínimos da documentação.

## Compatibilidade

Angular e AG Grid precisam bater com os **peer dependencies** do `structra-ui` (veja o `package.json` do pacote no npm).

## Licença

MIT
