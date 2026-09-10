//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
};


function addGold(amount) { 
    if (typeof $gameParty !== "undefined") {
        $gameParty.gainGold(amount); 
        console.log("Gold +", amount);
    } else {
        console.error("Game chưa khởi động, không thể thêm Gold!");
    }
}

function fullRecovery() { 
    if (typeof $gameParty !== "undefined") {
        $gameParty.members().forEach(actor => actor.recoverAll()); 
        console.log("Tất cả nhân vật đã hồi phục HP/MP!");
    } else {
        console.error("Game chưa khởi động, không thể hồi phục!");
    }
}

function increaseStat(stat, value) {
    if (typeof $gameParty !== "undefined") {
        $gameParty.members().forEach(actor => {
            switch (stat) {
                case 'hp': actor._paramPlus[0] += value; break; // MaxHP
                case 'mp': actor._paramPlus[1] += value; break;
                case 'atk': actor._paramPlus[2] += value; break;
                case 'def': actor._paramPlus[3] += value; break;
                case 'agi': actor._paramPlus[6] += value; break;
                case 'luck': actor._paramPlus[7] += value; break;
            }
        });
        console.log(stat.toUpperCase() + " +" + value);
    } else {
        console.error("Game chưa khởi động, không thể tăng chỉ số!");
    }
}

function increaseLevel(levels) {
    if (typeof $gameParty !== "undefined") {
        $gameParty.members().forEach(actor => actor.changeLevel(actor.level + levels, false));
        console.log("Tất cả nhân vật +", levels, "level!");
    } else {
        console.error("Game chưa khởi động, không thể tăng level!");
    }
}