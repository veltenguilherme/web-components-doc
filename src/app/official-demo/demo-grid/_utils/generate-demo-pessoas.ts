/** Gera uma lista determinística de pessoas para a demo do grid (dados em memória). */
export interface PessoaGridItem {
  id: number;
  nome: string;
  sobrenome: string;
}

const NOMES = [
  'João',
  'Maria',
  'Pedro',
  'Ana',
  'Lucas',
  'Julia',
  'Carlos',
  'Fernanda',
  'Ricardo',
  'Patrícia',
  'Bruno',
  'Camila',
  'Diego',
  'Larissa',
  'Eduardo',
];

const SOBRENOMES = [
  'Silva',
  'Souza',
  'Costa',
  'Lima',
  'Oliveira',
  'Santos',
  'Pereira',
  'Almeida',
  'Ribeiro',
  'Carvalho',
  'Martins',
  'Rocha',
  'Dias',
  'Melo',
  'Nunes',
];

function seededShuffleIndex(seed: number, modulo: number): number {
  const next = (seed * 9301 + 49297) % 233280;
  return next % modulo;
}

export function generateDemoPessoas(total: number): PessoaGridItem[] {
  const out: PessoaGridItem[] = [];
  for (let i = 0; i < total; i++) {
    const s = i + 1;
    const ni = seededShuffleIndex(s * 17 + 11, NOMES.length);
    const si = seededShuffleIndex(s * 31 + 7, SOBRENOMES.length);
    out.push({
      id: i + 1,
      nome: NOMES[ni],
      sobrenome: SOBRENOMES[si],
    });
  }
  return out;
}
