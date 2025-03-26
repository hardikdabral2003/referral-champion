
// This script is used to start the Express server
const { spawn } = require('child_process');
const path = require('path');

// Path to the server file
const serverPath = path.resolve(__dirname, '../server/server.ts');

// Start the server using ts-node
const server = spawn('npx', ['ts-node', serverPath], {
  stdio: 'inherit',
  shell: true
});

console.log(`Server started with PID: ${server.pid}`);

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle SIGINT for clean shutdown
process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});
