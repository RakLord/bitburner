//vuln_server.js
let target;
export async function main(ns) {
	//ns.disableLog("ALL");
	target = ns.args[0];
	var securityOffset = 5;
	var moneyThresh = ns.getServerMaxMoney(target) * 0.8;
	var securityThresh = ns.getServerMinSecurityLevel(target) + securityOffset;


	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			ns.print("[W] Sec lvl: " + ns.getServerSecurityLevel(target) + " / 100");
			await ns.weaken(target);

		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			var thresholdPercent = (ns.getServerMoneyAvailable(target) / moneyThresh) * 100;
			ns.print("[G] Cur Threshold: " + thresholdPercent + "%");
			await ns.grow(target);

		} else {
			ns.print("[H] Money Available: $" + ns.getServerMoneyAvailable(target));
			await ns.hack(target);
		}
	}
}