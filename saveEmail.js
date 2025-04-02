const fs = require('fs');
const path = require('path');

// const EMAIL_DIR = 'D:/EmailData';
// const EMAIL_DIR = process.env.EMAIL_DIR || path.join(__dirname, 'EmailData');
const EMAIL_DIR = path.join('D:/EmailData')||process.env.EMAIL_DIR;

function saveEmailToFile(emailContent,emailName) {
  return new Promise((resolve, reject) => {
    if (typeof emailContent !== 'string' || emailContent.trim() === '') {
      return reject(new Error('Invalid email content.'));
    }
    
    if (!fs.existsSync(EMAIL_DIR)) {
      fs.mkdirSync(EMAIL_DIR, { recursive: true });
    }
    
    
    const filename = `${emailName}.eml`;
    const filePath = path.join(EMAIL_DIR, filename);
    
    
    fs.writeFile(filePath, emailContent, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve(filename);
    });
  });
}

module.exports = { saveEmailToFile };
