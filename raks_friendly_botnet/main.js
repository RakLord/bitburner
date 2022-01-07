/** @param {NS} ns **/


export async function main(ns) {
    // Yoink
    const sleep = (ms) => {
        const ret = new Promise(resolve => setTimeout(resolve, ms));
        ns.print(`sleep: Sleeping for ${Math.floor(ms)} milliseconds`);
        return ret;
    };

	ns.disableLog("ALL");

	let target = ns.args[0];
    let batchCount = 10; // Might take as an arg soon idk
    let delay = 0;

    // Script RAM sizes
    const hackRam = ns.getScriptRam("/base/hack.js", "home");
    const growRam = ns.getScriptRam("/base/grow.js", "home");
    const weakRam = ns.getScriptRam("/base/weak.js", "home");

    let minSecLvl = ns.getServerMinSecurityLevel(target);
	let maxMoney = ns.getServerMaxMoney(target);
	let targetMoneyPercentage = 0.9;

    // Not const as might .push("home") 
    let hostServsers = ns.getPurchasedServers(); 

    // Time calculation for HGW actions
    let weakTime = ns.getWeakenTime(target);  
	let hackTime = weakTime * 0.25; // 4 hacks per 1 weaken timer
	let growTime = weakTime * 0.8;  // Default bitnode grow rate

    // Time calculations for the batches, only adjust timeDelay
    const timeDelay = 100; 
	const hackDelay = weakTime - hackTime - timeDelay * 3;
	const weak1Delay = 0;
	const growDelay = weakTime - growTime - timeDelay;
	const weak2Delay = timeDelay * 2;
    
    // batch deployment function. scriptThreads array [weakThreads, hackThreads, growThreads]
    function deployBatch(hostServer, scriptThreads, targetServer) {
        ns.exec("base/weak.js", hostServer, scriptThreads[0], targetServer, weak1Delay + delay);
        ns.exec("base/weak.js", hostServer, scriptThreads[0], targetServer, weak2Delay + delay);
        ns.exec("base/hack.js", hostServer, scriptThreads[1], targetServer, hackDelay + delay);
        ns.exec("base/grow.js", hostServer, scriptThreads[2], targetServer, growDelay + delay);
        delay += timeDelay * 4  // Offset the delay by the amount of scripts initiated, do this after EVERY deployBatch() call
        ns.print(`Delay: ${delay}`);
    }

    // batch size calculatio. scriptThreads array [weakThreads, hackThreads, growThreads]
    function calcBatchRam(scriptThreads) {
        let batchRam = Math.ceil((scriptThreads[0] * weakRam) + (scriptThreads[1] * hackRam) + (scriptThreads[2] * growRam));
        return batchRam;
    }

    ns.print(calcBatchRam(new Array(10, 30, 20)));

    deployBatch("home", new Array(1, 1, 1), "n00dles");
    deployBatch("home", new Array(1, 1, 1), "n00dles");
}