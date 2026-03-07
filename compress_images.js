const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'react_web', 'public', 'assets');

const files = [
    { in: '1.png', out: '1.webp' },
    { in: '2.png', out: '2.webp' },
    { in: '3.png', out: '3.webp' },
    { in: '4.png', out: '4.webp' },
    { in: '5.png', out: '5.webp' },
    { in: 'bg.png', out: 'bg.webp' },
    { in: 'niv orgo logo.png', out: 'niv orgo logo.webp' },
];

(async () => {
    for (const f of files) {
        const input = path.join(assetsDir, f.in);
        const output = path.join(assetsDir, f.out);
        try {
            const info = await sharp(input)
                .webp({ quality: 82 })
                .toFile(output);
            const sizeMB = (info.size / 1024 / 1024).toFixed(2);
            console.log(`✅ ${f.out} → ${sizeMB} MB`);
        } catch (e) {
            console.error(`❌ ${f.in}: ${e.message}`);
        }
    }
})();
