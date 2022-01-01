/** @param {NS} ns **/
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

	var data = serversSeen.map(checkPs);
	function checkPs(serv) {
		var servPs = ns.ps(serv);
		var servName = serv;
		var servData = new Array;
		servData.push(servName);
		servData.push(servPs);
		return servData
	}

	data.forEach(element => {
		if (element[0]) {
			var servName = element[0]
			var servInfo = element[1][0]
			var attacking;
			if (!servInfo) {
				attacking = "none";
			} else {
				if (!servInfo["args"]) {
					attacking = "None";
				} else {
					attacking = servInfo["args"];
				}
			}

			var maxLen = 42;
			var attackingStr = attacking.toString();
			var outStr = "[" + servName.toString() + "] Attacking: ";
			var startStr = outStr + attackingStr;
			var strLen = maxLen - startStr.length;

			var fillStr = new Array(strLen + 1).join(" ");
			ns.tprint(outStr + fillStr + attackingStr);
		}
	})
}