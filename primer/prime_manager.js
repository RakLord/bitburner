/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
    const batches = 10;

    for (let i = 0; i < batches; i++) {
        ns.run("/primer/primerv2.js", 1, target, i);
        await ns.sleep(200);
    }

    var primed = false;
	while (!primed) {
        
		if (ns.getServerSecurityLevel(target) <= ns.getServerMinSecurityLevel(target) && ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target)) {
			primed = true;
			ns.print(`SUCCESS  || PRIMED TARGET: ${target}`);
			ns.tprintf(`SUCCESS  || PRIMED TARGET: ${target}`);
			ns.exit();
		}
        await ns.sleep(200);
	} 
}