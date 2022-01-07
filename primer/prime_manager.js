/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
    const batches = 50;

    for (let i = 0; i < batches; i++) {
        ns.run("/primer/primerv2.js", 1, target);
		ns.print(`New batch priming ${target}, ${i}`);
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
		ns.print("test");
        await ns.sleep(200);
	} 
}