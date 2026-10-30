import { expect, test } from '@playwright/test';
import { openFresh, scrollThrough } from './helpers';

for (const width of [375, 1440]) {
  test.describe(`${width} px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('sitio sin scroll horizontal', async ({ page }) => {
      await openFresh(page);
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      // El plano scrollea dentro de su contenedor, no la página
      const plan = page.getByTestId('floorplan-scroll');
      const box = await plan.boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    });

    test('panel admin sin scroll horizontal', async ({ page }) => {
      await openFresh(page, './#/admin');
      await page.getByLabel('PIN').fill('1234');
      await page.getByRole('button', { name: 'Entrar' }).click();
      await page.getByRole('button', { name: '7 días' }).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
