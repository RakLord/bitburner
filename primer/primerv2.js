/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
	var WGScriptSize = 1.8;
	var minSecLvl = ns.getServerMinSecurityLevel(target);
	var maxMoney = ns.getServerMaxMoney(target);
	var targetMoneyPercentage = 0.95;
	var serversSeen = ns.getPurchasedServers(); 
	var securityThresh = minSecLvl;

	ns.print(`MinSecLvl: ${minSecLvl}`);
	ns.print(`CurSecLvl: ${ns.getServerSecurityLevel(target)}`);

	var pservCount = serversSeen.length;
	var availableThreads = Math.floor((ns.getServerMaxRam(serversSeen[0]) - ns.getServerUsedRam(serversSeen[0])) / WGScriptSize);  // threads per server (derived from executed script size)  // Calc how many threads required to weaken from max (NOT OPTIMAL THREAD USAGE (just temporrary))

	var weakThreads = (100 / 0.05); // Threads required to weaken to reach the security threshold
	var growRatio = maxMoney / (ns.getServerMoneyAvailable(target) - 1);  // the ratio that grow analyze uses to see how many threads to reach max money on a server.
	var growThreads = Math.ceil(ns.growthAnalyze(target, growRatio) * 1.05);  

	var weakTime = ns.getWeakenTime(target);  
	var growTime = weakTime * 0.8;  // Default bitnode grow rate

	var timeDelay = 25;
	var weak1Delay = 0;
	var growDelay = weakTime - growTime - timeDelay;
	var weak2Delay = timeDelay * 2;

	var distributedWeakThreads = Math.ceil(weakThreads / pservCount);
	var distributedGrowThreads = Math.ceil(growThreads / pservCount);

	ns.print(`Available threads: ${availableThreads}`);
	ns.print(`Weak threads: ${weakThreads}`);
	ns.print(`Grow threads: ${growThreads}`);
	ns.print(`Growth ratio: ${growRatio}`);
	ns.print(`Dist weak threads: ${distributedWeakThreads}`);
	ns.print(`Dist grow threads: ${distributedGrowThreads}`);
	ns.print(`Weak time: ${ns.nFormat(weakTime / 1000, "00:00:00")}`);
	ns.print(`Grow time: ${ns.nFormat(growTime / 1000, "00:00:00")}`);

	var randomArg = Math.random();

	for (let i = 0; i < pservCount; i++) {
		var curServ = serversSeen[i];
		ns.exec("base/weak.js", curServ, distributedWeakThreads, target, weak1Delay, randomArg);
		ns.exec("base/weak.js", curServ, distributedWeakThreads, target, weak2Delay, randomArg);
		ns.exec("base/grow.js", curServ, distributedGrowThreads, target, growDelay, randomArg);
	}
}