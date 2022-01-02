/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
	var WGScriptSize = 1.8;
	var minSecLvl = ns.getServerMinSecurityLevel(target);
	var maxMoney = ns.getServerMaxMoney(target);
	var targetMoneyPercentage = 0.95;
	var serversSeen = ns.getPurchasedServers(); 
	var securityThresh = minSecLvl + 5;

	ns.print(`MinSecLvl: ${minSecLvl}`);
	ns.print(`CurSecLvl: ${ns.getServerSecurityLevel(target)}`);

	


	var primed = false;
	while (!primed) {
		var pservCount = serversSeen.length;
		var availableThreads = Math.floor((ns.getServerMaxRam(serversSeen[0]) - ns.getServerUsedRam(serversSeen[0])) / WGScriptSize);
		var weakThreads = Math.ceil((ns.getServerSecurityLevel(target) - securityThresh) / 0.05);
		var growRatio = maxMoney / ns.getServerMoneyAvailable(target);
		var growThreads = ns.growthAnalyze(target, growRatio);
		var weakTime = ns.getWeakenTime(target);
		var growTime = ns.getGrowTime(target);
		var timeDif = weakTime - growTime - 100;
		ns.print(`Available threads: ${availableThreads}`);
		ns.print(`Weak threads: ${weakThreads}`);
		ns.print(`Growth ratio: ${growRatio}`);
		ns.print(`Grow threads: ${growThreads}`);
		ns.print(`Weak time: ${ns.nFormat(weakTime / 1000, "00:00:00")}`);
		ns.print(`Grow time: ${ns.nFormat(growTime / 1000, "00:00:00")}`);
		ns.print(`End delay: ${ns.nFormat(timeDif / 1000, "00:00:00")}`);

		var distributedWeakThreads = Math.ceil(weakThreads / pservCount);
		var distributedGrowThreads = Math.ceil(growThreads / pservCount);

		
		if (weakThreads > 0) {
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("weak.js", curServ, distributedWeakThreads, target);
			}
		}


		await ns.sleep(timeDif);
		if (growThreads > 0) {
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("grow.js", curServ, distributedGrowThreads, target);
			}
		}


		

		if (ns.getServerSecurityLevel(target) <= securityThresh && ns.getServerMoneyAvailable(target) > maxMoney * targetMoneyPercentage) {
			primed = true;
			ns.print(`PRIMED TARGET: ${target}`);
			ns.tprint(`PRIMED TARGET: ${target}`);
			ns.exit();
		}

		await ns.sleep(1000);
	} 
}