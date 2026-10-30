import { expect, test } from '@playwright/test';
import { isoInDays, nextWeekday, openFresh } from './helpers';

test.describe('Validación del formulario', () => {
  test.beforeEach(async ({ page }) => {
    await openFresh(page);
  });

  test('no permite fechas pasadas', async ({ page }) => {
    await page.fill('#qb-date', isoInDays(-1));
    const date = page.locator('#qb-date');
    await expect(date).toHaveAttribute('aria-invalid', 'true');
    await expect(date).toHaveAttribute('aria-describedby', /qb-date-error/);
    await expect(page.locator('#qb-date-error')).toHaveText('La fecha ya pasó. Elegí hoy o un día próximo.');
  });

  test('no permite reservar los lunes', async ({ page }) => {
    await page.fill('#qb-date', nextWeekday(1));
    await expect(page.locator('#qb-date')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#qb-date-error')).toHaveText('Los lunes estamos cerrados. Elegí otro día.');
    await page.getByRole('button', { name: 'Continuar con la reserva' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('respeta el máximo de personas de cada zona', async ({ page }) => {
    await page.selectOption('#qb-zone', 'Barra Premium');
    await page.selectOption('#qb-guests', '6');
    await page.getByRole('button', { name: 'Continuar con la reserva' }).click();
    await expect(page.locator('#qb-guests')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#qb-guests-error')).toHaveText('Barra Premium admite hasta 4 personas por mesa.');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('valida email y celular argentino con mensajes accesibles', async ({ page }) => {
    await page.getByRole('button', { name: 'Continuar con la reserva' }).click();
    const dialog = page.getByRole('dialog', { name: 'Completá tu reserva' });
    await dialog.getByLabel('Nombre y apellido *').fill('Lucía');
    await dialog.getByLabel('Email *').fill('lucia@');
    await dialog.getByLabel('Celular *').fill('1234');
    await dialog.getByRole('button', { name: 'Confirmar reserva' }).click();

    const email = dialog.getByLabel('Email *');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-describedby', 'bk-email-error');
    await expect(dialog.locator('#bk-email-error')).toHaveText('Revisá el email: tiene que ser como nombre@dominio.com.');
    await expect(dialog.locator('#bk-name-error')).toHaveText('Ingresá nombre y apellido, solo con letras.');
    await expect(dialog.locator('#bk-phone-error')).toContainText('número argentino');
    // El foco va al primer campo con error
    await expect(dialog.getByLabel('Nombre y apellido *')).toBeFocused();

    // Al corregir, la reserva se confirma
    await dialog.getByLabel('Nombre y apellido *').fill('Lucía Fernández');
    await email.fill('lucia@example.com');
    await dialog.getByLabel('Celular *').fill('011 15 5123-4567');
    await dialog.getByRole('button', { name: 'Confirmar reserva' }).click();
    await expect(page.getByRole('dialog', { name: '¡Reserva confirmada!' })).toBeVisible();
  });
});
