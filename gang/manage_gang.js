/** @param {NS} ns **/
export async function main(ns) {
	const sleep = (ms) => {
		const ret = new Promise(resolve => setTimeout(resolve, ms));
		ns.print(`sleep: Sleeping for ${Math.floor(ms)} milliseconds`);
		return ret;
	};

    // ns.disableLog("ALL");
    let updateDelay = 10000;

    const maxMoneyPercent = 0.01; // Max % of money to use when buying
    const ascendThreshold = 1.3;  // DECIDE VALUE SOON
    const maxAscendMulti = 25;
    const names = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `K`, `L`, `M`, `N`, `O`, `P`];

    // List of tasks we are going to use
    const tasks = {
        respect: "Terrorism",
        money: "Human Trafficking",
        lowerWanted: "Terrorism", // Terrorism gens money but uses less wanted than Human Trafficking
        combat: "Train Combat"
    }

    const weaponOrder = ["Baseball Bat","Katana","Glock 18C","P90C","Steyr AUG","AK-47","M15A10 Assault Rifle","AWM Sniper Rifle"];
    const armorOrder = ["Bulletproof Vest","Full Body Armor","Liquid Body Armor","Graphene Plating Armor"];
    const vehicleOrder = ["Ford Flex V20","ATX1070 Superbike","Mercedes-Benz S9001","White Ferrari"];
    const rootkitOrder = ["NUKE Rootkit","Soulstealer Rootkit","Demon Rootkit", "Hmap Node","Jack the Ripper"];
    const augOrder = ["Bionic Arms","Bionic Legs","Bionic Spine","BrachiBlades","Nanofiber Weave","Synthetic Heart","Synfibril Muscle","BitWire","Neuralstimulator","DataJack","Graphene Bone Lacings"];



    // Main loop
    while (true) {
        recruit();
        ascend(); 
        buyGear();     
        await sleep(updateDelay);
    }

    function recruit() {
        if (ns.gang.getMemberNames().length < names.length) {
            ns.tprintf(`SUCCESS | Gang full`);
        } else {
            ns.gang.recruitMember(names[ns.gang.getMemberNames().length + 1]);
        }
    }

    function ascend() {
        let members = ns.gang.getMemberNames();
        for (let i = 0; i < members.length; i++) {
            let memberInfo = ns.gang.getMemberInformation(members[i]);
            let memberAscResult = ns.gang.getAscensionResult(members[i]);
            if (memberAscResult != undefined){
                ns.print(`AscRes.Str: ${memberAscResult.str}, ${ascendThreshold}`)
                ns.print(`MemInfo.str_asc_mult: ${memberInfo.str_asc_mult}, ${maxAscendMulti}`)
                if (memberAscResult.str > ascendThreshold && memberInfo.str_asc_mult < maxAscendMulti) {
                    ns.print(`[${members[i]}] Ascend`);
                    ns.gang.ascendMember(members[i]);
                    setMode(members[i], tasks.combat);
    
                } else if (memberInfo.str_mult >= maxAscendMulti) {
                    setMode(members[i], tasks.money);
                }
            }
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
                    // ns.print(`[${member}] Bought: ${weaponOrder[i]}`)
                }    
            }
        }
        // Armor
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            for (let i = 0; i < armorOrder.length; i++) {
                if (ns.gang.getEquipmentCost(armorOrder[i]) < ns.getServerMoneyAvailable("home") * maxMoneyPercent) {
                    ns.gang.purchaseEquipment(member, armorOrder[i]);
                    // ns.print(`[${member}] Bought: ${armorOrder[i]}`)
                }
            }
        }
        // Vehicle
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            for (let i = 0; i < vehicleOrder.length; i++) {
                if (ns.gang.getEquipmentCost(vehicleOrder[i]) < ns.getServerMoneyAvailable("home") * maxMoneyPercent) {
                    ns.gang.purchaseEquipment(member, vehicleOrder[i]);
                    // ns.print(`[${member}] Bought: ${vehicleOrder[i]}`)
                }
            }
        }
    }

    function setMode(member, mode){
        ns.print(`[Mode] ${mode}`);
        ns.gang.setMemberTask(member, mode);
    }
}