import type { Page } from '@playwright/test';

/** Abre el sitio con localStorage limpio (vuelven las reservas de ejemplo). */
export async function openFresh(page: Page, path = './') {
  await page.goto(path);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

/** Fecha local YYYY-MM-DD desplazada `days` días desde hoy. */
export function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('sv-SE');
}

/** Próximo día de la semana (0 = domingo … 6 = sábado), a partir de mañana. */
export function nextWeekday(dow: number): string {
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() === dow) return d.toLocaleDateString('sv-SE');
  }
  throw new Error('unreachable');
}

/** Recorre la página con la rueda para disparar las animaciones de entrada. */
export async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(40);
  }
}
