/**
 * Simulação de latência de rede / API para demos (skeleton em campos, grades, etc.).
 * Um único sítio para ajustar tempos e manter comportamento consistente entre arenas.
 */
export const DEMO_SIMULATED_IO_MS = 900;

/** Demos com grades / paginação mais pesadas (ex.: `demo-loading-skeleton`). */
export const DEMO_SIMULATED_IO_GRID_MS = 1500;

/**
 * Simulação ao «Salvar» no formulário de cliente (`demo-formulario-exemplo`).
 * Ajuste aqui para mudar o tempo de skeleton em todos os campos.
 */
export const DEMO_SIMULATED_CLIENTE_SAVE_MS = 5000;

export function demoSimulatedDelay(
  ms: number = DEMO_SIMULATED_IO_MS,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
