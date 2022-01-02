/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	var target = ns.args[0];
	while (true) {
		ns.print("Target: " + target);
		ns.print("Money Available: " + ns.nFormat(ns.getServerMoneyAvailable(target), '0.00a'));
		ns.print("Max Money: " + ns.nFormat(ns.getServerMaxMoney(target), '0.00a'));
		ns.print("Sec Lvl: " + ns.getServerSecurityLevel(target));
		ns.print("Min Sec Lvl: " + ns.getServerMinSecurityLevel(target));
		ns.print(" ");
		await ns.sleep(500);
	}

}