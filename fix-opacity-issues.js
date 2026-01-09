const fs = require('fs');
const path = require('path');

// Directory containing all landing pages
const sitesDir = path.join(__dirname, 'sites');

// Get all subdirectories in sites folder
const landingPages = fs.readdirSync(sitesDir)
  .filter(item => fs.statSync(path.join(sitesDir, item)).isDirectory());

console.log(`🔧 Fixing opacity issues on ${landingPages.length} landing pages...\n`);

landingPages.forEach(page => {
  const indexPath = path.join(sitesDir, page, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${page} - no index.html found`);
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    let modified = false;
    let fixCount = 0;

    // Fix 1: Find all elements with opacity: 0 that are NOT in @keyframes or hover states
    // Common elements that should be visible
    const elementsToFix = [
      '.hero-label',
      '.hero-actions',
      '.hero-cta-group',
      '.eyebrow',
      '.hero h1',
      '.hero-left h1',
      '.hero-subtitle',
      '.hero-description',
      '.cta-btn',
      '.btn'
    ];

    elementsToFix.forEach(selector => {
      // Match pattern: selector { ... opacity: 0; ... }
      // But NOT inside @keyframes or :hover
      const regex = new RegExp(
        `(${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*{[^}]*?)opacity:\\s*0;`,
        'g'
      );

      const matches = content.match(regex);
      if (matches) {
        // Replace opacity: 0 with opacity: 1 for these elements
        content = content.replace(regex, '$1opacity: 1;');
        fixCount += matches.length;
        modified = true;
      }
    });

    // Fix 2: Remove leftover incomplete @keyframes blocks
    const incompleteKeyframes = /from\s*{\s*opacity:\s*0;[^}]*}\s*}\s*(?!to)/g;
    if (incompleteKeyframes.test(content)) {
      content = content.replace(incompleteKeyframes, '');
      modified = true;
      fixCount++;
    }

    // Fix 3: Remove orphaned animation fragments
    const orphanedBlocks = /\s*\n\s*from\s*{[^}]*}\s*\n\s*}/g;
    if (orphanedBlocks.test(content)) {
      content = content.replace(orphanedBlocks, '');
      modified = true;
    }

    if (modified) {
      // Write updated content
      fs.writeFileSync(indexPath, content);
      console.log(`✅ ${page} - Fixed ${fixCount} opacity issue(s)`);
    } else {
      console.log(`⏭️  ${page} - No opacity issues found`);
    }

  } catch (error) {
    console.log(`❌ Error processing ${page}: ${error.message}`);
  }
});

console.log('\n✨ Opacity fix complete!');
console.log('\n📱 All content should now be visible on all pages.');
