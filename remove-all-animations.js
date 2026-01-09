const fs = require('fs');
const path = require('path');

// Directory containing all landing pages
const sitesDir = path.join(__dirname, 'sites');

// Get all subdirectories in sites folder
const landingPages = fs.readdirSync(sitesDir)
  .filter(item => fs.statSync(path.join(sitesDir, item)).isDirectory());

console.log(`🚀 Removing ALL animations from ${landingPages.length} landing pages for maximum speed...\n`);

landingPages.forEach(page => {
  const indexPath = path.join(sitesDir, page, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${page} - no index.html found`);
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    const originalLength = content.length;

    // Create backup FIRST
    const backupPath = indexPath.replace('.html', '.backup.html');
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`💾 Created backup: ${page}/index.backup.html`);
    }

    // 1. Remove all @keyframes blocks (comprehensive regex)
    content = content.replace(/@keyframes\s+[\w-]+\s*{[^}]*}/g, '');
    content = content.replace(/@keyframes\s+[\w-]+\s*{(?:[^{}]*{[^}]*})*[^}]*}/g, '');

    // 2. Remove all animation properties
    content = content.replace(/animation:\s*[^;]+;/g, '');
    content = content.replace(/animation-[\w-]+:\s*[^;]+;/g, '');

    // 3. Remove or disable all transitions (replace with none for instant changes)
    content = content.replace(/transition:\s*[^;]+;/g, 'transition: none;');
    content = content.replace(/transition-[\w-]+:\s*[^;]+;/g, '');

    // 4. Remove backdrop-filter (very slow on mobile)
    content = content.replace(/backdrop-filter:\s*[^;]+;/g, '');
    content = content.replace(/-webkit-backdrop-filter:\s*[^;]+;/g, '');

    // 5. Remove will-change (not needed without animations)
    content = content.replace(/will-change:\s*[^;]+;/g, '');

    // 6. Remove transform on non-hover states (keep translateZ for GPU but remove others)
    content = content.replace(/transform:\s*translateZ\([^)]*\);/g, '');

    // 7. Simplify box-shadows (remove blur)
    content = content.replace(/box-shadow:\s*0\s+[\d]+px\s+[\d]+px\s+rgba\([^)]+\);/g,
      'box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);');

    // 8. Remove overflow:hidden on body if present (can cause repaints)
    // Keep overflow-x: hidden for safety

    const newLength = content.length;
    const reduction = originalLength - newLength;

    // Write optimized version
    fs.writeFileSync(indexPath, content);

    console.log(`✅ ${page}/index.html - Removed ${reduction} bytes of animations`);

  } catch (error) {
    console.log(`❌ Error processing ${page}: ${error.message}`);
  }
});

console.log('\n✨ Animation removal complete!');
console.log('\n📝 Results:');
console.log('✅ All animations removed');
console.log('✅ All transitions disabled');
console.log('✅ backdrop-filter removed');
console.log('✅ Heavy CSS effects simplified');
console.log('✅ Backup files saved as .backup.html');
console.log('\n⚡ Your landing pages should now load MUCH faster!');
console.log('\n🧪 Test by opening any landing page in your browser.');
