//=============================================================================
// OnClickCE.js
//=============================================================================

/*:
 * @plugindesc 条件を満たした場合にコモンイベントをトリガーで起動。（条件別クールタイム設定対応）
 * @author Onmoremind
 *
 * @param conditionGroups
 * @text 条件グループ
 * @desc 各グループに条件を設定してトリガーを起動
 * @type struct<ConditionGroup>[]
 * @default []
 *
 * @param disableSwitchId
 * @text 無効化スイッチID
 * @desc 指定されたスイッチがONのとき、すべてのトリガーを無効化
 * @type switch
 * @default 0
 *
 * @param resetSwitchId
 * @text リセットスイッチID
 * @desc トリガーのクールダウンをリセットするスイッチID
 * @type switch
 * @default 0
 *
 * @param resetOnVariableChange
 * @text 変数変更でリセット
 * @desc 変数が変更されたときにクールダウンを解除
 * @type boolean
 * @default true
 */

/*~struct~ConditionGroup:
 * @param SceneName
 * @text シーン名
 * @desc この条件グループが適用されるシーンの名前を指定
 * @type text
 * @default シーン名
 *
 * @param groupSwitchIds
 * @text シーングループスイッチID
 * @desc この条件グループが有効となるスイッチID（複数可）
 * @type switch[]
 * @default []
 *
 * @param groupVariableConditions
 * @text シーン変数条件
 * @desc 条件グループに関連付ける変数条件
 * @type struct<VariableCondition>[]
 * @default []
 *
 * @param conditions
 * @text 条件リスト
 * @desc この条件グループで使用される条件
 * @type struct<Condition>[]
 * @default []
 */

/*~struct~VariableCondition:
 * @param variableId
 * @text 変数ID
 * @desc 条件に使用するゲーム変数のID
 * @type variable
 * @default 1
 *
 * @param comparisonType
 * @text 比較タイプ
 * @desc 変数の評価方法（範囲指定の場合、"1-10"の形式で指定）
 * @type select
 * @option 範囲
 * @value range
 * @option 等しい
 * @value equal
 * @option 以上
 * @value greaterOrEqual
 * @option 以下
 * @value lessOrEqual
 * @option 超過
 * @value greaterThan
 * @option 未満
 * @value lessThan
 * @default equal
 * @option 文字列一致
 * @value stringEqual
 * @default equal
 *
 * @param triggerValue
 * @text トリガー値
 * @desc この変数に設定されるトリガー値（範囲の場合は "1-10" の形式で指定）
 * @type text
 * @default 1
 */

/*~struct~Condition:
 * @param commandName
 * @text コマンド名
 * @desc 
 * @type text
 * @default 条件名
 *
 * @param variableConditions
 * @text 変数条件リスト
 * @desc トリガー条件となる複数の変数とそのトリガー値を設定します
 * @type struct<VariableCondition>[]
 * @default []
 *
 * @param triggerTypes
 * @text トリガータイプ
 * @desc 起動条件を設定
 * @type select[]
 * @option 左クリック
 * @value leftClick
 * @option 左クリック（トリガー）
 * @value leftClickTriggered
 * @option 左クリック（繰り返し）
 * @value leftClickRepeated
 * @option 左クリック（長押し）
 * @value leftClickLongPressed
 * @option 左クリック（解除）
 * @value leftClickReleased
 * @option 右クリック
 * @value rightClick
 * @option シフトキー
 * @value shift
 * @option キーボードキー
 * @value keyboard
 * @option 決定キー
 * @value okKey
 * @option キャンセルキー
 * @value cancelKey
 * @option 上キー
 * @value upKey
 * @option 下キー
 * @value downKey
 * @option 左キー
 * @value leftKey
 * @option 右キー
 * @value rightKey

 * @default ["leftClick"]
 *
 * @param keyCode
 * @text キーボードキー
 * @desc キーボードトリガー用のキーコードを指定
 * @type text
 * @default a
 *
 * @param priority
 * @text 優先順位
 * @desc 同時に複数の条件が成立した場合の優先度。数値が小さいほど優先
 * @type number
 * @min 1
 * @default 10
 *
 * @param switchIds
 * @text スイッチID
 * @desc この条件が成立するために必要なスイッチID（複数可）
 * @type switch[]
 * @default []
 *
 * @param disableSwitchIds
 * @text 無効化スイッチID
 * @desc 無効化スイッチがONのとき、この条件は無効（複数可）
 * @type switch[]
 * @default []
 *
 * @param cooldownFrames
 * @text クールダウンフレーム
 * @desc 条件ごとに設定できるクールダウンのフレーム数（例：60フレーム＝1秒）
 * @type number
 * @default 60
 *
 * @param commonEventId
 * @text コモンイベントID
 * @desc 条件が成立したときに呼び出されるコモンイベントID
 * @type common_event
 */

(() => {
    const parameters = PluginManager.parameters('OnclickCE');
    const conditionGroups = JSON.parse(parameters['conditionGroups'] || '[]').map(group => JSON.parse(group));
    const disableSwitchId = Number(parameters['disableSwitchId']);
    const resetSwitchId = Number(parameters['resetSwitchId']);
    const resetOnVariableChange = parameters['resetOnVariableChange'] === 'true';

    const keyCodeMap = {
        'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72, 'i': 73, 'j': 74,
        'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84,
        'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90,
        '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
        'up': 38,   // 上キー
        'down': 40, // 下キー
        'left': 37, // 左キー
        'right': 39, // 右キー
         'ok': 'ok',         // 決定キー
        'cancel': 'cancel'  // キャンセルキー
    };

    let clickCooldown = false;
    let cooldowns = {};  
    let cooldownTimer = 0;
    const COOLDOWN_RESET_FRAMES = 60; 
    let pluginDisabled = false;
    const previousValues = {};

    function registerKeyInput(keyCode) {
        const code = keyCodeMap[keyCode];
        if (code && !Input.keyMapper[code]) {
            Input.keyMapper[code] = keyCode;
        }
    }

    function areSwitchesOn(switchIds) {
        return switchIds.every(id => $gameSwitches.value(Number(id)));
    }

    function isAnySwitchOn(switchIds) {
        return switchIds.some(id => $gameSwitches.value(Number(id)));
    }

    function evaluateVariableCondition(variableValue, comparisonType, triggerValue) {
        switch (comparisonType) {
            case 'range':
                const [min, max] = triggerValue.split('-').map(Number);
                return variableValue >= min && variableValue <= max;
            case 'equal':
                return variableValue === Number(triggerValue);
            case 'greaterOrEqual':
                return variableValue >= Number(triggerValue);
            case 'lessOrEqual':
                return variableValue <= Number(triggerValue);
            case 'greaterThan':
                return variableValue > Number(triggerValue);
            case 'lessThan':
                return variableValue < Number(triggerValue);
            case 'stringEqual':  // 追加部分
                return String(variableValue) === triggerValue;
            default:
                return false;
        }
    }

    function areVariablesInRange(variableConditions) {
        return variableConditions.every(condition => {
            const variableValue = $gameVariables.value(Number(condition.variableId));
            const comparisonType = condition.comparisonType;
            const triggerValue = condition.triggerValue;
            return evaluateVariableCondition(variableValue, comparisonType, triggerValue);
        });
    }

    function isGroupConditionMet(group) {
        const groupSwitchIds = JSON.parse(group.groupSwitchIds || '[]');
        const groupVariableConditions = JSON.parse(group.groupVariableConditions || '[]').map(cond => JSON.parse(cond));

        const areGroupSwitchesOn = groupSwitchIds.length === 0 || areSwitchesOn(groupSwitchIds);

        if (groupVariableConditions.length > 0) {
            const areVariablesMet = areVariablesInRange(groupVariableConditions);
            return areGroupSwitchesOn && areVariablesMet;
        }

        return areGroupSwitchesOn;
    }

    function isTriggerPressed(triggerTypes, keyCode) {
        return triggerTypes.some(triggerType => {
            switch (triggerType) {
                case 'leftClick':
                    return TouchInput.isPressed();
                case 'leftClickTriggered':
                    return TouchInput.isTriggered();
                case 'leftClickRepeated':
                    return TouchInput.isRepeated();
                case 'leftClickLongPressed':
                    return TouchInput.isLongPressed();
                case 'leftClickReleased':
                    return TouchInput.isReleased();
                case 'rightClick':
                    return TouchInput.isCancelled();
                case 'shift':
                    return Input.isTriggered('shift');
                case 'keyboard':
                    return keyCode && Input.isTriggered(keyCode);
                case 'upKey': // 上キー
                    return Input.isTriggered('up');
                case 'downKey': // 下キー
                    return Input.isTriggered('down');
                case 'leftKey': // 左キー
                    return Input.isTriggered('left');
                case 'rightKey': // 右キー
                    return Input.isTriggered('right');
                case 'okKey':  // 決定キー
                    return Input.isTriggered('ok');
                case 'cancelKey':  // キャンセルキー
                    return Input.isTriggered('cancel');
                default:
                    return false;
            }
        });
    }

    function updateCooldowns() {
        Object.keys(cooldowns).forEach(conditionId => {
            if (cooldowns[conditionId] > 0) {
                cooldowns[conditionId]--;
            }
        });
    }

    function logTriggerInfo(triggerType, commandName, commonEventId, groupName, switchIds, variableConditions) {
        console.log(
            `%c[OnClickCE] トリガー発生:`,
            'color: #00aaff; font-weight: bold;'
        );
        console.log(`    条件グループ: ${groupName}`);
        console.log(`    トリガータイプ: ${triggerType}`);
        console.log(`    コマンド名: ${commandName}`);
        console.log(`    コモンイベントID: ${commonEventId}`);
        if (switchIds && switchIds.length > 0) {
            console.log(`    スイッチ状態: ${switchIds.map(id => `#${id}: ${$gameSwitches.value(id)}`).join(', ')}`);
        }
        if (variableConditions && variableConditions.length > 0) {
            console.log(
                `    変数条件: ${variableConditions.map(cond =>
                    `変数#${cond.variableId} (${cond.comparisonType} ${cond.triggerValue}): 現在値 ${$gameVariables.value(cond.variableId)}`
                ).join(', ')}`);
        }
    }


    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.apply(this, arguments);

        if (pluginDisabled || (disableSwitchId > 0 && $gameSwitches.value(disableSwitchId))) {
            return;
        }

        if (clickCooldown) {
            cooldownTimer++;
            if (cooldownTimer >= COOLDOWN_RESET_FRAMES) {
                clickCooldown = false;
                cooldownTimer = 0;
            }
        }

        conditionGroups.forEach(group => {
            if (!isGroupConditionMet(group)) {
                return;
            }

            const conditions = JSON.parse(group.conditions || '[]').map(condition => JSON.parse(condition));
            conditions.sort((a, b) => a.priority - b.priority);

            for (const condition of conditions) {
                const conditionId = `${group.SceneName}-${condition.commandName}`; 
                const variableConditions = JSON.parse(condition.variableConditions || '[]').map(cond => JSON.parse(cond));
                const triggerTypes = JSON.parse(condition.triggerTypes);
                const keyCode = String(condition.keyCode || '').toLowerCase();
                const switchIds = JSON.parse(condition.switchIds || '[]');
                const disableSwitchIds = JSON.parse(condition.disableSwitchIds || '[]');
                const commonEventId = Number(condition.commonEventId);
                const cooldownFrames = Number(condition.cooldownFrames); 
                const areAllSwitchesOn = switchIds.length === 0 || areSwitchesOn(switchIds);
                const isAnyDisableSwitchOn = disableSwitchIds.length > 0 && isAnySwitchOn(disableSwitchIds);

                if (isAnyDisableSwitchOn) continue;
                if (keyCode) registerKeyInput(keyCode);

                if (cooldowns[conditionId] > 0) {
                    continue;  
                }

                if (isTriggerPressed(triggerTypes, keyCode)) {
                    const isConditionMet = areVariablesInRange(variableConditions);

                    if (isConditionMet && areAllSwitchesOn) {
                        $gameTemp.reserveCommonEvent(commonEventId);
                        cooldowns[conditionId] = cooldownFrames;

                        logTriggerInfo(
                            triggerTypes.join(', '),
                            condition.commandName,
                            commonEventId,
                            group.SceneName,
                            switchIds,
                            variableConditions
                        );

                        if (resetSwitchId > 0 && $gameSwitches.value(resetSwitchId)) {
                            clickCooldown = false;
                        }

                        if (resetOnVariableChange) {
                            variableConditions.forEach(condition => {
                                previousValues[condition.variableId] = $gameVariables.value(condition.variableId);
                            });
                        }
                        break;
                    }
                }
            }
        });

        updateCooldowns();  
    };

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'OnclickCE') {
            const subCommand = args[0];
            if (subCommand === 'disableClickTrigger') {
                pluginDisabled = true;
            } else if (subCommand === 'enableClickTrigger') {
                pluginDisabled = false;
            }
        }
    };
})();
