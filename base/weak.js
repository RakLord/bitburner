/** @param {NS} ns **/
export async function main(ns) {
	const sleep = (ms) => {
		const ret = new Promise(resolve => setTimeout(resolve, ms));
		ns.print(`sleep: Sleeping for ${Math.floor(ms)} milliseconds`);
		return ret;
	};
	await sleep(ns.args[1]);
	await ns.weaken(ns.args[0]);
}