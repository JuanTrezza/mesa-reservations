// Genera las capturas del README en docs/.
//
// Requiere el build servido en el puerto 4173:
//   npm run build && npm run preview
// y en otra terminal:
//   npm run docs:screenshots
//
// Opcional: BASE_URL para apuntar a otro servidor (por defecto http://localhost:4173/mesa-reservations/).
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'docs');
const tmpDir = path.join(os.tmpdir(), 'mesa-docs-screenshots');
const URL = process.env.BASE_URL ?? 'http://localhost:4173/mesa-reservations/';

try {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (e) {
  console.error(`No se pudo abrir ${URL} (${e.message}).\nLevantá el build antes: npm run build && npm run preview`);
  process.exit(1);
}

await mkdir(docsDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });

const browser = await chromium.launch();

async function freshPage(viewport, deviceScaleFactor = 1) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'reduce', locale: 'es-AR', timezoneId: 'America/Argentina/Buenos_Aires' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return { ctx, page };
}

/** Elige una mesa libre (preferentemente de 2, como el grupo por defecto) para que el plano muestre los cuatro estados. */
async function selectTable(page) {
  const preferred = page.locator('#plano [data-state="libre"][aria-label*=", 2 personas"]');
  const table = (await preferred.count()) ? preferred.first() : page.locator('#plano [data-state="libre"]').first();
  const id = await table.getAttribute('data-table');
  await table.click();
  return id;
}

async function save(buffer, name) {
  // PNG con paleta: mucho más liviano para el repo, sin pérdida visible
  const out = await sharp(buffer).png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 }).toBuffer();
  await writeFile(path.join(docsDir, name), out);
  const { width, height } = await sharp(out).metadata();
  console.log(`${name.padEnd(22)} ${width}×${height}  ${Math.round(out.length / 1024)} KB`);
}

// 1. Hero en escritorio (para el preview)
{
  const { ctx, page } = await freshPage({ width: 1440, height: 900 });
  await writeFile(path.join(tmpDir, 'hero-desktop.png'), await page.screenshot());
  await ctx.close();
}

// 2. Plano en celular (para el mockup del preview)
{
  const { ctx, page } = await freshPage({ width: 390, height: 844 }, 2);
  await page.locator('#plano').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await selectTable(page);
  // Encuadre: termina justo después de la leyenda, para que ningún botón quede cortado en el borde
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const legend = document.querySelector('#plano ul');
    // Entre la leyenda y el botón hay 16 px: cortamos en el medio
    window.scrollTo(0, legend.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 8);
  });
  await page.waitForTimeout(500);
  await writeFile(path.join(tmpDir, 'plano-mobile.png'), await page.screenshot());
  await ctx.close();
}

// 3. Plano de mesas en escritorio
{
  const { ctx, page } = await freshPage({ width: 1440, height: 1000 });
  await page.locator('#plano').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await selectTable(page);
  await page.evaluate(() => (document.querySelector('nav').style.visibility = 'hidden'));
  // El contenido de la sección con un margen parejo de 40 px
  // Con fullPage, clip va en coordenadas del documento (boundingBox es relativo al viewport)
  const b = await page.evaluate(() => {
    const r = document.querySelector('#plano > div').getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
  });
  await save(await page.screenshot({ clip: { x: b.x - 40, y: b.y - 40, width: b.width + 80, height: b.height + 80 }, fullPage: true }), 'plano-de-mesas.png');
  await ctx.close();
}

// 4. Modal de confirmación con QR
{
  const { ctx, page } = await freshPage({ width: 1280, height: 1000 });
  await page.locator('#plano').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const id = await selectTable(page);
  await page.locator('#plano').getByRole('button', { name: `Reservar la mesa ${id}` }).click();
  await page.fill('#bk-name', 'Lucía Fernández');
  await page.fill('#bk-email', 'lucia@example.com');
  await page.fill('#bk-phone', '+54 9 11 5555-1234');
  await page.getByRole('button', { name: 'Confirmar reserva' }).click();
  const dialog = page.getByRole('dialog', { name: '¡Reserva confirmada!' });
  await dialog.getByRole('img', { name: /Código QR/ }).waitFor();
  await page.waitForTimeout(500);
  const box = await dialog.boundingBox();
  const pad = 48;
  await save(
    await page.screenshot({ clip: { x: box.x - pad, y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: Math.min(1000, box.height + pad * 2) } }),
    'confirmacion-qr.png'
  );
  await ctx.close();
}

// 5. Panel del restaurante
{
  const { ctx, page } = await freshPage({ width: 1440, height: 1250 });
  await page.goto(URL + '#/admin');
  await page.fill('#admin-pin', '1234');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByText('Panel del restaurante').waitFor();
  await page.waitForTimeout(500);
  await save(await page.screenshot(), 'panel-admin.png');
  await ctx.close();
}

// 6. Composición principal: escritorio + celular
{
  const img = async (f) => 'data:image/png;base64,' + (await readFile(path.join(tmpDir, f))).toString('base64');
  const hero = await img('hero-desktop.png');
  const phone = await img('plano-mobile.png');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; }
    body { width: 1600px; height: 900px; overflow: hidden; font-family: Inter, system-ui, sans-serif;
      background: radial-gradient(ellipse at 20% 0%, #3a2f1a 0%, #15120e 45%, #0b0907 100%); position: relative; }
    body::before { content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 85% 90%, rgba(212,175,55,.18), transparent 40%); }
    .browser { position: absolute; left: 64px; top: 64px; width: 1050px; border-radius: 14px; overflow: hidden;
      background: #1a1611; border: 1px solid #4d4635; box-shadow: 0 40px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(212,175,55,.08); }
    .bar { height: 42px; display: flex; align-items: center; gap: 8px; padding: 0 16px; background: #201b15; border-bottom: 1px solid #2a241c; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #4d4635; }
    .url { margin-left: 18px; flex: 0 1 520px; height: 26px; border-radius: 6px; background: #0f0d0a; color: #cbc1af;
      font-size: 13px; display: flex; align-items: center; padding: 0 12px; letter-spacing: .02em; }
    .url b { color: #d4af37; font-weight: 600; }
    .browser img { display: block; width: 100%; }
    .phone { position: absolute; right: 72px; top: 66px; width: 372px; height: 770px; border-radius: 54px; padding: 14px;
      background: linear-gradient(145deg, #3a3226, #15120e); border: 1px solid #5c5240;
      box-shadow: 0 50px 100px rgba(0,0,0,.75), inset 0 0 0 2px #0b0907; }
    .screen { width: 100%; height: 100%; border-radius: 42px; overflow: hidden; position: relative; background: #0f0d0a; }
    .screen img { width: 100%; display: block; }
    .notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 110px; height: 30px;
      border-radius: 20px; background: #000; z-index: 2; }
    .tag { position: absolute; left: 66px; bottom: 52px; color: #cbc1af; font-size: 15px; letter-spacing: .28em; text-transform: uppercase; }
    .tag b { color: #d4af37; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 22px; letter-spacing: .12em; margin-right: 14px; }
  </style></head><body>
    <div class="browser"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>
      <span class="url">juantrezza.github.io/<b>mesa-reservations</b></span></div><img src="${hero}"></div>
    <div class="phone"><div class="screen"><div class="notch"></div><img src="${phone}"></div></div>
    <p class="tag"><b>MESA</b>Reservas · Palermo, Buenos Aires</p>
  </body></html>`;
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await save(await page.screenshot(), 'preview.png');
  await ctx.close();
}

await browser.close();
await rm(tmpDir, { recursive: true, force: true });
