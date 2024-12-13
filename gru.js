const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const minionPath = path.join(__dirname, 'minion.js');
if (!fs.existsSync(minionPath)) {
    console.error(`Gru: Minion script not found at ${minionPath}`);
    process.exit(1);
}

const numChildren = parseInt(process.argv[2], 10);
if (isNaN(numChildren) || numChildren <= 0) {
    console.error('Gru: Please provide a valid number of minions to create.');
    process.exit(1);
}

console.log(`Gru: Starting ${numChildren} minions...`);

const children = new Map();

for (let i = 0; i < numChildren; i++) {
    const sleepTime = Math.floor(Math.random() * 10) + 1; 

    const child = spawn('node', [minionPath, sleepTime]);

    console.log(`Gru: process created. PID ${child.pid}.`);

    children.set(child.pid, child);

    child.stdout.on('data', (data) => {
        console.log(`Child[${child.pid}] stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`Gru: Child ${child.pid} stderr: ${data}`);
    });

    child.on('exit', (code) => {
        console.log(`Gru: process terminated. PID ${child.pid}. Exit status ${code}.`);
        children.delete(child.pid);

        if (code !== 0) {
            console.log(`Gru: Restarting process for failed child ${child.pid}.`);
            const newChild = spawn('node', [minionPath, sleepTime]);
            console.log(`Gru: process created. PID ${newChild.pid}.`);
            children.set(newChild.pid, newChild);
        }
    });
}