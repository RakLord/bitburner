/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
	var WGScriptSize = 1.8;
	var minSecLvl = ns.getServerMinSecurityLevel(target);
	var maxMoney = ns.getServerMaxMoney(target);
	var targetMoneyPercentage = 0.8;
	var serversSeen = ns.getPurchasedServers(); 
	var securityThresh = minSecLvl + 5;

	ns.print(`MinSecLvl: ${minSecLvl}`);
	ns.print(`CurSecLvl: ${ns.getServerSecurityLevel(target)}`);

	


	var primed = false;
	while (!primed) {
		var availableThreads = Math.floor((ns.getServerMaxRam(serversSeen[0]) - ns.getServerUsedRam(serversSeen[0])) / WGScriptSize);
		ns.print(`Available Threads: ${availableThreads}`);

		var weakThreads = Math.ceil((ns.getServerSecurityLevel(target) - securityThresh) / 0.05);
		ns.print(`Weak threads: ${weakThreads}`);



		

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