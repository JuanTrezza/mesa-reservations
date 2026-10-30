import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { openFresh } from './helpers';

test.describe('Reserva con formulario y plano de mesas', () => {
  test('elige mesa en el plano, confirma, ve el QR y la reserva en Mis reservas', async ({ page }) => {
    await openFresh(page);
    await page.selectOption('#qb-guests', '2');

    // Elegir una mesa libre en el plano completa la zona del formulario
    const plan = page.locator('#plano');
    await plan.scrollIntoViewIfNeeded();
    const table = plan.locator('[data-state="libre"]').first();
    const tableId = await table.getAttribute('data-table');
    const label = (await table.getAttribute('aria-label'))!;
    expect(label).toMatch(new RegExp(`^Mesa ${tableId}, \\d+ personas, .+, libre$`));
    const zone = label.split(', ')[2];

    await table.click();
    await expect(plan.locator(`[data-table="${tableId}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#qb-zone')).toHaveValue(zone);
    await expect(page.locator('#qb-table-status')).toContainText(`Mesa ${tableId}`);

    // Datos de contacto
    await plan.getByRole('button', { name: `Reservar la mesa ${tableId}` }).click();
    const details = page.getByRole('dialog', { name: 'Completá tu reserva' });
    await details.getByLabel('Nombre y apellido *').fill('Lucía Fernández');
    await details.getByLabel('Email *').fill('lucia@example.com');
    await details.getByLabel('Celular *').fill('+54 9 11 5555-1234');
    await details.getByRole('button', { name: 'Confirmar reserva' }).click();

    // Modal de confirmación con QR real y código
    const confirm = page.getByRole('dialog', { name: '¡Reserva confirmada!' });
    await expect(confirm).toBeVisible();
    await expect(confirm.getByRole('img', { name: /Código QR de la reserva/ })).toBeVisible();
    const code = (await confirm.getByTestId('reservation-code').textContent())!.trim();
    expect(code).toMatch(/^MESA-[2-9A-HJ-NP-Z]{4}$/);
    await expect(confirm).toContainText(`Mesa ${tableId}`);

    // .ics
    const [ics] = await Promise.all([page.waitForEvent('download'), confirm.getByRole('button', { name: 'Agregar al calendario' }).click()]);
    expect(ics.suggestedFilename()).toBe(`reserva-${code}.ics`);
    const icsText = await readFile((await ics.path())!, 'utf8');
    expect(icsText).toContain('BEGIN:VEVENT');
    expect(icsText).toContain(code);
    expect(icsText).toMatch(/DTSTART:\d{8}T\d{6}Z/);

    // PNG del QR
    const [png] = await Promise.all([page.waitForEvent('download'), confirm.getByRole('button', { name: 'Descargar QR' }).click()]);
    expect(png.suggestedFilename()).toBe(`qr-${code}.png`);
    const bytes = await readFile((await png.path())!);
    expect(bytes.subarray(1, 4).toString()).toBe('PNG');

    // Mis reservas
    await confirm.getByRole('button', { name: 'Ver mis reservas' }).click();
    const card = page.getByTestId('my-reservation').filter({ hasText: code });
    await expect(card).toBeVisible();
    await expect(card).toContainText(`Mesa ${tableId}`);

    // La mesa queda ocupada en el plano para ese horario
    await expect(plan.locator(`[data-table="${tableId}"]`)).toHaveAttribute('data-state', 'ocupada');

    // "Ver QR" abre el mismo modal
    await card.getByRole('button', { name: 'Ver QR' }).click();
    const again = page.getByRole('dialog', { name: 'Tu reserva' });
    await expect(again.getByTestId('reservation-code')).toHaveText(code);
    await expect(again.getByRole('img', { name: `Código QR de la reserva ${code}` })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(again).toBeHidden();
  });

  test('las mesas se eligen con teclado', async ({ page }) => {
    await openFresh(page);
    // Fijamos la mesa por id: después de elegirla deja de estar "libre"
    const id = await page.locator('#plano [data-state="libre"]').first().getAttribute('data-table');
    const table = page.locator(`#plano [data-table="${id}"]`);
    await table.focus();
    await page.keyboard.press('Enter');
    await expect(table).toHaveAttribute('aria-pressed', 'true');
    await expect(table).toHaveAttribute('aria-label', /seleccionada$/);
  });

  test('las mesas ocupadas o chicas para el grupo no se pueden elegir', async ({ page }) => {
    await openFresh(page);
    await page.selectOption('#qb-guests', '5');
    const plan = page.locator('#plano');
    // Una mesa de 2 no sirve para 5 personas
    const small = plan.locator('[data-table="1"]');
    await expect(small).toHaveAttribute('aria-disabled', 'true');
    await small.click({ force: true });
    await expect(small).not.toHaveAttribute('aria-pressed', 'true');
  });
});
