/** Contato associado a um cliente (demo em memória). */
export interface DemoContatoCliente {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  celular: string;
  principal: boolean;
  ativo: boolean;
}

/** Linha apresentada na grade adaptativa de contatos. */
export interface DemoContatoGridRow {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  celular: string;
  principal: string;
  ativo: string;
}
