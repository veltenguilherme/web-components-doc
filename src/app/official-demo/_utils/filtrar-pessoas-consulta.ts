import type { PessoaGridItem } from '../demo-grid/_utils/generate-demo-pessoas';

export interface ConsultaNomeSobrenome {
  nome: string;
  sobrenome: string;
}

/** Filtro em memória por nome e/ou sobrenome (OR quando ambos preenchidos). */
export function filtrarPessoasPorConsulta(
  pessoas: readonly PessoaGridItem[],
  raw: ConsultaNomeSobrenome,
): PessoaGridItem[] {
  const qn = (raw?.nome ?? '').trim().toLowerCase();
  const qs = (raw?.sobrenome ?? '').trim().toLowerCase();
  if (!qn && !qs) {
    return [...pessoas];
  }
  return pessoas.filter((p) => {
    const byNome = qn && p.nome.toLowerCase().includes(qn);
    const bySob = qs && p.sobrenome.toLowerCase().includes(qs);
    if (qn && qs) {
      return byNome || bySob;
    }
    if (qn) {
      return byNome;
    }
    return bySob;
  });
}
