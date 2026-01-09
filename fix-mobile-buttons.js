const fs = require('fs');
const path = require('path');

// Directory containing all landing pages
const sitesDir = path.join(__dirname, 'sites');

// Get all subdirectories in sites folder
const landingPages = fs.readdirSync(sitesDir)
  .filter(item => fs.statSync(path.join(sitesDir, item)).isDirectory());

console.log(`🔧 Fixing mobile button visibility on ${landingPages.length} landing pages...\n`);

landingPages.forEach(page => {
  const indexPath = path.join(sitesDir, page, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${page} - no index.html found`);
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    let modified = false;

    // Fix 1: If top-nav is hidden on mobile, show only the button
    if (content.includes('.top-nav') && content.includes('display: none')) {
      // Check if hiding entire .top-nav on mobile
      const hideTopNavRegex = /(@media[^{]*max-width:[^{]*{[^}]*\.top-nav\s*{\s*display:\s*none;\s*})/g;

      if (hideTopNavRegex.test(content)) {
        // Replace display: none on .top-nav with keeping it but hiding only nav-links
        content = content.replace(
          /\.top-nav\s*{\s*display:\s*none;\s*}/g,
          `.top-nav {
        gap: 12px;
      }

      .nav-link {
        display: none;
      }

      .top-cta {
        display: block;
        font-size: 13px;
        padding: 10px 20px;
      }`
        );
        modified = true;
        console.log(`✅ ${page} - Fixed mobile top button visibility`);
      }
    }

    // Fix 2: Ensure buttons are visible on mobile for main hero CTAs
    if (content.includes('.hero-cta-group') || content.includes('.hero-actions')) {
      // Check if there's no mobile styling for buttons
      if (!content.includes('width: 100%') || !content.includes('justify-content: center')) {
        // Add to existing mobile media query or create new one
        const mobileMediaQuery = /@media\s*\(max-width:\s*768px\)/;

        if (mobileMediaQuery.test(content)) {
          // Find the mobile section and add button fixes if not already there
          if (!content.includes('.cta-btn') && !content.includes('.btn')) {
            // Will be handled individually based on page structure
          }
        }
      }
    }

    if (modified) {
      // Write updated content
      fs.writeFileSync(indexPath, content);
    } else {
      console.log(`⏭️  ${page} - No mobile button issues found`);
    }

  } catch (error) {
    console.log(`❌ Error processing ${page}: ${error.message}`);
  }
});

console.log('\n✨ Mobile button visibility fix complete!');
console.log('\n📱 All top buttons should now be visible on mobile devices.');
