/** @param {NS} ns **/
export async function main(ns) {
	var doBuy = ns.args[0];
	var ram = 2;  // You can change this to start from a higher RAM minimum (not necesary)
	var maxRam = ns.getPurchasedServerMaxRam();
	var maxServerCount = ns.getPurchasedServerLimit();
	var totalCost;

	var calculated = false;
	while (!calculated) {
		totalCost = getServersCost(ram);
		if (ns.getServerMoneyAvailable("home") > totalCost) {
			ram = ram * 2;
			if (ram >= 1048575){
				ram = ram * 2; // ram is divided by 2 after so this is the max after
				calculated = true;
				break
			}
		} else {
			calculated = true;
			break
		}
		//await ns.sleep(25);
		if (ram >= maxRam) {
			ram = maxRam;
			break
		}
	}
	ram = ram / 2
	totalCost = getServersCost(ram);
	ns.tprint("Price: " + ns.nFormat(totalCost, '0.00a'));
	ns.tprint("RAM: " + ram);
	
	ns.tprint("Next upgrade price: " + ns.nFormat(getServersCost(ram*2), "0.00a"));

	function getServersCost(ram) {
		var serverCost = ns.getPurchasedServerCost(ram);
		return serverCost * maxServerCount;
	}

	if (doBuy == "yes") {
		var currentServers = ns.getPurchasedServers();
		ns.tprint(currentServers);
		for (var i = 0; i < currentServers.length; i++) {
			var serv = currentServers[i];
			ns.deleteServer(serv);
		}

		var i = 0;
		while (i < maxServerCount) {
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				var hostname = ns.purchaseServer("pserv-" + i, ram);
				i++;
			}
			await ns.sleep(200);
		}
	}
}