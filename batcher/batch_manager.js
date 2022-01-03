/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	var target = ns.args[0];

    for (let i = 0; i < 20; i++) {
        ns.tprintf(`SUCCESS Batch started ${i}`);
        ns.run("batcher/singe_batch.js", 1, target, Math.random());
    }
}