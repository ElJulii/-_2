const { pid, ppid } = process;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const sleepSeconds = parseInt(process.argv[2], 10);

if (isNaN(sleepSeconds) || sleepSeconds <= 0) {
    console.error(`Minion[${pid}]: Invalid sleep time provided.`);
    process.exit(1); 
}

console.log(`Minion[${pid}]: created. Parent PID ${ppid}.`);

sleep(sleepSeconds * 1000).then(() => {

    const exitStatus = Math.random() < 0.5 ? 0 : 1;

    console.log(`Child[${pid}]: before terminated. Parent PID ${ppid}. Exit status ${exitStatus}.`);
    process.exit(exitStatus);
});

