import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

async function main() {
  // 1. Read index.html template from client build
  const templatePath = toAbsolute('dist/index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: Build frontend client first (dist/index.html not found)');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 2. Import the server render function
  const serverBuildPath = toAbsolute('dist-server/entry-server.js');
  if (!fs.existsSync(serverBuildPath)) {
    console.error('Error: Build frontend server first (dist-server/entry-server.js not found)');
    process.exit(1);
  }
  const { render } = await import(pathToFileURL(serverBuildPath).href);

  // 3. Import product data and blog data to get paths
  const { catalogProducts } = await import('./src/data/catalogData.js');
  const { blogArticles } = await import('./src/data/blogData.js');

  // 4. Define pages/routes
  const routes = [
    '/',
    '/about',
    '/why-ayurveda',
    '/products',
    ...catalogProducts.map(p => `/moreinfo/${p.id}`),
    ...blogArticles.map(b => `/blog/${b.id}`)
  ];

  console.log(`Starting pre-rendering of ${routes.length} routes...`);

  // 5. Render each route
  for (const url of routes) {
    const context = {};
    const { html: appHtml } = await render(url, context);

    // Inject rendered html into the root div of the template
    // Replace <div id="root"></div> or whatever matches
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Save html to file
    const postFix = url === '/' ? '/index.html' : `${url}/index.html`;
    const filePath = toAbsolute(`dist${postFix}`);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`Pre-rendered: ${url} -> ${filePath}`);
  }

  // 6. Generate sitemap.xml
  const domain = 'https://nivorgo.com';
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static and dynamic pages
  for (const url of routes) {
    const priority = url === '/' ? '1.0' : url.startsWith('/moreinfo/') ? '0.8' : '0.6';
    const changeFreq = url === '/' ? 'daily' : 'weekly';
    
    xml += `  <url>\n`;
    xml += `    <loc>${domain}${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changeFreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(toAbsolute('dist/sitemap.xml'), xml, 'utf-8');
  console.log(`Generated: dist/sitemap.xml`);

  // 7. Cleanup dist-server
  try {
    fs.rmSync(toAbsolute('dist-server'), { recursive: true, force: true });
    console.log('Cleaned up dist-server folder.');
  } catch (err) {
    console.warn('Failed to delete dist-server directory:', err.message);
  }
}

main().catch(err => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
