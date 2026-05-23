const sharp = require('sharp');
const fs = require('fs');
async function run() {
  console.log('Trimming transparent padding...');
  const input = 'd:/Komandoweb/public/images/logo.png';
  const temp = 'd:/Komandoweb/public/images/logo_temp.png';
  await sharp(input).trim().toFile(temp);
  fs.renameSync(temp, input);
  console.log('Done!');
}
run();
