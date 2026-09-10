//============================================================================
// SU_ExpandedPictureSpine.js - Version 1.0.0
//============================================================================
/*:
 * @plugindesc PictureSpine.js の機能を拡張する
 * @author Su
 *
    * @help
    * ============================================================================
    * 概要
    * ============================================================================
    * PictureSpine.js を機能拡張し、プラグインコマンドを追加します。
    * このプラグインは PictureSpine.js のすぐ下に置いてください
    *
    * ピクチャの表示とアニメーション指定を同時に行えるコマンドを追加しています。
    *
    * ============================================================================
    * 開発者向けに
    * ============================================================================
    * Game_Spineクラスにイベント登録・削除を行うメンバ関数を追加しました。
    * アニメーション中のイベント（Spine側で設定するものではなく）に関数を登録することができます。
    * - start
    * - interrupt
    * - dispose
    * - end
    * - complete
    * - event
    *
    * イベントリスナー の登録
    * addEventListener(eventName:string, listener:function, <trackId:number>, <options:object>)
    * イベントリスナー の削除
    * removeEventListener(eventName:string, listener:function, <trackId:number>)
    *
    * ============================================================================
    * プラグインコマンド
    * ============================================================================
    * 値は \v[変数番号] とすることで変数の中身に置き換えることができます。
    *
    * - S_setAnimation [pictureId] [skeletonId] (animation:[trackId]:[animationName] <mix:[mixValue]>)
    *  指定のピクチャ番号のスケルトンにアニメーションをセットします。
    *  指定番号のピクチャが表示されていない場合、ピクチャの表示を同時に行います。
    *  SkeletonId はピクチャの表示を同時に行う場合のみに有効な値で、プラグインパラメータで設定した
    *  リストの行番号と対応しており、該当のスケルトンが表示されます。
    *  値は [ ] で囲った部分です
    *  < > で囲った中身は省略可能
    *   pictureId : ピクチャ番号
    *   skeletonId : プラグインパラメータのスケルトンリスト内の番号
    *   trackId : アニメーションをセットしたいトラック番号
    *   animationName :  セットしたいアニメーション名、「,」でつなぐことで複数指定することができます。
    *                   複数選択した場合は順番にアニメーションが再生され、最後のものが繰り返し表示されます。
    *   mixValue : 手前で指定したアニメーション遷移に対するミックス値
    *   [ ]、< >, ( ) は無視してください。
    *
    * 例）１０番のピクチャに「走る」というアニメーションをトラック番号１に指定する場合
    *   S_setAnimation 10 1 animation:1:走る
    *
    * 例）上記に加え、ミックス値を 0.5 に設定する場合
    *   S_setAnimation 10 1 animation:1:走る mix:0.5
    *
    *  また ( ) で囲っている animation と mix の指定は繰り返し行うことができます
    * 例）上記の例に加え、「狙う」 というアニメーションをトラック番号３にミックス値０．３で指定する場合
    *   S_setAnimation 10 1 animation:1:走る mix:0.5 animation:3:狙う mix:0.3
    *
    * 例）トラック番号に変数１番、アニメーション名に変数２番の値を使用する場合
    *   S_setAnimation 10 1 animation:\v[1]:\v[2]
    *
    *
    * - S_setAnimationR [pictureId] [skeletonId] (animation:[trackId]:[animationName])
    *  指定のピクチャ番号のスケルトンにアニメーションをセットします。
    *  指定番号のピクチャが表示されていない場合、ピクチャの表示を同時に行います。
    *  S_setAnimation との違いは、アニメーションを複数指定した場合、
    *  順次実行ではなく、どれか一つがランダムに選択され、アニメーション終了毎に再選出を繰り返すことです。
    *  アニメーション名の後ろに /%[数字] とすることで、そのアニメーションの選択率を調整することができます。
    *  値は [ ] で囲った部分です
    *  < > で囲った中身は省略可能
    *   pictureId : ピクチャ番号
    *   skeletonId : プラグインパラメータのスケルトンリスト内の番号
    *   trackId : アニメーションをセットしたいトラック番号
    *   animationName :  セットしたいアニメーション名、「,」でつなぐことで複数指定することができます。
    *   [ ]、< >, ( ) は無視してください。
    *
    * 例）「走る」、「歩く」というアニメーションをランダムに再生する場合
    *   S_setAnimation 10 1 animation:1:走る,歩く
    *
    * 例）上記に加え、「走る」の選出率を3倍にする場合
    *   S_setAnimation 10 1 animation:1:走る/%3,歩く
    *
    *
    * - S_setSkin [pictureId] [skeletonId] ([skinName])
    *  指定のピクチャ番号のスケルトンにスキンをセットします。
    *  スキン名は空白を置いて複数指定することができます。
    *  値は [ ] で囲った部分です
    *  ( ) で囲った部分は複数指定することができます。
    *   pictureId : ピクチャ番号
    *   skeletonId : プラグインパラメータのスケルトンリスト内の番号
    *   skinName : スキン名
    *
    * 例）「スーツ」というスキンをセットする場合
    *   S_setSkin 10 1 スーツ
    *
    * 例）「スーツ」と「バッグ」という２つのスキンをセットする場合
    *   S_setSkin 10 1 スーツ バッグ
    * 
    * 保存変数リセットscript
    * 【resetLastAnimationState();】



 * ============================================================================
 * 変更履歴
 * ============================================================================
 * Version 1.0.0 - 2023/07/04
 *  最初のバージョン
 *
 * @param Skeletons
 * @type struct<SpineData>[]
 * @default []
 * @desc ピクチャが表示されていない場合に表示するピクチャ、スケルトンについて設定します
 * @text スケルトン
 */
/*~struct~Initialization:
 * @param PositionX
 * @type number
 * @default 0
 * @text 位置X
 *
 * @param PositionY
 * @type number
 * @default 0
 * @text 位置Y
 *
 * @param ScaleX
 * @type number
 * @default 100
 * @text 拡大率X
 *
 * @param ScaleY
 * @type number
 * @default 100
 * @text 拡大率Y
 */
/*~struct~SpineData:
 * @param Skeleton
 * @type string
 * @text スケルトン名
 *
 * @param Skin
 * @type string[]
 * @text スキン名
 *
 * @param NumInitializeTrack
 * @type number
 * @default 10
 * @desc スケルトンをセットする際に指定個数のトラックを初期化します
 * @text トラック初期化数
 *
 * @param ResetAnimation
 * @type string
 * @default 000
 * @desc 前項の初期化に使用するアニメーション名を設定します
 * @text 初期化用アニメーション
 *
 * @param Mix
 * @type number
 * @decimals 2
 *
 * @param InitialPicSetting
 * @type struct<Initialization>
 * @desc 予めピクチャの表示がされていない場合のピクチャ設定
 * @text ピクチャ初期化設定
 * @default {"PositionX":"0","PositionY":"0","ScaleX":"100","ScaleY":"100"}
 *
 */
/*~struct~Animation:
 * @param Track
 * @ytpe number
 *
 * @param Animation
 * @type string
 */
(() => {
    "use strict";
    //============================================================================
    // パラメータ取得
    //============================================================================
    const parsedParams = (() => {
        var _a, _b;
        // const pluginName = document.currentScript.src.split('/').pop().replace(/\.js$/, '');
        const pluginName = (_b = (_a = document.currentScript.src
            .split("/")
            .pop()) === null || _a === void 0 ? void 0 : _a.replace(/\.js$/, "")) !== null && _b !== void 0 ? _b : "";
        const pluginParams = PluginManager.parameters(pluginName);
        return JSON.parse(JSON.stringify(pluginParams, (key, value) => {
            try {
                return JSON.parse(value);
            }
            catch (e) { }
            return value;
        }));
    })();
    const initSpineData = parsedParams["Skeletons"];
    //============================================================================
    // プラグイン本体
    //============================================================================
    ((_pluginCommand_) => {
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _pluginCommand_.call(this, command, args);
            const com = command.toUpperCase();
            const convArgs = args.map((arg) => convert2Var(arg));
            switch (com) {
                // S_Animation [picId] [skeletonId] [animation:trackId:AnimationName] [mix:value]
                case "S_SETANIMATION":
                    console.log("execute S_Animation");
                    setAnimationExpanded(convArgs);
                    break;
                case "S_SETANIMATIONR":
                    console.log("execute S_AnimationR");
                    setAnimationExpandedRandom(convArgs);
                    break;
                case "S_SETSKIN":
                    console.log("execute S_setSkin");
                    setSkinExpanded(convArgs);
                    break;
            }
        };
    })(Game_Interpreter.prototype.pluginCommand);
    const convert2Var = (text) => {
        return text.replace(/\\v\[(\d+)\]/gi, (match, p1) => $gameVariables.value(Number(p1)).toString());
    };
    ((_init_) => {
        Game_Spine.prototype.init = function () {
            _init_.call(this);
            this.initListeners();
        };
    })(Game_Spine.prototype.init);

    const ensureAnimationState = () => {
        if (!$gameSystem._lastAnimationState) {
            $gameSystem._lastAnimationState = {};
        }
        return $gameSystem._lastAnimationState;
    };

    const resetLastAnimationState = () => {
        if ($gameSystem._lastAnimationState) {
            $gameSystem._lastAnimationState = {};
        }
    };

    window.resetLastAnimationState = resetLastAnimationState;

    const setAnimationExpanded = (args) => {
        const picId = Number(args[0]);
        const spineIndex = Number(args[1]);
        const spineData = initSpineData[spineIndex - 1];

        const key = `pic${picId}_spine${spineIndex}_args${args.slice(2).join("_")}`;
        const stateStore = ensureAnimationState();

       // if (stateStore[key]) {
           // console.log("Skipped redundant S_SETANIMATION");
           // return;
       // }

        stateStore[key] = true;

        for (const k in stateStore) {
            if (k !== key) delete stateStore[k];
        }

        if (!$gameScreen.picture(picId)) {
            if (spineData) showSpine(picId, spineData);
            else return;
        }

        const spine = $gameScreen.spine(picId);
        let track = 0;
        let animation = [];
        const currentTrackList = spine.track;

        for (let i = 2; i < args.length; i++) {
            let options = args[i].split(":");
            switch (options[0]) {
                case "animation":
                    track = Number(options[1]);
                    animation = options[2].split(",");
                    spine.setAnimation(track, animation, "sequential", "continue", true);
                    break;
                case "mix":
                    const value = Number(options[1]);
                    const currentAnimation = (() => {
                        if (!!currentTrackList[track]) {
                            const list = currentTrackList[track].list;
                            return list[list.length - 1].name;
                        }
                        return "";
                    })();
                    const nextAnimation = animation[0];
                    const transition = `${currentAnimation}/${nextAnimation}`;
                    let currentMix = spine.mix[transition] || null;

                    if (currentAnimation) {
                        spine.setMix(currentAnimation, nextAnimation, value);
                        const callback = () => {
                            if (currentMix) spine.mix[transition] = currentMix;
                            spine.removeEventListener("end", callback, track);
                        };
                        spine.addEventListener("end", callback, track);
                    }
                    break;
            }
        }
    };

    const setAnimationExpandedRandom = (args) => {
        const picId = Number(args[0]);
        // args[1] には行番号が渡される
        const spineData = initSpineData[Number(args[1]) - 1];
        // ピクチャが表示されていなければ用意する
        if (!$gameScreen.picture(picId)) {
            if (spineData)
                showSpine(picId, spineData);
            else
                return;
        }
        const spine = $gameScreen.spine(picId);
        let track = 0;
        let animation = [];
        const currentTrackList = spine.track;
        for (let i = 0; i < args.length; i++) {
            let options = args[i].split(":");
            switch (options[0]) {
                case "animation":
                    track = Number(options[1]);
                    animation = options[2].split(",").map((a) => {
                        if (!a.match("/"))
                            return a;
                        return a.replace(/%(\d+)/, "times=$1");
                    });
                    spine.setAnimation(track, animation, "random", "reset", true);
                    break;
            }
        }
    };
    const setSkinExpanded = (args) => {
        const picId = Number(args[0]);
        // args[1] には行番号が渡される
        const spineData = initSpineData[Number(args[1]) - 1];
        if (!$gameScreen.picture(picId))
            return;
        const spine = $gameScreen.spine(picId);
        spine.setSkin(...args.slice(2));
    };
    const showSpine = (picId, spineData) => {
        const initData = spineData["InitialPicSetting"];
        const initPos = {
            x: initData["PositionX"],
            y: initData["PositionY"],
        };
        const initScale = {
            x: initData["ScaleX"],
            y: initData["ScaleY"],
        };
        $gameScreen.showPicture(picId, "", 0, initPos.x, initPos.y, initScale.x, initScale.y, 255, 0);
        const skeleton = spineData["Skeleton"];
        const skin = spineData["Skin"];
        const mix = spineData["Mix"];
        const spine = $gameScreen.spine(picId);
        spine.setSkeleton(skeleton);
        if (skin)
            spine.setSkin(...skin);
        if (mix)
            spine.setMix(mix);
    };
    //============================================================================
    // トラックを指定数初期化
    //============================================================================
    Game_Spine.prototype.initTracks = function () {
        const refData = initSpineData
            .filter((params) => params["Skeleton"] === this.skeleton.split("_")[0])
            .shift();
        if (!refData)
            return;
        const numInitializedTrack = refData["NumInitializeTrack"] || 0;
        this.resetAnimation = refData["ResetAnimation"];
        for (let i = 0; i < numInitializedTrack; i++) {
            this.setAnimation(i, this.resetAnimation, "none");
        }
    };
    // overwrite
    ((_setSkeleton_) => {
        Game_Spine.prototype.setSkeleton = function (name = "") {
            _setSkeleton_.call(this, name);
            this.initTracks();
            return this;
        };
    })(Game_Spine.prototype.setSkeleton);
    //============================================================================
    // イベントを登録できるようにする
    //============================================================================
    Object.defineProperty(Game_Spine, "listeners", {
        get() {
            return [this._globalListener, ...this._trackListeners];
        },
    });
    Game_Spine.prototype.initListeners = function () {
        this._globalListener = {
            start: [],
            interrupt: [],
            dispose: [],
            end: [],
            complete: [],
            event: [],
        };
        this._trackListeners = [];
    };
    /**
     * アニメーション中の各イベント(Spine で設定するイベントとは異なる）が起こった時に呼び出される関数を設定します
     * @param {string} eventName イベント名
     * @param {Function} listener 呼び出される関数
     * @param {number} trackIndex 対象のトラック番号、指定しなければ全てのトラックを対象にする
     * @param {object} options 追加動作を指定する
     */
    Game_Spine.prototype.addEventListener = function (eventName, listener, trackIndex = -1, options = { listener, once: false }) {
        if (trackIndex >= 0) {
            if (!this._trackListeners[trackIndex])
                this._trackListeners[trackIndex] = {
                    start: [],
                    interrupt: [],
                    dispose: [],
                    end: [],
                    complete: [],
                    event: [],
                };
            const track = this._trackListeners[trackIndex];
            track[eventName].push(Object.assign(options, { listener: listener }));
        }
        else
            this._globalListener[eventName].push(Object.assign(options, { listener: listener }));
    };
    /**
     * 登録したイベントを削除します
     * @param {string} eventName イベント名
     * @param {Function} listener 登録した関数
     * @param {number} trackIndex 対象のトラック番号、指定しなければ全てのトラックを対象にする
     */
    Game_Spine.prototype.removeEventListener = function (eventName, listener, trackIndex) {
        const listeners = trackIndex >= 0
            ? this._trackListeners[trackIndex][eventName]
            : this._globalListener[eventName];
        const index = listeners.map((e) => e.listener).indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
    /**
     * イベントに登録された関数を呼び出します
     * @param {string} eventName イベント名
     * @param {number} trackIndex トラック番号
     */
    Game_Spine.prototype.dispatchEventListener = function (eventName, entry) {
        if (!this._globalListener) {
            console.error("Global listener is not initialized.");
            return;
        }

        // entryの存在を安全に確認し、trackIndexを取得
        const trackIndex = (entry && entry.trackIndex !== undefined) ? entry.trackIndex : -1;
        const globalCallbacks = this._globalListener[eventName];
        if (globalCallbacks) {
            globalCallbacks.forEach(function (e) {
                e.listener(entry);
                if (e.once) {
                    this.removeEventListener(eventName, e.listener, trackIndex);
                }
            }, this); // 第二引数に `this` を渡してスコープを正しく設定
        }

        if (trackIndex >= 0 && this._trackListeners[trackIndex]) {
            const trackCallbacks = this._trackListeners[trackIndex][eventName];
            if (trackCallbacks) {
                trackCallbacks.forEach(function (e) {
                    e.listener(entry);
                    if (e.once) {
                        this.removeEventListener(eventName, e.listener, trackIndex);
                    }
                }, this); // 第二引数に `this` を渡してスコープを正しく設定
            }
        }
    };


    // overwrite
    // end と dispose のコメントアウトを外しただけです
    Sprite_Spine.prototype.updateSkeleton = function (spine) {
        if (spine) {
            if (spine.skeleton != this._skeleton) {
                this.init();
                let skeleton = spine.skeleton.replace(/_\d+$/, "");
                if (skeleton) {
                    let fullName = Game_Spine.fullName(skeleton);
                    let data = Game_Spine.spineData()[fullName];
                    if (data) {
                        if ("animations" in data) {
                            this._data = new PIXI.spine.Spine(data);
                            this._data.destroy = function () { };
                            this._data.state.addListener({
                                start: this.onStart.bind(this),
                                interrupt: this.onInterrupt.bind(this),
                                end: this.onEnd.bind(this),
                                dispose: this.onDispose.bind(this),
                                complete: this.onComplete.bind(this),
                                event: this.onEvent.bind(this),
                            });
                            this.addChild(this._data);
                            if (spine.playData.length > 0) {
                                this._isRestore = true;
                            }
                            this.registerCallback(spine);
                            // this.createNames();
                        }
                        else {
                            Game_Spine.loadSkeleton(skeleton);
                        }
                    }
                    else if (fullName in Game_Spine.spineData() == false) {
                        throw Error(`'${skeleton}' is unknown model.`);
                    }
                }
                if (!skeleton || this._data) {
                    this._skeleton = spine.skeleton;
                }
            }
        }
        else if (this._skeleton) {
            this.init();
        }
    };
    ((_onStart_) => {
        Sprite_Spine.prototype.onStart = function (entry) {
            this.spine().dispatchEventListener("start", entry);
            _onStart_.call(this, entry);
        };
    })(Sprite_Spine.prototype.onStart);
    ((_onInterrupt_) => {
        Sprite_Spine.prototype.onInterrupt = function (entry) {
            this.spine().dispatchEventListener("interrupt", entry);
            _onInterrupt_.call(this, entry);
        };
    })(Sprite_Spine.prototype.onInterrupt);
    ((_onEnd_) => {
        Sprite_Spine.prototype.onEnd = function (entry) {
            this.spine().dispatchEventListener("end", entry);
            _onEnd_.call(this, entry);
        };
    })(Sprite_Spine.prototype.onEnd);
    ((_onDispose_) => {
        Sprite_Spine.prototype.onDispose = function (entry) {
            this.spine().dispatchEventListener("dispose", entry);
            _onDispose_.call(this, entry);
        };
    })(Sprite_Spine.prototype.onDispose);
    ((_onComplete_) => {
        Sprite_Spine.prototype.onComplete = function (entry) {
            if (this.spine()) {
                this.spine().dispatchEventListener("complete", entry);
            }
        };

    })(Sprite_Spine.prototype.onComplete);
    ((_onEvent_) => {
        Sprite_Spine.prototype.onEvent = function (entry, event) {
            this.spine().dispatchEventListener("event", entry);
            _onEvent_.call(this, entry, event);
        };
    })(Sprite_Spine.prototype.onEvent);
})();
