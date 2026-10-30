import { expect, test } from '@playwright/test';
import { openFresh } from './helpers';

test('cancelar una reserva y repetirla', async ({ page }) => {
  await openFresh(page);
  // Reserva de ejemplo próxima (código fijo de la semilla)
  const card = page.getByTestId('my-reservation').filter({ hasText: 'MESA-7K2P' });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();

  // Cancelar con confirmación en línea (sin confirm() nativo)
  page.on('dialog', () => {
    throw new Error('No debería abrirse un diálogo nativo');
  });
  await card.getByRole('button', { name: 'Cancelar' }).click();
  await card.getByRole('button', { name: 'Sí, cancelar' }).click();
  await expect(page.getByRole('status')).toContainText('Reserva cancelada');

  const cancelled = page.getByTestId('my-reservation-history').filter({ hasText: 'Cancelada' }).filter({ hasText: '21:00 hs' });
  await expect(cancelled).toHaveCount(1);

  // Repetir: toast + formulario precargado
  await cancelled.getByRole('button', { name: 'Repetir reserva' }).click();
  await expect(page.getByRole('status')).toContainText('Cargamos tu reserva anterior');
  await expect(page.locator('#qb-guests')).toHaveValue('2');
  await expect(page.locator('#qb-time')).toHaveValue('21:00');

  const zone = await page.locator('#qb-zone').inputValue();
  expect(zone.length).toBeGreaterThan(0);
  await expect(page.locator('#qb-date')).not.toHaveValue('');

  // Los datos de contacto también vienen precargados (elegimos un horario libre por si 21:00 está lleno)
  const firstOpen = await page.locator('#qb-time option:not([disabled])').first().getAttribute('value');
  await page.selectOption('#qb-time', firstOpen!);
  await page.getByRole('button', { name: 'Continuar con la reserva' }).click();
  const dialog = page.getByRole('dialog', { name: 'Completá tu reserva' });
  await expect(dialog.getByLabel('Nombre y apellido *')).toHaveValue('Elena Pérez');
  await expect(dialog.getByLabel('Email *')).toHaveValue('elena.perez@gmail.com');
});
