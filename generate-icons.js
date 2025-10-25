const fs = require('fs');
const path = require('path');

// MoPay Agent Icon Generation Script
console.log('🎨 MoPay Agent Icon Generator');
console.log('===============================');
console.log('');

console.log('📁 Current Assets Status:');
const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir);

const iconFiles = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];
iconFiles.forEach(file => {
  const exists = files.includes(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('');
console.log('📋 Icon Specifications:');
console.log('  • icon.png: 1024x1024px (Main app icon)');
console.log('  • adaptive-icon.png: 1024x1024px (Android adaptive)');
console.log('  • splash-icon.png: 512x512px (Splash screen)');
console.log('  • favicon.png: 64x64px (Web favicon)');
console.log('');

console.log('🎨 Design Template Available:');
console.log('  📄 assets/mopay-icon-template.svg');
console.log('');

console.log('🛠️  Next Steps:');
console.log('  1. Open mopay-icon-template.svg in design software');
console.log('  2. Customize colors and design as needed');
console.log('  3. Export PNG files in specified sizes');
console.log('  4. Replace existing files in assets/ folder');
console.log('  5. Test: npx expo start');
console.log('');

console.log('🎯 Brand Colors:');
console.log('  • Primary: #007bff (MoPay Blue)');
console.log('  • Success: #28a745 (Green)');
console.log('  • Warning: #ffc107 (Yellow)');
console.log('  • Background: #ffffff (White)');
console.log('');

console.log('📚 Resources:');
console.log('  • Expo Icons: https://docs.expo.dev/guides/icons/');
console.log('  • Android Adaptive: https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive');
console.log('  • iOS Icons: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/');

// Check if app.json is properly configured
console.log('');
console.log('⚙️  App Configuration:');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const expo = appJson.expo;

  console.log(`  ✅ Icon: ${expo.icon ? 'Configured' : 'Missing'}`);
  console.log(`  ✅ Splash: ${expo.splash?.image ? 'Configured' : 'Missing'}`);
  console.log(`  ✅ Adaptive: ${expo.android?.adaptiveIcon ? 'Configured' : 'Missing'}`);
  console.log(`  ✅ Favicon: ${expo.web?.favicon ? 'Configured' : 'Missing'}`);
} catch (error) {
  console.log('  ❌ Error reading app.json');
}