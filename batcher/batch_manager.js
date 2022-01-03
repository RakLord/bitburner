/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	var target = ns.args[0];
    var batches = 10000;

    var batchLoops = batches / 25 / 4 // batches / pservcount / 4 scripts

    ns.tprintf(`Starting ${batches} batches...`)
    for (let i = 0; i < batchLoops; i++) {
        ns.tprintf(`SUCCESS Batches started ${i * 25 * 4}`);
        ns.run("batcher/singe_batch.js", 1, target, i);
        await ns.sleep(0); // stop launch lag
    }
}