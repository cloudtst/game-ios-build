//=============================================================================
// NrSpineGage.js
//=============================================================================

/*:
 * @plugindesc Spineゲージ表示 v1.1.3
 * @author NJ
 *
 * @param Gauges
 * @text ゲージ設定
 * @desc 複数のゲージを定義できます
 * @type struct<SpineGauge>[]
 * @default []
 *
 * @help
 * 注意:
 * - PictureSpineプラグインが必要です。
 * - プラグイン管理でPictureSpineの「下」に配置してください。
 *
 * 機能概要：
 * - 指定したSpineピクチャのボーンを変数値に応じて移動させ、ゲージのように演出
 * - イーシング補間による滑らかな変化に対応
 * - スイッチや変数による表示制御が可能
 * - ラベルで「現在値 / 最大値」をピクチャ上に表示（任意）
 *
 * スクリプトコマンド：
 * NrSpineGage.forceUpdate("ゲージ名");
 *   - 指定ゲージの更新処理を即座に実行します
 *
 * NrSpineGage.forceUpdateAll();
 *   - すべてのゲージを即時更新します
 *
 * NrSpineGage.setLabelVisible("ゲージ名", true/false);
 *   - ラベルを個別に表示・非表示します
 *
 * NrSpineGage.setAllLabelsVisible(true/false);
 *   - すべてのラベルを一括表示・非表示します
 *
 * バージョン：
 * v1.1.3 ゲージの情報が他のゲージにも引き継がれてしまっていたのを修正。
 *
 * v1.1.2 制御用のスイッチや変数が反映されていなかったのを修正。
 *
 * v1.1.1 メニューなどを開いて戻った際に、ゲージの位置が元に戻ってしまうのを修正。
 *
 * v1.1.0 Boneの初期位置の実装。最大値を固定値で設定出来るように。
 *        イージングの種類を41種類に増加。
 * v1.0.0 初回
 *
 * 利用規約：
 * - プラグイン作者に無断で使用、改変、再配布は不可です。
 */

/*~struct~SpineGauge:
 * @param name
 * @text 呼び出し名
 * @type string
 * @desc このゲージの識別名です
 *
 * @param pictureId
 * @text Spineピクチャ番号
 * @type number
 * @desc Spineピクチャの番号です
 *
 * @param boneName
 * @text 対象Bone名
 * @type string
 * @desc ゲージ制御に使うSpineのボーン名
 *
 * @param currentVarId
 * @text 現在値の変数ID
 * @type variable
 * @desc 現在値を保持する変数ID
 *
 * @param maxVarId
 * @text 最大値の変数ID
 * @type variable
 * @desc 最大値を保持する変数ID
 *
 * @param maxFixedValue
 * @text 最大値の固定値
 * @type number
 * @desc 0以外で設定した場合、変数の代わりにこの値を最大値として使用します
 * @default 0
 *
 * @param baseX
 * @text Bone初期X位置
 * @type string
 * @default 0
 *
 * @param baseY
 * @text Bone初期Y位置
 * @type string
 * @default 0
 *
 * @param xMax
 * @text X変化最大(px)
 * @type string
 * @desc ゲージがX方向に動く最大ピクセル数
 *
 * @param yMax
 * @text Y変化最大(px)
 * @type string
 * @desc ゲージがY方向に動く最大ピクセル数
 *
 * @param easing
 * @text イージング種別
 * @type select
 * @option Linear
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInQuad
 * @option easeOutQuad
 * @option easeInOutQuad
 * @option easeInCubic
 * @option easeOutCubic
 * @option easeInOutCubic
 * @option easeInQuart
 * @option easeOutQuart
 * @option easeInOutQuart
 * @option easeInQuint
 * @option easeOutQuint
 * @option easeInOutQuint
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 * @default easeOutQuad
 * @desc 動きの滑らかさを制御します
 *
 * @param duration
 * @text 補間時間（フレーム）
 * @type number
 * @default 30
 * @desc 動きの補間にかけるフレーム数
 *
 * @param enableSwitches
 * @text 有効スイッチ
 * @type switch[]
 * @default []
 * @desc ONのときゲージを有効にするスイッチ一覧
 *
 * @param disableSwitches
 * @text 無効スイッチ
 * @type switch[]
 * @default []
 * @desc ONのときゲージを無効にするスイッチ一覧
 *
 * @param variableConditions
 * @text 変数条件(OR)
 * @type struct<VarCondition>[]
 * @default []
 * @desc 任意の条件に一致するとゲージが有効になります（OR条件）
 *
 * @param showLabel
 * @text ラベル表示
 * @type boolean
 * @default true
 * @desc 数値ラベルを表示するかどうか
 *
 * @param labelX
 * @text ラベルX座標
 * @type number
 * @default 0
 * @desc ラベルのX座標（ピクチャ基準）
 *
 * @param labelY
 * @text ラベルY座標
 * @type number
 * @default 0
 * @desc ラベルのY座標（ピクチャ基準）
 *
 * @param labelFontSize
 * @text ラベル文字サイズ
 * @type number
 * @default 20
 * @desc ラベルのフォントサイズ
 *
 * @param maxReachedScript
 * @text 最大値到達時スクリプト
 * @type note
 * @desc ゲージが最大値に達した時に一度だけ実行されるJavaScriptコード
 */

/*~struct~VarCondition:
 * @param variableId
 * @text 変数ID
 * @type variable
 * @desc 判定対象となる変数ID
 *
 * @param operator
 * @text 比較演算子
 * @type select
 * @option ==
 * @option >=
 * @option <=
 * @option <
 * @default ==
 * @desc 比較に使う演算子
 *
 * @param value
 * @text 値（文字列含む）
 * @type string
 * @default 0
 * @desc 比較対象の値（文字列も可）
 */


(function(){
    var pluginName = "NrSpineGage";

    function parseStructArray(param){
        var raw = PluginManager.parameters(pluginName)[param] || "[]";
        try{
            return JSON.parse(raw).map(function(s){ return JSON.parse(s); });
        }catch(e){
            return [];
        }
    }

    function safeNumber(str) {
        str = String(str)
            .replace(/[−ー―─━]/g, '-')
            .replace(/[^\d\-\.]/g, '')
            .trim();
        var num = Number(str);
        return isNaN(num) ? 0 : num;
    }

    var EASING = {
        Linear: function(t){ return t; },
        easeInSine: function(t){ return 1 - Math.cos((t * Math.PI) / 2); },
        easeOutSine: function(t){ return Math.sin((t * Math.PI) / 2); },
        easeInOutSine: function(t){ return -(Math.cos(Math.PI * t) - 1) / 2; },
        easeInQuad: function(t){ return t * t; },
        easeOutQuad: function(t){ return t * (2 - t); },
        easeInOutQuad: function(t){ return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
        easeInCubic: function(t){ return t * t * t; },
        easeOutCubic: function(t){ return (--t) * t * t + 1; },
        easeInOutCubic: function(t){ return t < .5 ? 4 * t * t * t : (t - 1)*(2*t - 2)*(2*t - 2) + 1; },
        easeInQuart: function(t){ return t * t * t * t; },
        easeOutQuart: function(t){ return 1 - (--t) * t * t * t; },
        easeInOutQuart: function(t){ return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
        easeInQuint: function(t){ return t * t * t * t * t; },
        easeOutQuint: function(t){ return 1 + (--t) * t * t * t * t; },
        easeInOutQuint: function(t){ return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
        easeInExpo: function(t){ return t === 0 ? 0 : Math.pow(2, 10 * t - 10); },
        easeOutExpo: function(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
        easeInOutExpo: function(t){ return t === 0 ? 0 : t === 1 ? 1
               : t < .5 ? Math.pow(2, 20 * t - 10) / 2
               : (2 - Math.pow(2, -20 * t + 10)) / 2; },
        easeInCirc: function(t){ return 1 - Math.sqrt(1 - t * t); },
        easeOutCirc: function(t){ return Math.sqrt(1 - (--t) * t); },
        easeInOutCirc: function(t){ return t < .5
               ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
               : (Math.sqrt(1 - (--t*2-1)* (t*2-1)) + 1) / 2; },
        easeInBack: function(t){ var c1 = 1.70158; return t * t * ((c1 + 1) * t - c1); },
        easeOutBack: function(t){ var c1 = 1.70158; return (--t) * t * ((c1 + 1) * t + c1) + 1; },
        easeInOutBack: function(t){ var c1 = 1.70158 * 1.525;
            return t < .5
                ? (Math.pow(2 * t, 2) * ((c1 + 1) * 2 * t - c1)) / 2
                : (Math.pow(2 * t - 2, 2) * ((c1 + 1) * (t * 2 - 2) + c1) + 2) / 2;
        },
        easeInElastic: function(t){ var c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1
                : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
        },
        easeOutElastic: function(t){ var c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * c4) + 1;
        },
        easeInOutElastic: function(t){ var c5 = (2 * Math.PI) / 4.5;
            return t === 0 ? 0 : t === 1 ? 1
                : t < .5
                    ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
            },
        easeInBounce: function(t){ return 1 - EASING.easeOutBounce(1 - t); },
        easeOutBounce: function(t){
            var n1 = 7.5625, d1 = 2.75;
            if (t < 1 / d1) return n1 * t * t;
            if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + .75;
            if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + .9375;
            return n1 * (t -= 2.625 / d1) * t + .984375;
        },
        easeInOutBounce: function(t){ return t < .5
            ? (1 - EASING.easeOutBounce(1 - 2 * t)) / 2
            : (1 + EASING.easeOutBounce(2 * t - 1)) / 2;
        }
    };

    var gaugeConfigs = parseStructArray("Gauges");

    function parseArrayField(field) {
        if (!field) return [];
        if (typeof field === "string") {
            try {
                return JSON.parse(field).map(s => typeof s === "string" ? JSON.parse(s) : s);
            } catch(e) {
                console.error("parseArrayField error:", e, field);
                return [];
            }
        }
        return field;
    }

    function SpineGauge(cfg){
        this._name            = cfg.name;
        this._pictureId       = Number(cfg.pictureId);
        this._boneName        = cfg.boneName;
        this._varIdCurrent    = Number(cfg.currentVarId);
        this._varIdMax        = Number(cfg.maxVarId);
        this._xMax  = safeNumber(cfg.xMax);
        this._yMax  = safeNumber(cfg.yMax);
        this._duration        = Number(cfg.duration);
        this._easingFunc      = EASING[cfg.easing] || EASING.Linear;
        this._enableSwitches  = parseArrayField(cfg.enableSwitches).map(Number);
        this._disableSwitches = parseArrayField(cfg.disableSwitches).map(Number);
        this._varConds        = parseArrayField(cfg.variableConditions).map(c => ({
            variableId: Number(c.variableId),
            operator: c.operator,
            value: c.value
        }));
        this._showLabel       = String(cfg.showLabel)==="true";
        this._labelX          = Number(cfg.labelX)||0;
        this._labelY          = Number(cfg.labelY)||0;
        this._labelFontSize   = Number(cfg.labelFontSize)||20;
        this._lastCur         = null;
        this._lastMax         = null;
        this._lastRatio       = -1;
        this._elapsed         = 0;
        this._updating        = false;
        this._startX = this._startY = this._targetX = this._targetY = 0;
        this._currentX = this._currentY = 0;
        this._maxReachedScript = cfg.maxReachedScript || "";
        this._maxReachedTriggered = false;
        this._baseX = safeNumber(cfg.baseX);
        this._baseY = safeNumber(cfg.baseY);
        this._maxFixedValue = Number(cfg.maxFixedValue || 0);
    }

    SpineGauge.prototype.isEnabled = function() {
        for (var i = 0; i < this._disableSwitches.length; i++) {
            const sid = this._disableSwitches[i];
            if ($gameSwitches.value(sid)) {
                return false;
            }
        }

        for (var i = 0; i < this._enableSwitches.length; i++) {
            const sid = this._enableSwitches[i];
            if (!$gameSwitches.value(sid)) {
                return false;
            }
        }

        for (var i = 0; i < this._varConds.length; i++) {
            const cond = this._varConds[i];
            const val = $gameVariables.value(cond.variableId);
            const cmpRaw = cond.value;
            const cmp = cmpRaw.replace(/^"(.*)"$/, "$1"); // クォート除去

            const result = (() => {
                switch (cond.operator) {
                    case "==": return String(val) === cmp;
                    case ">=": return Number(val) >= Number(cmp);
                    case "<=": return Number(val) <= Number(cmp);
                    case "<":  return Number(val) < Number(cmp);
                    default: return false;
                }
            })();

            if (!result) {
                return false;
            }
        }

        return true;
    };

    SpineGauge.prototype.update = function(){
        var cur = $gameVariables.value(this._varIdCurrent);
        var max = this._maxFixedValue > 0 ? this._maxFixedValue : ($gameVariables.value(this._varIdMax) || 1);
        var ratio = Math.min(cur / max, 1);

        if (this._lastCur === null || this._lastMax === null) {
            this._lastCur = cur;
            this._lastMax = max;
            this._lastRatio = ratio;
            this._currentX = this._baseX + this._xMax * ratio;
            this._currentY = this._baseY + this._yMax * ratio;
            this._startX = this._currentX;
            this._startY = this._currentY;
            this._targetX = this._currentX;
            this._targetY = this._currentY;
            this._elapsed = this._duration;
            this._updating = false;
            return;
        }

        if (this._lastCur !== null && cur === this._lastCur && max === this._lastMax) return;

        this._lastCur = cur;
        this._lastMax = max;

        if (!this.isEnabled()) {
            this._updating = false;
            this._maxReachedTriggered = false;
            return;
        }

        if (ratio !== this._lastRatio) {
            this._lastRatio = ratio;
            this._elapsed = 0;
            this._startX = this._currentX;
            this._startY = this._currentY;
            this._targetX = this._baseX + this._xMax * ratio;
            this._targetY = this._baseY + this._yMax * ratio;
            this._updating = true;

            this._maxReachedTriggered = false;
        }

        if (cur >= max && !this._maxReachedTriggered && this._maxReachedScript) {
            try {
                var scriptStr = this._maxReachedScript;
                if (scriptStr.startsWith('"') && scriptStr.endsWith('"')) {
                    scriptStr = scriptStr.slice(1, -1);
                }
                scriptStr = scriptStr.replace(/\\"/g, '"').replace(/\\n/g, '\n');
                eval(scriptStr);
            } catch (e) {
                console.error("NrSpineGage maxReachedScript error:", e);
            }
            this._maxReachedTriggered = true;
        }

        if (cur < max) {
            this._maxReachedTriggered = false;
        }
    };

    SpineGauge.prototype.applyFrame = function(){
        if(!this._updating)return;
        this._elapsed++;
        var t=Math.min(this._elapsed/this._duration,1);
        var e=this._easingFunc(t);
        this._currentX=this._startX+(this._targetX-this._startX)*e;
        this._currentY=this._startY+(this._targetY-this._startY)*e;
        var sp;
        try{sp=$gameScreen.spine(this._pictureId);}catch(e){return;}
        if(!sp||typeof sp.setBone!=="function")return;
        sp.setBone(this._boneName,this._currentX,this._currentY,0,1,false);
        if(t>=1)this._updating=false;
    };

    var spineGauges=gaugeConfigs.map(function(cfg){return new SpineGauge(cfg);});

    var _SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMap_update.call(this);

        for (var i = 0; i < spineGauges.length; i++) {
            spineGauges[i].update();
            spineGauges[i].applyFrame();
        }

        if (this._spineGaugeLabels) {
            for (var j = 0; j < this._spineGaugeLabels.length; j++) {
                this._spineGaugeLabels[j].update();
            }
        }

        if (this._spineGaugeRefreshCount !== undefined && this._spineGaugeRefreshCount-- === 0) {
            NrSpineGage.forceUpdateAll();
        }
    };

    var _SceneMap_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _SceneMap_onMapLoaded.call(this);

        this._spineGaugeLabels = spineGauges.map(function(g) {
            var lbl = new SpineGaugeLabel(g);
            lbl.setVisible(false);
            this.addChild(lbl);
            return lbl;
    }, this);

        this._spineGaugeRefreshCount = 1;
    };
    var _SceneMap_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _SceneMap_start.call(this);
        if (typeof NrSpineGage !== 'undefined') {
            NrSpineGage.forceUpdateAll();
        }
    };


    function SpineGaugeLabel(g){
        Sprite.call(this,new Bitmap(200,40));
        this._g=g;
        this._lastText="";
        this._visibleFlag=false;
        this.x=g._labelX;
        this.y=g._labelY;
        this.refresh("0 / 0");
    }

    SpineGaugeLabel.prototype=Object.create(Sprite.prototype);
    SpineGaugeLabel.prototype.constructor=SpineGaugeLabel;
    SpineGaugeLabel.prototype.setVisible=function(f){this._visibleFlag=f;};
    SpineGaugeLabel.prototype.refresh=function(text){
        this.bitmap.clear();
        this.bitmap.fontSize=this._g._labelFontSize;
        this.bitmap.textColor="#ffffff";
        this.bitmap.drawText(text,0,0,this.bitmap.width,this.bitmap.height,"center");
        this._lastText=text;
    };
    SpineGaugeLabel.prototype.update=function(){
        Sprite.prototype.update.call(this);
        if(!this._g._showLabel||!this._visibleFlag||!this._g.isEnabled()){
            this.visible=false;
            return;
        }
        var cur=$gameVariables.value(this._g._varIdCurrent);
        var max=$gameVariables.value(this._g._varIdMax);
        var text=cur+" / "+max;
        if(text!==this._lastText)this.refresh(text);
        this.visible=true;
    };

    window.NrSpineGage={
        forceUpdate:function(name){
            for(var i=0;i<spineGauges.length;i++){
                var g=spineGauges[i];
                if(g._name===name){
                    g._lastRatio=-1;
                    g.update();
                    g.applyFrame();
                    return;
                }
            }
        },
        forceUpdateAll:function() {
            for (var i = 0; i < spineGauges.length; i++) {
                spineGauges[i]._lastCur = null;
                spineGauges[i]._lastMax = null;
                spineGauges[i]._lastRatio = -1;
                spineGauges[i].update();
                spineGauges[i].applyFrame();
            }
        },
        setLabelVisible:function(name,vis){
            var sc=SceneManager._scene;
            if(sc._spineGaugeLabels){
                for(var i=0;i<sc._spineGaugeLabels.length;i++){
                    var l=sc._spineGaugeLabels[i];
                    if(l._g._name===name){
                        l.setVisible(vis);
                        return;
                    }
                }
            }
        },
        setAllLabelsVisible:function(vis){
            var sc=SceneManager._scene;
            if(sc._spineGaugeLabels){
                for(var i=0;i<sc._spineGaugeLabels.length;i++){
                    sc._spineGaugeLabels[i].setVisible(vis);
                }
            }
        }
    };

})();
