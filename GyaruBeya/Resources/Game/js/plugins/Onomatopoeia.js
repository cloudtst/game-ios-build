/**
 *  @file    Onomatopoeia
 *  @author  moca
 *  @version 1.0.1 2023/10/05
 */

/*:ja
 * @plugindesc v1.0.1 オノマトペを表現します
 * @author moca
 * @help オノマトペとして画像ファイルをイージングして表示します。
 * イージングパターンは以下のサイトを参照してください。
 * http://easings.net/ja
 *
 *
 * ### プラグインコマンド
 * omtp プリセット番号
 * - 指定したプリセット番号のオノマトペを表示します
 *
 * omtp プリセット番号 delete
 * - 指定したプリセット番号のオノマトペを削除します
 *
 * ## バージョン履歴
 * 2023/10/05 1.0.1 表示順の変更、透明度用イージング、プリセット番号ごとに削除、シーン遷移後に復元する機能を追加
 * 2023/09/29 1.0.0 初版
 *
 * 利用規約：
 * プラグイン作者に無断で使用、改変、再配布は不可です。
 *
 * @param Presets
 * @text プリセット
 * @desc プリセットを指定します
 * @type struct<PresetData>[]
 *
 * @param Scenes
 * @text 復元シーン名
 * @desc オノマトペを復元するシーン（Scene_Menuを指定した場合、メニューからマップなどに戻った際にオノマトペが復元されます）
 * @type combo[]
 * @default ["Scene_Menu"]
 * @option Scene_Battle
 * @option Scene_Menu
 * @option Scene_Map
 */

/*~struct~PresetData:
 * @param name
 * @text 画像ファイル
 * @desc オノマトペとして表示する画像ファイルを指定します
 * @type file
 *
 * @param startX
 * @text 開始座標X
 * @desc イージング開始時のX座標を指定します
 * @type number
 *
 * @param startY
 * @text 開始座標Y
 * @desc イージング開始時のY座標を指定します
 * @type number
 *
 * @param rndX
 * @text X座標のランダム増加幅
 * @desc イージング開始時のX座標にランダムで加算する値の最大値を指定します
 * @type number
 * @default 0
 *
 * @param rndY
 * @text Y座標のランダム増加幅
 * @desc イージング開始時のY座標にランダムで加算する値の最大値を指定します
 * @type number
 * @default 0
 *
 * @param targetX
 * @text 終了座標X
 * @desc イージング終了時のX座標を指定します
 * @type number
 *
 * @param targetY
 * @text 終了座標Y
 * @desc イージング終了時のY座標を指定します
 * @type number
 *
 * @param startScale
 * @text 開始拡大率
 * @desc イージング開始時の拡大率を指定します
 * @type number
 * @default 100
 *
 * @param targetScale
 * @text 終了拡大率
 * @desc イージング終了時の拡大率を指定します
 * @type number
 *
 * @param easingType
 * @text イージングの種類
 * @desc イージングの種類を指定します
 * @type select
 * @default linear
 * @option linear
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
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 *
 * @param startOpacity
 * @text 開始透明度
 * @desc イージング開始時の透明度を指定します（0~255）
 * @type number
 * @default 255
 * @min 0
 * @max 255
 *
 * @param targetOpacity
 * @text 終了透明度
 * @desc イージング終了時の透明度を指定します（0~255）
 * @type number
 * @default 0
 * @min 0
 * @max 255
 *
 * @param easingOpacityType
 * @text 透明度イージングの種類
 * @desc イージングの種類を指定します
 * @type select
 * @default linear
 * @option linear
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
 * @option easeInSine
 * @option easeOutSine
 * @option easeInOutSine
 * @option easeInExpo
 * @option easeOutExpo
 * @option easeInOutExpo
 * @option easeInCirc
 * @option easeOutCirc
 * @option easeInOutCirc
 * @option easeInElastic
 * @option easeOutElastic
 * @option easeInOutElastic
 * @option easeInBack
 * @option easeOutBack
 * @option easeInOutBack
 * @option easeInBounce
 * @option easeOutBounce
 * @option easeInOutBounce
 *
 * @param duration
 * @text イージング時間
 * @desc イージングが完了するまでの時間（フレーム数）を指定します
 * @type number
 * @default 60
 * @min 1
 *
 * @param loops
 * @text ループ回数
 * @desc イージングのループ回数を指定します。0で無限ループになります。
 * @type number
 * @default 0
 * @min 0
 *
 * @param rndOnLoop
 * @text ループ時のランダム値の再計算
 * @desc ループ時にランダム値を再計算するかどうかを指定します
 * @type boolean
 * @default true
 */

(function (jQueryEasing) {
  "use strict";

  // プラグインパラメータ
  const PLUGIN_NAME = document.currentScript.src
    .split("/")
    .pop()
    .replace(/\.js$/, "");
  const PARAMS = PluginManager.parameters(PLUGIN_NAME);

  const PRESETS = JSON.parse(PARAMS["Presets"]);

  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.apply(this, arguments);

    if (args.length < 1) {
      return;
    }

    var option = "start";
    if (args.length >= 2) {
      option = args[1].toLowerCase();
    }

    var cmd = command.toLowerCase();
    if (cmd === "omtp") {
      if ($gameTemp._onmtpManager === null) {
        $gameTemp._onmtpManager = new OnomatopoeiaManager();
      }
      switch (option) {
        case "start":
          var presetNum = parseInt(args[0]) - 1;
          if (PRESETS.length > presetNum) {
            $gameTemp._onmtpManager.add(presetNum);
          }
          break;
        case "delete":
          var presetNum = parseInt(args[0]) - 1;
          if (PRESETS.length > presetNum) {
            $gameTemp._onmtpManager.removePreset(presetNum);
          }
          break;
      }
    }
  };

  // マップに入ったら生成する
  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _Game_Map_setup.call(this, mapId);
    if ($gameTemp._onmtpManager === null) {
      $gameTemp._onmtpManager = new OnomatopoeiaManager();
    }
    $gameTemp._onmtpManager._mapId = -1;
  };

  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this._onmtpManager = null;
  };

  const _Scene_Base_isReady = Scene_Base.prototype.isReady;
  Scene_Base.prototype.isReady = function () {
    if ($gameTemp !== null) {
      if ($gameTemp._onmtpManager !== null) {
        $gameTemp._onmtpManager.restore();
      }
    }
    return _Scene_Base_isReady.call(this);
  };

  class Sprite_Onomatopoeia extends Sprite {
    constructor(param, time = 0, loopTime = 0, rndPosition = { x: 0, y: 0 }) {
      super();

      this.visible = false;
      this.z = 10;
      this.anchor = { x: 0.5, y: 0.5 };
      this._param = param;
      this._startPosition = {
        x: Number(param.startX),
        y: Number(param.startY),
      };
      this._targetPosition = {
        x: Number(param.targetX),
        y: Number(param.targetY),
      };
      this._startScale = {
        x: Number(param.startScale) / 100.0,
        y: Number(param.startScale) / 100.0,
      };
      this._targetScale = {
        x: Number(param.targetScale) / 100,
        y: Number(param.targetScale) / 100,
      };
      this._rndPosition = rndPosition;
      this._startOpacity = Number(param.startOpacity);
      this._targetOpacity = Number(param.targetOpacity);
      this.bitmap = ImageManager.loadNormalBitmap(param.name + ".png");

      // NOTE: 開始時までdurationは0にする
      this._duration = 0;
      this._time = time;
      this._loopTime = loopTime;
    }

    update() {
      // super();
      if (this._time < this._duration) {
        this._time++;
        this.x = this.updateEasing(this._easingX);
        this.y = this.updateEasing(this._easingY);
        var scaleTemp = this.updateEasing(this._easingScale);
        this.scale = { x: scaleTemp, y: scaleTemp };
        this.opacity = this.updateEasing(this._easingOpacity);
        if (this._time >= this._duration) {
          this._loopTime++;
          this._duration = 0;
          this._time = 0;
          this.endEase();
        }
      }
    }

    updateEasing(easing) {
      if (jQueryEasing[easing.f]) {
        return jQueryEasing[easing.f](
          this._time,
          easing.b,
          easing.c,
          this._duration
        );
      } else {
        return jQueryEasing.linear(
          this._time,
          easing.b,
          easing.c,
          this._duration
        );
      }
    }

    startEase(resetFlg = true) {
      // 回数をリセットする
      if (resetFlg) {
        this._loopTime = 0;
      }
      if (this._param.rndOnLoop === "true") {
        this._rndPosition = {
          x: (Math.random() * 100 * Number(this._param.rndX)) / 100,
          y: (Math.random() * 100 * Number(this._param.rndY)) / 100,
        };
      }
      this.visible = true;
      this._duration = this._param.duration;
      this.x = this._startPosition.x + this._rndPosition.x;
      this.y = this._startPosition.y + this._rndPosition.y;
      this.scale = this._startScale;
      this.opacity = this._startOpacity;
      this._easingX = {
        f: this._param.easingType,
        b: this.x,
        c: this._targetPosition.x - this.x,
      };
      this._easingY = {
        f: this._param.easingType,
        b: this.y,
        c: this._targetPosition.y - this.y,
      };
      this._easingScale = {
        f: this._param.easingType,
        b: this.scale.x,
        c: this._targetScale.x - this.scale.x,
      };

      // 透明度のスケーリング
      this._easingOpacity = {
        f: this._param.easingOpacityType,
        b: this.opacity,
        c: this._targetOpacity - this.opacity,
      };
    }

    endEase() {
      if (this._loopTime < this._param.loops || this._param.loops == 0) {
        this.startEase(false);
      } else {
        this.visible = false;

        $gameTemp._onmtpManager.remove(this);
      }
    }
  }

  class OnomatopoeiaManager {
    constructor() {
      this._mapId = -1;
      this._storeData = {};
    }

    add(number) {
      var scene = SceneManager._scene;
      var param = JSON.parse(PRESETS[number]);
      var onomatopoeia = new Sprite_Onomatopoeia(param);
      onomatopoeia.startEase();
      scene.addChild(onomatopoeia);

      if (this._storeData[number] === undefined) {
        this._storeData[number] = [];
      }
      this._storeData[number].push(onomatopoeia);
    }

    remove(onomatopoeia) {
      var scene = SceneManager._scene;
      scene.removeChild(onomatopoeia);
      // delete this._storeData
    }

    removePreset(number) {
      var currentScene = SceneManager._scene;
      Object.keys(this._storeData).forEach((key) => {
        this._storeData[key].forEach((data) => {
          currentScene.removeChild(data);
        });
      });
      delete this._storeData[number];
    }

    // 復元する
    restore() {
      var currentScene = SceneManager._scene;
      var previousScene = SceneManager._previousClass;
      if (PARAMS["Scenes"].includes(previousScene.name)) {
        Object.keys(this._storeData).forEach((key) => {
          this._storeData[key].forEach((data) => {
            currentScene.addChild(data);
          });
        });
      }
    }
  }
})(
  /* ============================================================
   * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
   *
   * Open source under the BSD License.
   *
   * Copyright © 2008 George McGinley Smith
   * All rights reserved.
   * https://raw.github.com/danro/jquery-easing/master/LICENSE
   * ======================================================== */

  {
    // t: current time, b: begInnIng value, c: change In value, d: duration
    linear: function (t, b, c, d) {
      return c * (t / d) + b;
    },
    easeInQuad: function (t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function (t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function (t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function (t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function (t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function (t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function (t, b, c, d) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function (t, b, c, d) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOutSine: function (t, b, c, d) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
    easeInExpo: function (t, b, c, d) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function (t, b, c, d) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOutExpo: function (t, b, c, d) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function (t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function (t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (c == 0 || t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      );
    },
    easeOutElastic: function (t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (c == 0 || t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      );
    },
    easeInOutElastic: function (t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (c == 0 || t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (!p) p = d * (0.3 * 1.5);
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        );
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      );
    },
    easeInBack: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function (t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      if ((t /= d / 2) < 1)
        return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function (t, b, c, d) {
      return c - this.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function (t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    },
    easeInOutBounce: function (t, b, c, d) {
      if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
      return this.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
  }
);

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
