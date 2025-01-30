const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Store session data in memory
let sessionData;

const client = new Client({
  puppeteer: {
    executablePath: process.env.CHROMIUM_PATH || require('puppeteer-core').executablePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  session: sessionData, // Use in-memory session data
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan the QR code above to log in.');
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('authenticated', (session) => {
  console.log('Authenticated!');
  sessionData = session; // Save session data in memory
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was disconnected:', reason);
  sessionData = null; // Clear session data
});

client.on('message', (message) => {
  console.log(`Received message from ${message.from}: ${message.body}`);

  if (message.body.toLowerCase() === 'ping') {
    message.reply('pong');
  }
});

client.initialize();
