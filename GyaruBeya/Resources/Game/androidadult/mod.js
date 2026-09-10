function runModMenu() {
    const gameFrame = document.getElementById("game-inner-frame");
    if (!gameFrame) return alert("iframe not found");

    const gw = gameFrame.contentWindow;

    if (!gw || !gw.$gameParty || !gw.$dataItems || !gw.$gameActors) {
        alert("Game not ready. Try again after it fully loads.");
        return;
    }

    const confirmOpen = gw.confirm("Android Port + Mod by androidadult.com\n\nOpen mod menu?");
    if (!confirmOpen) return;

    const option = gw.prompt("Choose a reward:\n1 = Gold\n2 = Recovery\n3 = Stats\n4 = Lv+10", "1");
    if (!option) return;

    switch (option.trim()) {
        case "1": // Gold
            gw.$gameParty.gainGold(99999);
            gw.alert("You received 99999 Gold!");
            break;

        case "2": {
            // Universal detection of recovery items
            const recoveryItems = gw.$dataItems.filter(item =>
                item &&
                Array.isArray(item.effects) &&
                item.effects.some(effect => effect.code === 11 || effect.code === 12)
            );

            if (recoveryItems.length === 0) {
                gw.alert("No recovery items found in the database.");
                break;
            }

            // Create a list of recovery items to show in the prompt
            let recoveryChoices = "Choose a recovery item:\n";
            recoveryItems.forEach((item, index) => {
                recoveryChoices += `${index + 1}. ${item.name}\n`;
            });

            const recoveryChoice = gw.prompt(recoveryChoices, "1");

            const selectedRecovery = recoveryItems[parseInt(recoveryChoice) - 1];

            if (selectedRecovery) {
                gw.$gameParty.gainItem(selectedRecovery, 50); // Give 50 of the item
                gw.alert(`You received 50 ${selectedRecovery.name}!`);
            } else {
                gw.alert("Invalid choice.");
            }
            break;
        }


        case "3": { // Stats fallback
            const statsItem = gw.$dataItems.find(item => item);

            if (statsItem) {
                gw.$gameParty.gainItem(statsItem, 50);
                gw.alert(`You received 50 ${statsItem.name}!`);
            } else {
                gw.alert("No items found in the database.");
            }
            break;
        }

        case "4": { // Lv+10 fallback via EXP
            const partyMembers = gw.$gameParty.members();

            if (partyMembers.length === 0) {
                gw.alert("No party members found.");
                break;
            }

            partyMembers.forEach(actor => {
                // Get current level and target level
                const currentLevel = actor.level;
                const targetLevel = currentLevel + 10;
                const actorId = actor._actorId;

                // Cap to max level
                const maxLevel = gw.$gameActors.actor(actorId).maxLevel();
                const finalLevel = Math.min(targetLevel, maxLevel);

                // Get total EXP for final level
                const targetExp = gw.$gameActors.actor(actorId).expForLevel(finalLevel);

                actor.changeExp(targetExp, true); // 'true' = show level up
                actor.refresh();
            });

            gw.alert("All party members leveled up by 10!");
            break;
        }



        default:
            gw.alert("Invalid option selected.");
            break;
    }
}
