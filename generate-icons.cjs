const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = './public/icons';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach(size => {
  const cornerRadius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.45);
  const circleR = Math.round(size * 0.075);
  const circleX = Math.round(size * 0.7);
  const circleY = Math.round(size * 0.35);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E63946"/>
      <stop offset="100%" stop-color="#FF6B35"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#g)"/>
  <text x="${size/2}" y="${size * 0.62}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="white" text-anchor="middle">u</text>
  <circle cx="${circleX}" cy="${circleY}" r="${circleR}" fill="rgba(255,255,255,0.35)"/>
</svg>`;

  fs.writeFileSync(`${outputDir}/icon-${size}x${size}.svg`, svg);
  console.log(`Created: icon-${size}x${size}.svg`);
});

console.log('Done! All icons generated.');
