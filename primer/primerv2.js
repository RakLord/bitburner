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

	var primed = false;
	while (!primed) {
		var pservCount = serversSeen.length;
		var availableThreads = Math.floor((ns.getServerMaxRam(serversSeen[0]) - ns.getServerUsedRam(serversSeen[0])) / WGScriptSize);  // threads per server (derived from executed script size)
		var weakThreads = Math.ceil((ns.getServerSecurityLevel(target) - securityThresh) / 0.05); // Threads required to weaken to reach the security threshold
		var growRatio = maxMoney / (ns.getServerMoneyAvailable(target) + 1);  // the ratio that grow analyze uses to see how many threads to reach max money on a server.
		var growThreads = ns.growthAnalyze(target, growRatio);  // DOESNT FUCKING WORK AS I EXPECTED????
		var hackThreads = ns.hackAnalyzeThreads(target, maxMoney);
		var weakTime = ns.getWeakenTime(target);  
		var hackTime = ns.getHackTime(target);
		var growTime = ns.getGrowTime(target);
		var timeDif = weakTime - growTime - 250;  // calculate time gap between launches (+ 15ms error room) 
		var weakOffset = 250; // offset of time bewtteen W's in WGW cycle
		var hackOffset = weakTime - timeDif - hackTime;
		var distributedWeakThreads = Math.ceil(weakThreads / pservCount);
		var distributedGrowThreads = Math.ceil(growThreads / pservCount);
		var distributedHackThreads = Math.ceil(hackThreads / pservCount);


		ns.print(`Available threads: ${availableThreads}`);
		ns.print(`Weak threads: ${weakThreads}`);
		ns.print(`Grow threads: ${growThreads}`);
		ns.print(`Hack threads: ${hackThreads}`);
		ns.print(`Growth ratio: ${growRatio}`);
		ns.print(`Dist weak threads: ${distributedWeakThreads}`);
		ns.print(`Dist grow threads: ${distributedGrowThreads}`);
		ns.print(`Hack grow threads: ${distributedHackThreads}`);
		ns.print(`Weak time: ${ns.nFormat(weakTime / 1000, "00:00:00")}`);
		ns.print(`Grow time: ${ns.nFormat(growTime / 1000, "00:00:00")}`);
		ns.print(`Hack time: ${ns.nFormat(hackTime / 1000, "00:00:00")}`);
		ns.print(`End delay: ${ns.nFormat(timeDif / 1000, "00:00:00")}`);
		
		var randomArg = Math.random();
		if (weakThreads > 0) {  // Initial weak distribution
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("weak.js", curServ, distributedWeakThreads, target);
			}
		}

		await ns.sleep(weakOffset); // delay between grow

		randomArg = Math.random();
		if (weakThreads > 0) { //  run another 
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("weak.js", curServ, distributedWeakThreads, target, randomArg);
			}
		}

		await ns.sleep(timeDif); // wait to get it a few ms away from the start of grow

		randomArg = Math.random();
		if (growThreads > 0) {
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("grow.js", curServ, distributedGrowThreads, target, randomArg);
			}
		}

		await ns.sleep(hackOffset - 250);
		randomArg = Math.random();
		if (hackThreads > 0) {
			for (let i = 0; i < pservCount; i++) {
				var curServ = serversSeen[i];
				ns.exec("hack.js", curServ, distributedHackThreads, target, randomArg);
			}
		}

		// if (ns.getServerSecurityLevel(target) <= securityThresh && ns.getServerMoneyAvailable(target) > maxMoney * targetMoneyPercentage) {
		// 	primed = true;
		// 	ns.print(`SUCCESS  || PRIMED TARGET: ${target}`);
		// 	ns.tprintf(`SUCCESS  || PRIMED TARGET: ${target}`);
		// 	ns.exit();
		// }

		await ns.sleep(500);
	} 
}