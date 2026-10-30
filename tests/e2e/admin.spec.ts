import { expect, test } from '@playwright/test';
import { openFresh } from './helpers';

test.describe('Panel del restaurante', () => {
  test.beforeEach(async ({ page }) => {
    await openFresh(page, './#/admin');
  });

  test('pide PIN y muestra el de demo', async ({ page }) => {
    await expect(page.getByText(/el PIN\s+1234/)).toBeVisible();
    await page.getByLabel('PIN').fill('0000');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByLabel('PIN')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#admin-pin-error')).toContainText('PIN incorrecto');

    await page.getByLabel('PIN').fill('1234');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Panel del restaurante')).toBeVisible();
    for (const kpi of ['reservas', 'cubiertos', 'ocupación', 'cancelaciones']) {
      await expect(page.getByTestId(`kpi-${kpi}`)).toBeVisible();
    }
    await expect(page.getByRole('img', { name: /Reservas por día/ })).toBeVisible();
  });

  test('filtra por zona, estado y nombre, y cambia el estado de una reserva', async ({ page }) => {
    await page.getByLabel('PIN').fill('1234');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.getByRole('button', { name: '7 días' }).click();

    // Zona
    await page.getByLabel('Zona').selectOption('Terraza');
    const rows = page.getByTestId('admin-row');
    await expect(rows.first()).toBeVisible();
    for (const text of await rows.allTextContents()) expect(text).toContain('Terraza');

    // Estado + cambio a "Llegó"
    await page.getByLabel('Estado').selectOption('confirmada');
    const before = await rows.count();
    expect(before).toBeGreaterThan(0);
    const target = rows.first();
    const code = (await target.locator('.font-mono').nth(1).textContent())!.trim();
    await target.getByRole('button', { name: 'Llegó' }).click();
    await expect(page.getByRole('status')).toContainText(`${code} · Llegó`);
    await expect(rows).toHaveCount(before - 1);

    await page.getByLabel('Estado').selectOption('llego');
    await expect(rows.filter({ hasText: code })).toHaveCount(1);

    // Búsqueda por nombre
    await page.getByLabel('Estado').selectOption('todos');
    await page.getByLabel('Zona').selectOption('todas');
    const name = (await rows.first().locator('p.truncate').textContent())!.trim();
    await page.getByLabel('Buscar').fill(name.split(' ')[1]);
    for (const text of await rows.allTextContents()) expect(text).toContain(name.split(' ')[1]);
  });

  test('comparte los datos con la parte pública', async ({ page }) => {
    await page.getByLabel('PIN').fill('1234');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.getByRole('button', { name: 'Todas' }).click();
    await page.getByLabel('Buscar').fill('MESA-7K2P');
    const row = page.getByTestId('admin-row');
    await expect(row).toHaveCount(1);
    await row.getByRole('button', { name: 'Cancelar' }).click();

    await page.getByRole('button', { name: 'Ver sitio' }).click();
    const history = page.getByTestId('my-reservation-history').filter({ hasText: 'Cancelada' }).filter({ hasText: '21:00 hs' });
    await expect(history).toHaveCount(1);
  });
});
