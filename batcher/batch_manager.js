/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	var target = ns.args[0];
    var keepOpen = ns.args[1];
    var batches = 1000;

    ns.tprintf(`Starting ${batches} batches...`)
    for (let i = 0; i < batches; i++) {
        ns.tprintf(`SUCCESS Batch started ${i}`);
        ns.run("batcher/singe_batch.js", 1, target, i);
        await ns.sleep(0); // stop launch lag
    }

    while (keepOpen) {
        await ns.sleep(1000000); // keeps batch manager open as such u can see the income in the active scripts tab
    }
}