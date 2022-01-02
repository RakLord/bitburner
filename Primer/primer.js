/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
	var WGHScriptSize = 1.8;
	var minSecLvl = ns.getServerMinSecurityLevel(target) + 1;
	var secLvlMaxInc = 10;
	var maxMoney = ns.getServerMaxMoney(target);
	var targetMoneyPercentage = 0.8;

	ns.print(`MinSecLvl: ${minSecLvl}`);
	ns.print(`CurSecLvl: ${ns.getServerSecurityLevel(target)}`);

	var serversSeen = ns.getPurchasedServers(); 
	serversSeen.push("home");

	function calcAvailThreads() {
		var availThreads = 0;
		for (let i = 0; i < serversSeen.length; i++) {
			availThreads = availThreads + (Math.floor((ns.getServerMaxRam(serversSeen[i]) - ns.getServerUsedRam(serversSeen[i])) / WGHScriptSize));
		}
		return availThreads;
	}

	var primed = false;
	while (!primed) {
		var availableThreads = calcAvailThreads();
		ns.print(`Available Threads: ${availableThreads}`);
		var growThreads;
		for (let i = 0; i <= availableThreads; i = i + availableThreads / 1000) {
			if (ns.growthAnalyzeSecurity(i) + ns.getServerSecurityLevel(target) > minSecLvl + secLvlMaxInc) {
				growThreads = Math.floor(i);
				break;
			}
		}

		availableThreads = availableThreads - growThreads;

		// Execute all the pre-allocated grow threads
		ns.print(`Grow Threads: ${growThreads}`)
		for (let i = 0; i < serversSeen.length; i++) {
			var curServ = serversSeen[i];
			var servRam = ns.getServerMaxRam(curServ);
			var servUsableThreads = Math.floor(servRam / WGHScriptSize) - 1;
			if (servUsableThreads > 0) {
				if (growThreads - servUsableThreads > 0) {
					ns.print(`Running with: ${servUsableThreads} on ${curServ}`);
					ns.exec("base/grow.js", curServ, servUsableThreads, target);
					growThreads = growThreads - servUsableThreads;
				} else if (growThreads > 0 && servUsableThreads) {
					ns.print(`Running with: ${servUsableThreads} on ${curServ}`);
					ns.exec("base/grow.js", curServ, growThreads, target);
					growThreads = growThreads - growThreads;
				} else {
					break;
				}
			}
		}
		ns.print(`Grow Threads Remainder: ${growThreads}`)
		ns.print(`Threads remaining: ${availableThreads}`);

		// Execute weaken threads
		for (let i = 0; i < serversSeen.length; i++) {
			var curServ = serversSeen[i];
			var servRam = ns.getServerMaxRam(curServ);
			var servUsableThreads = Math.floor(servRam / WGHScriptSize) - 1;
			ns.print(`ServUsableThreads: ${servUsableThreads}`);
			if (servUsableThreads > 0) {
				ns.print(`Running with: ${servUsableThreads} on ${curServ}`);
				ns.print(`${servUsableThreads} | ${servRam / WGHScriptSize}`)
				ns.exec("base/weak.js", curServ, servUsableThreads, target);
				availableThreads = availableThreads - servUsableThreads;
			} 
		}
		
		if (ns.getServerSecurityLevel(target) <= minSecLvl && ns.getServerMoneyAvailable(target) > maxMoney * targetMoneyPercentage) {
			primed = true;
			ns.print(`PRIMED TARGET: ${target}`);
			ns.tprint(`PRIMED TARGET: ${target}`);
			ns.exit();
		}

		ns.print(`Priming duration: ${ns.nFormat((ns.getWeakenTime(target) + 30) / 1000 , "00:00:00")}`);
		await ns.sleep(ns.getWeakenTime(target) + 30);
	} 
}