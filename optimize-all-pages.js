const fs = require('fs');
const path = require('path');

// Directory containing all landing pages
const sitesDir = path.join(__dirname, 'sites');

// Get all subdirectories in sites folder
const landingPages = fs.readdirSync(sitesDir)
  .filter(item => fs.statSync(path.join(sitesDir, item)).isDirectory());

console.log(`Found ${landingPages.length} landing pages to optimize...\n`);

landingPages.forEach(page => {
  const indexPath = path.join(sitesDir, page, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${page} - no index.html found`);
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    let modified = false;

    // 1. Add preconnect links if not present
    if (!content.includes('rel="preconnect"')) {
      const preconnectLinks = `
  <!-- Preconnect to external domains for faster loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://connect.facebook.net">
`;
      content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com/, preconnectLinks + '\n  <link href="https://fonts.googleapis.com');
      modified = true;
    }

    // 2. Add fallback fonts to body CSS
    const fontFamilies = [
      { pattern: /font-family:\s*'Space Grotesk',\s*sans-serif;/, replacement: "font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;" },
      { pattern: /font-family:\s*'DM Sans',\s*sans-serif;/, replacement: "font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;" },
      { pattern: /font-family:\s*'Inter',\s*sans-serif;/, replacement: "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;" },
      { pattern: /font-family:\s*'Poppins',\s*sans-serif;/, replacement: "font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;" },
    ];

    fontFamilies.forEach(({ pattern, replacement }) => {
      if (pattern.test(content) && !content.includes('BlinkMacSystemFont')) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    // 3. Add font smoothing to body if not present
    if (content.includes('overflow-x: hidden;') && !content.includes('font-smoothing')) {
      content = content.replace(
        /overflow-x:\s*hidden;/,
        `overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;`
      );
      modified = true;
    }

    // 4. Optimize Facebook Pixel - defer loading
    if (content.includes('fbq(\'init\'') && !content.includes('window.fbAsyncInit')) {
      // Find the Facebook Pixel code block
      const fbPixelRegex = /<!-- Meta Pixel Code -->([\s\S]*?)<!-- End Meta Pixel Code -->/;
      const match = content.match(fbPixelRegex);

      if (match) {
        const originalPixel = match[0];
        const pixelId = match[1].match(/fbq\('init',\s*'(\d+)'\)/)?.[1];

        if (pixelId) {
          const optimizedPixel = `<!-- Meta Pixel Code - Deferred for performance -->
  <script>
  window.fbAsyncInit = function() {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  };
  // Defer pixel loading until page is interactive
  if (document.readyState === 'complete') {
    window.fbAsyncInit();
  } else {
    window.addEventListener('load', window.fbAsyncInit);
  }
  </script>
  <noscript>
    <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
  </noscript>
  <!-- End Meta Pixel Code -->`;

          content = content.replace(originalPixel, optimizedPixel);
          modified = true;
        }
      }
    }

    // 5. Add GPU acceleration to gradient background
    if (content.includes('class="gradient-bg"') && !content.includes('transform: translateZ(0)')) {
      content = content.replace(
        /animation:\s*gradientShift[^;]*;/,
        `$&
      will-change: opacity;
      transform: translateZ(0);`
      );
      modified = true;
    }

    // 6. Optimize handleCTAClick function
    if (content.includes('function handleCTAClick') && !content.includes('typeof fbq')) {
      content = content.replace(
        /fbq\('track',\s*'Subscribe'\);/,
        `if (typeof fbq !== 'undefined') {
        fbq('track', 'Subscribe');
      }`
      );
      modified = true;
    }

    // 7. Defer PageView tracking
    if (content.includes('sendToCapiServer(\'PageView\')') && !content.includes('setTimeout')) {
      content = content.replace(
        /window\.addEventListener\('load',\s*function\(\)\s*{\s*sendToCapiServer\('PageView'\);?\s*}\);/,
        `if (document.readyState === 'complete') {
      setTimeout(function() { sendToCapiServer('PageView'); }, 100);
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() { sendToCapiServer('PageView'); }, 100);
      });
    }`
      );
      modified = true;
    }

    if (modified) {
      // Create backup
      const backupPath = indexPath.replace('.html', '.backup.html');
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, fs.readFileSync(indexPath));
      }

      // Write optimized version
      fs.writeFileSync(indexPath, content);
      console.log(`✅ Optimized ${page}/index.html`);
    } else {
      console.log(`⏭️  ${page}/index.html - already optimized or no changes needed`);
    }
  } catch (error) {
    console.log(`❌ Error optimizing ${page}: ${error.message}`);
  }
});

console.log('\n✨ Optimization complete!');
console.log('\n📝 Next steps:');
console.log('1. Test the optimized pages in your browser');
console.log('2. Check PERFORMANCE_OPTIMIZATION.md for server-side improvements');
console.log('3. Backup files created with .backup.html extension');
