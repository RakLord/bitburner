export async function main(ns) {
	ns.disableLog("ALL");
	var serversSeen = ns.scan("home");
	var currentScan;

	for (let i = 0; i < serversSeen.length; i++) {
		currentScan = ns.scan(serversSeen[i])
		for (var j = 0; j < currentScan.length; j++) {
			if (serversSeen.indexOf(currentScan[j]) === -1) {
				serversSeen.push(currentScan[j])
			}
		}
	}
	ns.tprint(serversSeen);
	for (let i = 0; i < serversSeen.length; i++) {
		await ns.scp("/base/weak.js", "home", serversSeen[i]);
		await ns.scp("/base/grow.js", "home", serversSeen[i]);
		await ns.scp("/base/hack.js", "home", serversSeen[i]);
	}
}