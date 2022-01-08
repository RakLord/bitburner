/** @param {NS} ns **/
export async function main(ns) {
	const sleep = (ms) => {
		const ret = new Promise(resolve => setTimeout(resolve, ms));
		ns.print(`sleep: Sleeping for ${Math.floor(ms)} milliseconds`);
		return ret;
	};

    var members = ns.gang.getMemberNames();

    ns.disableLog("ALL");

    var data = ns.flags([
        [`task`, ""],
        [`buy`, ""],
        [`ascend`, 0]
    ])

    const maxMoneyPercent = 0.05; // Max % of money to use when buying
    const ascendThreshold = 2;  // DECIDE VALUE SOON
    const maxAscendMulti = 40;

    const weaponOrder = ["Baseball Bat","Katana","Glock 18C","P90C","Steyr AUG","AK-47","M15A10 Assault Rifle","AWM Sniper Rifle"];
    const armorOrder = ["Bulletproof Vest","Full Body Armor","Liquid Body Armor","Graphene Plating Armor"];
    const vehicleOrder = ["Ford Flex V20","ATX1070 Superbike","Mercedes-Benz S9001","White Ferrari"];
    const rootkitOrder = ["NUKE Rootkit","Soulstealer Rootkit","Demon Rootkit", "Hmap Node","Jack the Ripper"];
    const augOrder = ["Bionic Arms","Bionic Legs","Bionic Spine","BrachiBlades","Nanofiber Weave","Synthetic Heart","Synfibril Muscle","BitWire","Neuralstimulator","DataJack","Graphene Bone Lacings"];


    if (data.task != "") {
        for (var i = 0; i < members.length; ++i) {
            setMode(members[i], data.task)
        }
        ns.tprintf(`SUCCESS | Mode set to ${data.task}`)
    }

    if (data.buy != "") {
        ns.tprintf(`[BUY] Buying all weaps`);
        buyGear();

    }

    if (data.ascend != 0) {
        ns.tprintf(`[ASCEND] Ascending`);
        ascend();
    }


    function setMode(member, mode){
        ns.gang.setMemberTask(member, mode);
    }

    function ascend() {
        let members = ns.gang.getMemberNames();
        for (let i = 0; i < members.length; i++) {
            let memberInfo = ns.gang.getMemberInformation(members[i]);
            let memberAscResult = ns.gang.getAscensionResult(members[i]);
            if (memberAscResult != undefined){
                ns.print(`[${members[i]}] Ascend`);
                ns.gang.ascendMember(members[i]);
            }
            buyGear();
        }
    }

    function buyGear() {
        let members = ns.gang.getMemberNames();
        // Weapon
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            for (let i = 0; i < weaponOrder.length; i++) {
                if (ns.gang.getEquipmentCost(weaponOrder[i]) < ns.getServerMoneyAvailable("home") * maxMoneyPercent) {

                    ns.gang.purchaseEquipment(member, weaponOrder[i]);
                    ns.print(`[${member}] Bought: ${weaponOrder[i]}`)
                }    
            }
        }
        // Armor
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            for (let i = 0; i < armorOrder.length; i++) {
                if (ns.gang.getEquipmentCost(armorOrder[i]) < ns.getServerMoneyAvailable("home") * maxMoneyPercent) {
                    ns.gang.purchaseEquipment(member, armorOrder[i]);
                    ns.print(`[${member}] Bought: ${armorOrder[i]}`)
                }
            }
        }
        // Vehicle
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            for (let i = 0; i < vehicleOrder.length; i++) {
                if (ns.gang.getEquipmentCost(vehicleOrder[i]) < ns.getServerMoneyAvailable("home") * maxMoneyPercent) {
                    ns.gang.purchaseEquipment(member, vehicleOrder[i]);
                    ns.print(`[${member}] Bought: ${vehicleOrder[i]}`)
                }
            }
        }
    }
}