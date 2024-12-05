const SitemapGenerator = require('sitemap-generator');
const generator = SitemapGenerator('https://www.msl-itech.com', {
  stripQuerystring: true,
  filepath: './dist/sitemap.xml',
});

generator.start();
