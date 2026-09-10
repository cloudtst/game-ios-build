//=============================================================================
// NrParameterCalculation.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc 計算補助システム v1.0.0
 * @author NJ
 *
 * @param statusList
 * @text ステータス定義リスト
 * @type struct<StatusItem>[]
 * @default []
 *
 * @help
 * 【使用例】
 * 複数のステータスをプラグインマネージャで定義できます。
 * 各定義にはレベル変数・EXP変数・最大EXP計算式を含みます。
 *
 * 【プラグインコマンド】
 * NrGAIN_EXP ステータス名 経験値（\v[n] 対応）
 *
 * 【スクリプトコマンド】
 * NrGAIN_EXP(ステータス名,経験値)
 *
 * バージョン
 * v1.0.0 初回
 *
 * 利用規約：
 *  プラグイン作者に無断で使用、改変、再配布は不可です。
 */

/*~struct~StatusItem:
 * @param name
 * @text ステータス名
 * @type string
 *
 * @param levelVar
 * @text レベル変数ID
 * @type variable
 *
 * @param expVar
 * @text 現在EXP変数ID
 * @type variable
 *
 * @param expMaxVar
 * @text 最大EXP変数ID
 * @type variable
 *
 * @param expMaxBase
 * @text 初期最大EXP
 * @type number
 * @default 0
 *
 * @param expCalcMode
 * @text 計算方法
 * @type select
 * @option +
 * @option -
 * @option *
 * @option /
 * @default +
 *
 * @param expCalcValue
 * @text 計算式または定数
 * @type string
 * @default 1
 *
 * @param manualExpList
 * @text 手動指定リスト
 * @type struct<ManualExp>[]
 * @default []
 *
 * @param levelStart
 * @text 開始レベル
 * @type number
 * @default 1
 *
 * @param levelBase
 * @text 計算基準レベル
 * @type number
 * @default 1
 *
 * @param levelMax
 * @text レベル上限
 * @type number
 * @default 99
 */

/*~struct~ManualExp:
 * @param level
 * @text レベル
 * @type number
 *
 * @param value
 * @text 最大EXP
 * @type number
 */

(function() {
    'use strict';

    const PLUGIN_NAME = "NrParameterCalculation";
    const parameters = PluginManager.parameters(PLUGIN_NAME);

    let statusList = [];

    try {
        statusList = JSON.parse(parameters.statusList || "[]").map(str => {
            const item = JSON.parse(str);
            item.manualExpList = JSON.parse(item.manualExpList || "[]").map(e => JSON.parse(e)); // 2階層目（ManualExp[]）
            return item;
        });
    } catch (e) {
        console.error(`[${PLUGIN_NAME}] パラメータ読み込み失敗`, e);
    }

    function convertVar(str) {
        return String(str).replace(/\\v\[(\d+)]/gi, (_, n) => $gameVariables.value(Number(n)));
    }

    function calcExpMax(item, levelRaw) {
        const level = Number(levelRaw);
        const base = Number(item.expMaxBase);
        const levelBase = Number(item.levelBase);
        const mode = item.expCalcMode;
        let formula = String(item.expCalcValue || "1").trim();

        for (const entry of item.manualExpList) {
            if (Number(entry.level) === level) return Number(entry.value);
        }

        if (/^\d+(\.\d+)?$/.test(formula)) {
            formula = `(level - levelBase) * ${formula}`;
        }

        let value = 0;
        try {
            value = new Function("level", "levelBase", `return (${formula})`)(level, levelBase);
        } catch (e) {
            console.error(`[${PLUGIN_NAME}] 計算式エラー (${item.name})`, e);
        }

        switch (mode) {
            case '+': return base + value;
            case '-': return base - value;
            case '*': return base * value;
            case '/': return value !== 0 ? base / value : base;
            default: return base;
        }
    }

    function updateOne(item) {
        const level = $gameVariables.value(Number(item.levelVar));
        const max = calcExpMax(item, level);
        $gameVariables.setValue(Number(item.expMaxVar), max);
    }

    function updateAll() {
        statusList.forEach(updateOne);
    }

    function initializeLevels() {
        statusList.forEach(item => {
            const id = Number(item.levelVar);
            const start = Number(item.levelStart || 1);
            if ($gameVariables.value(id) === 0) {
                $gameVariables.setValue(id, start);
            }
        });
    }

    function gainExp(nameRaw, valueRaw) {
        const name = convertVar(nameRaw);
        const gain = Number(convertVar(valueRaw));
        const item = statusList.find(i => i.name === name);
        if (!item) return;

        const expId = Number(item.expVar);
        const lvId = Number(item.levelVar);
        const maxLv = Number(item.levelMax);
        const minLv = Number(item.levelBase);

        let exp = $gameVariables.value(expId) + gain;
        let level = $gameVariables.value(lvId);

        if (gain >= 0) {
            while (level < maxLv) {
                const maxExp = calcExpMax(item, level);
                if (exp < maxExp) break;
                exp -= maxExp;
                level++;
            }
            if (level >= maxLv) {
                const maxExp = calcExpMax(item, level);
                if (exp >= maxExp) exp = maxExp - 1;
            }
        } else {
            while (level > minLv) {
                const prevLevel = level - 1;
                const prevMax = calcExpMax(item, prevLevel);
                if (exp >= 0) break;
                level--;
                exp += prevMax;
            }
            if (exp < 0) exp = 0;
        }

        $gameVariables.setValue(expId, exp);
        $gameVariables.setValue(lvId, level);
        updateOne(item);
    }

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === "NrGAIN_EXP") gainExp(args[0], args[1]);
        if (command === `${PLUGIN_NAME}_UPDATE_ALL`) updateAll();
    };

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        //initializeLevels();
        //updateAll();
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.apply(this, arguments);
        initializeLevels();
        updateAll();
    };

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.apply(this, arguments);
        statusList.forEach(item => {
            const levelId = Number(item.levelVar);
            const expId = Number(item.expVar);
            if (variableId === levelId || variableId === expId) {
                updateOne(item);
            }
        });
    };

    window.NrGAIN_EXP = function(nameRaw, valueRaw) {
        const name = convertVar(nameRaw);
        const value = convertVar(valueRaw);
        gainExp(name, value);
    };

})();
