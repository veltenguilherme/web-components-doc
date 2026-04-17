/** Controles do subgrupo `pessoa` no formulário de layout. */
export enum LayoutPessoaField {
  NomeCompleto = 'nomeCompleto',
  Documento = 'documento',
  DataNascimento = 'dataNascimento',
  Telefone = 'telefone',
}

/** Controles do subgrupo `cliente` no formulário de layout. */
export enum LayoutClienteField {
  Cep = 'cep',
  Uf = 'uf',
  Observacoes = 'observacoes',
  FaturamentoMensal = 'faturamentoMensal',
  FiliaisAtuacao = 'filiaisAtuacao',
  EstadoSedeBusca = 'estadoSedeBusca',
}

/** Controles do subgrupo `usuario` no formulário de layout. */
export enum LayoutUsuarioField {
  Email = 'email',
  Identificador = 'identificador',
  NivelSuporte = 'nivelSuporte',
  AceiteComunicacoes = 'aceiteComunicacoes',
  SessaoAtiva = 'sessaoAtiva',
}
