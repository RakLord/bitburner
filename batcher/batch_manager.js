/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	var target = ns.args[0];
    var keepOpen = ns.args[1];
    var HWGWSize = 2.8 * 4;
    // var batches = ns.getServerMaxRam(ns.getPurchasedServers()[0]) / HWGWSize;
    // var batches = 469; // max batches before timing goes fuky wuky
    var batches = 100;

    var batchdelay = 
    ns.tprintf(`Starting ${batches} batches...`)
    for (let i = 0; i < batches; i++) {
        ns.tprintf(`SUCCESS Batch started ${i}`);
        ns.run("batcher/singe_batch.js", 1, target, i);
    }

    while (keepOpen) {
        await ns.sleep(1000000); // keeps batch manager open as such u can see the income in the active scripts tab
    }
}