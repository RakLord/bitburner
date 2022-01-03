/** @param {NS} ns **/
export async function main(ns) {
	// ns.disableLog("ALL");
	var target = ns.args[0];
    const batches = 20; // EDIT THIS VALUE TO CHANGE THE BATCH COUNT ( check pserv ram usage to see if u can use more)

    for (let i = 0; i < batches; i++) {
        ns.tprintf(`SUCCESS Batch started ${i}`);
        ns.run("batcher/singe_batch.js", 1, target, Math.random());
    }
}