/**
 *  @file    CustomSaveLoad
 *  @author  moca
 *  @version 1.0.7 2023/10/31
 */

/*:ja
 * @plugindesc v1.0.7 セーブ・ロード画面カスタムプラグイン
 * @author moca
 * @help セーブ時のスクリーンショットを並べて表示するセーブ・ロード画面プラグイン
 * 
 * 下記のプラグインをこのプラグインより上に配置した上でご利用ください。（なくても動作はしますが非常に重くなります）
 * 
 * KMS_AccelerateFileScene.js
 * http://ytomy.sakura.ne.jp/tkool/rpgtech/tech_mv/menu/accelerate_file_scene.html
 * 
 * 
 * セーブデータをロード専用にする以下のプラグインに対応しています。
 * SaveFileLoadOnly.js
 * https://plugin.fungamemake.com/archives/1093
 * 
 * 
 * ## セーブ画面の呼び出し
 * csave
 * 
 * ## ロード画面の呼び出し
 * cload
 * 
 * ## ロード画面の呼び出し（セーブタブへの移動不可）
 * cload only
 * 
 * ## セーブファイルに応じたテキストの表示
 * セーブ・ロード画面の任意の座標にマップ名、変数の内容を表示することができます
 * 制御文字を利用することでセーブファイルごとに違った内容を表示させることができます
 * 変数の内容はそのセーブファイルにセーブされた時点での内容が表示されます
 * 
 * <map>
 *  マップの表示名に置換されます
 * <time>
 *  プレイ時間に置換されます（1.0.1で追加）
 * <変数番号>
 *  変数番号の内容に置換されます
 * <変数の名前>
 *  ツクール上で設定されている変数の名前を元にその内容を表示します
 * <プラグインパラメータで指定した名前>
 *  名前に紐づいた変数番号の内容を表示します
 * \n
 *  改行します
 * 
 * ### 使用例
 * 
 * 例：マップ名の表示
 * マップ名：<map>
 * 
 * 以下の例では変数番号「10」に倒したボスの数が設定されているとします
 * 
 * 例：倒したボスの数を表示（変数番号10の内容を表示）
 * 倒したボスの数：<10>
 * 
 * ツクール上の変数名から変数の内容を呼び出すことも可能です
 * 例：倒したボスの数を表示（変数名）
 * 倒したボスの数：<倒したボスの数>
 * 
 * こちらはおまけですが、プラグインパラメータで指定した名称を元に変数の内容を呼び出すことも可能です
 * 例：倒したボスの数を表示（プラグインパラメータで指定）
 * 倒したボスの数：<bosses>
 * 
 * 例：マップ名と倒したボスの数を改行して表示
 * マップ名：<map>\n倒したボスの数：<10>
 * 
 * ## ApngPicture.jsを利用する場合
 * ApngPicture.jsのgetClass関数に以下を追記してください。
 * 
 * var getClassName = function(object) {
 *      // 追記ここから
        if(object.constructor.name === 'Scene_CustomSaveLoadScreen') {
            return (m => {
                switch(m){
                    case 'save': return 'Scene_Save';
                    case 'load': return 'Scene_Load';
                    default: return currentSceneName;
                }
            })($gameTemp._saveLoadMode);
        // 追記ここまで
 * 
 * 
 * ## バージョン履歴
 * 2023/10/31 1.0.7 ロードファイルを連打した際に何度もセーブファイルを選択できてしまう不具合を修正
 * 2023/10/19 1.0.6 ロード完了後にコモンイベントを実行する機能を追加
 * 2022/11/29 1.0.5 セーブファイルに応じたスイッチ情報を保存し、セーブファイル選択時にセーブファイル毎のスイッチ情報を適用する機能を追加
 *                  （APNGで使用することを想定）
 * 2022/11/17 1.0.4 セーブファイルに応じたテキストの内容を表示する際に正しく表示されないことがある問題を修正
 * 2022/11/02 1.0.3 タブ切り替え時にフレーム画像が表示されない場合がある問題を修正
 * 2022/10/28 1.0.2 フレーム画像が設定されていない場合に読み込みエラーが発生する問題を修正
 *                  フレーム画像をセーブファイルのサイズ以上で表示できるように
 *                  セーブ画面、ロード画面呼び出し用プラグインコマンドを追加
 * 2022/10/28 1.0.1 プレイ時間表示用の制御文字の追加
 *                  セーブファイルに表示されるプレイ時間を非表示にするオプションの追加
 *                  フレーム画像を自動的にリサイズしないように変更
 *                  セーブファイルに表示されるスナップショットに余白を設定できるように
 *                  スナップショットの表示サイズに制限がかかっていた問題を修正
 *                  SavefileLoadOnly.jsプラグインがない場合にエラーが出ていた問題を修正
 * 2022/10/19 1.0.0 初版
 * 
 * 利用規約：
 * プラグイン作者に無断で使用、改変、再配布は不可です。
 * 
 * 
 * 
 * @param SnapScale
 * @desc セーブファイルの画像サイズの倍率(0~100)。値を小さくすると画質が低下します
 * @default 50
 * @min 0
 * @max 100
 * @type number
 * 
 * @param IsCloseOnSave
 * @desc セーブ時に自動的にセーブ画面を閉じるか
 * @default true
 * @type boolean
 * 
 * @param NodataImage
 * @desc セーブファイルが存在しない際の代替画像
 * @default img/pictures/noimage
 * @type file
 * 
 * @param Filename
 * @desc セーブ・ロード画面でのファイル名を設定します
 * @type struct<STFilename>
 * 
 * @param BackImage
 * @desc 背景画像を設定します
 * @type struct<STBackImage>
 * 
 * @param FrameSettings
 * @desc フレーム関連の設定
 * @type struct<STFrameSettings>
 * 
 * @param TabSettings
 * @desc タブ関連の設定
 * @type struct<STTabSettings>
 * 
 * @param VisibleWindowFrame
 * @desc ウィンドウ枠を表示するか
 * @default true
 * @type boolean
 * 
 * @param IsDrawPlayTime
 * @desc プレイ時間をセーブファイルに表示するか。trueで表示します。
 * @default true
 * @type boolean
 * 
 * @param AutoSaveIconIndex
 * @desc オートセーブアイコンのインデックス
 * @default 195
 * @type number
 * 
 * @param SavefileSnapPosition
 * @desc 選択中のセーブファイルのスナップショットを表示する座標（x,y）
 * @default ["850", "72"]
 * @type number[]
 * 
 * @param SavefileSnapSize
 * @desc 選択中のセーブファイルのスナップショットのサイズ（幅、高さ）
 * @default ["200", "150"]
 * @type number[]
 * 
 * @param SavefileOffsetPosition
 * @desc セーブファイルを表示する座標の左上からのオフセット座標（x,y）
 * @default ["0", "0"]
 * @type number[]
 * 
 * @param SavefileAreaSize
 * @desc セーブファイルを表示する範囲（幅、高さ）。大きすぎると画面内からはみ出す可能性があります。
 * @default ["800", "570"]
 * @type number[]
 * 
 * @param SnapPadding
 * @desc セーブファイル毎のスナップショットの余白サイズ。サイズを大きくするとスナップショットのサイズが小さくなります。
 * @default 12
 * @type number
 * 
 * @param SaveVariableText
 * @desc セーブファイルに応じたテキストの内容
 * @default マップ名：<map>\nプレイ時間：<time>
 * @type string
 * 
 * @param SaveVariableInfo
 * @desc セーブ画面で利用する変数の番号と変数名
 * @type struct<VariableInfo>[]
 * 
 * @param SaveTextPosition
 * @desc セーブファイルに応じたテキストの表示座標（x,y）初期値[850, 350]では右下に表示。
 * @default ["850", "350"]
 * @type number[]
 * 
 * @param SaveTextWidth
 * @desc セーブファイルに応じたテキストの横幅。0で幅制限なし
 * @default 0
 * @type number
 * 
 * @param SaveSwitchInfo
 * @desc セーブファイルに応じたスイッチ番号
 * @type number[]
 * 
 * @param OnLoadCommonEvent
 * @desc ロード時完了後に実行するコモンイベント番号
 * @type common_event
 * @default 0
*/

/*~struct~VariableInfo:
 * @param num
 * @type number
 * @desc 変数番号
 * @default 1
 * @min 1
 * 
 * @param name
 * @type string
 * @desc 変数の名前
 */

/*~struct~STFilename:
 * @param Savefile
 * @desc セーブ画面でのファイル名
 * @default ファイル <id>
 * @type string
 * 
 * @param Loadfile
 * @desc ロード画面でのファイル名
 * @default ファイル <id>
 * @type string
 * 
 * @param AutoSavefile
 * @desc オートセーブファイル名
 * @default オートセーブ
 * @type string
 */

/*~struct~STBackImage:
 * @param SaveScreen
 * @desc セーブ画面の背景画像
 * @type file
 * 
 * @param LoadScreen
 * @desc ロード画面の背景画像
 * @type file
 * 
 * @param LoadOnlyScreen
 * @desc セーブ禁止時のロード画面の背景画像
 * @type file
 */

/*~struct~STFrameSettings:
 * @param Image
 * @desc セーブファイル選択中のカーソル画像
 * @type file
 * 
 * @param IsFront
 * @desc フレームをセーブ画像より前面に表示するか
 * @default true
 * @type boolean
 * 
 * @param BlinkSpeed
 * @desc フレームの点滅速度(0~4)
 * @default 4
 * @min 0
 * @max 10
 * @type number
 * 
 * @param BlinkDuration
 * @desc フレームの点滅にかかる時間(0~120)
 * @default 60
 * @min 0
 * @max 120
 * @type number
 * 
 * @param OffsetPosition
 * @desc フレームの表示座標（x,y）
 * @default ["0", "0"]
 * @type number[]
 */

/*~struct~STTabSettings:
 * @param SaveTabName
 * @desc セーブタブの名前を設定します。未入力の場合は名前を表示しません。
 * @default セーブ
 * @type string
 * 
 * @param LoadTabName
 * @desc ロードタブの名前を設定します。未入力の場合は名前を表示しません。
 * @default ロード
 * @type string
 * 
 * @param TabCursorImage
 * @desc セーブ・ロードタブ選択中のカーソル画像
 * @type file
 */

(function() {
    'use strict';

    const parseVector2Int = param => {
        var array = JSON.parse(param);
        return {x: Number.parseInt(array[0], 10), y: Number.parseInt(array[1], 10)};
    };

    // range function
    const range = (start, end) => [...Array((end - start) + 1)].map((_, i) => start + i);

    // プラグインパラメータ
    const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);
    const VISIBLE_WINDOW_FRAME = PARAMS["VisibleWindowFrame"] === 'true';
    const SNAP_SCALE = Number(PARAMS["SnapScale"]) / 100;
    const NODATA_IMAGE = PARAMS["NodataImage"];
    // セーブ時にセーブシーンを閉じるか
    const IS_CLOSE_ON_SAVE = PARAMS["IsCloseOnSave"] === 'true';
    // ファイル名
    const FILE_NAMES = JSON.parse(PARAMS['Filename']);
    const SAVEFILE_NAME = FILE_NAMES["Savefile"];
    const LOADFILE_NAME = FILE_NAMES["Loadfile"];
    const AUTOSAVE_FILE_NAME = FILE_NAMES["AutoSavefile"];
    // 背景画像
    const BACK_IMAGES = JSON.parse(PARAMS['BackImage']);
    const SAVESCREEN_BACK_IMAGE = BACK_IMAGES["SaveScreen"];
    const LOADSCREEN_BACK_IMAGE = BACK_IMAGES["LoadScreen"];
    const LOADONLYSCREEN_BACK_IMAGE = BACK_IMAGES["LoadOnlyScreen"];
    // フレーム関連
    const FRAME_SETTINGS = (param => {
        return {
            image : param['Image'],
            isFront : param["IsFront"] === 'true',
            blinkSpeed : Number(param["BlinkSpeed"]),
            blinkDuration : Number(param["BlinkDuration"]),
            offset : parseVector2Int(param['OffsetPosition'])
        }
    })(JSON.parse(PARAMS['FrameSettings']));
    // タブ関連
    const TAB_SETTINGS = JSON.parse(PARAMS['TabSettings']);
    const TAB_CURSOR_IMAGE = TAB_SETTINGS["TabCursorImage"];
    const SAVE_TAB_NAME = TAB_SETTINGS['SaveTabName'];
    const LOAD_TAB_NAME = TAB_SETTINGS['LoadTabName'];
    
    const AUTOSAVE_ICON_INDEX = Number(PARAMS["AutoSaveIconIndex"]);
    const SAVEFILE_SNAP_POSITION = parseVector2Int(PARAMS["SavefileSnapPosition"]);
    const SAVEFILE_SNAP_SIZE = parseVector2Int(PARAMS["SavefileSnapSize"]);
    const SAVEFILE_OFFSET_POSITION = parseVector2Int(PARAMS["SavefileOffsetPosition"]);
    const SAVEFILE_AREA_SIZE = parseVector2Int(PARAMS["SavefileAreaSize"]);
    const SAVE_VARIABLE_TEXT = PARAMS["SaveVariableText"];
    const parseSaveVariableInfo = param => {
        var result = new Map();
        if(param !== '') {
            JSON.parse(param, (key, value) => {
                if(key != '') {
                    const v = JSON.parse(value);
                    if(result.has(v.num)) {
                        var r = result.get(v.num);
                        r.add(v.name);
                        result.set(v.num, r);
                    }
                    else {
                        var s = new Set();
                        if (v.name !== '') {
                            s.add(v.name);
                        }
                        result.set(v.num, s);
                    }
                }
            });
        }
        return result;
    };
    const SAVE_VARIABLE_INFO = parseSaveVariableInfo((PARAMS['SaveVariableInfo']));
    const SAVE_TEXT_POSITION = parseVector2Int(PARAMS['SaveTextPosition']);
    const SAVE_TEXT_WIDTH = Number(PARAMS['SaveTextWidth'] || 1280);
    const SAVE_SWITCH_INFO = JSON.parse(PARAMS["SaveSwitchInfo"]).map(x => Number.parseInt(x, 10)) || [];
    const IS_DRAW_PLAYTIME = PARAMS['IsDrawPlayTime'] === 'true';
    const SNAP_PADDING = Number(PARAMS['SnapPadding'] || 12);
    const ONLOAD_COMMON_EVENT = Number(PARAMS['OnLoadCommonEvent'] || 0);

    // プラグインコマンド
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);

        const cmd = command.toLowerCase();
        if(cmd === 'csave') {
            $gameTemp._loadOnly = false;
            $gameTemp._saveLoadMode = 'save';
            $gameTemp._tabNum = -1;
            SceneManager.push(Scene_CustomSaveLoadScreen);
        }
        else if(cmd === 'cload') {
            if(args.length > 0 && args[0].toLowerCase() === 'only') {
                $gameTemp._loadOnly = true;
            }
            else {
                $gameTemp._loadOnly = false;
            }
            $gameTemp._saveLoadMode = 'load';
            $gameTemp._tabNum = -1;
            SceneManager.push(Scene_CustomSaveLoadScreen);
        }
    };

    //#region snapshot
    Bitmap.prototype.toDataURL = function() {
        return this._canvas.toDataURL('image/jpeg');
    };

    const _DataManager_loadSavefileImages = DataManager.loadSavefileImages;
    DataManager.loadSavefileImages = function(info) {
        _DataManager_loadSavefileImages.call(this, info);

        if(info.snapUrl) {
            let hasEncryptedImages = Decrypter.hasEncryptedImages;
            Decrypter.hasEncryptedImages = false;
            ImageManager.loadNormalBitmap(info.snapUrl);
            Decrypter.hasEncryptedImages = hasEncryptedImages;
        }
    };

    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        let info = _DataManager_makeSavefileInfo.call(this);
        const bitmap = this.makeSavefileBitmap();
        if (bitmap) {
            info.snapUrl = bitmap.toDataURL();
        }

        // マップ名（表示名）を保存
        info.mapName = $dataMap.displayName;

        // 変数内容を保存
        let variables = new Map();
        SAVE_VARIABLE_INFO.forEach((value, key) => {
            const _key = Number.parseInt(key);
            var array = Array.from(value);
            const variableName = $dataSystem.variables[_key];
            if(variableName !== '') {
                array.push(variableName);
            }
            const v = $gameVariables.value(_key);
            if(v !== undefined) {
                variables.set(_key, {names: array, value: v});
            }
        });

        info.variables = stringifyMap(variables);

        let switches = new Map();
        // TODO: いい感じにパースしたパラメータに変える
        SAVE_SWITCH_INFO.forEach((v, i) => {
            const _v = Number.parseInt(v);
            if(_v < $dataSystem.switches.length) {
                switches.set(_v, $gameSwitches.value(_v));
            }
        });

        info.switches = stringifyMap(switches);

        return info;
    };

    DataManager.makeSavefileBitmap = function() {
        const bitmap = $gameTemp.getSavefileBitmap();
        if (!bitmap) {
            return null;
        }
        let newBitmap = new Bitmap(bitmap.width * SNAP_SCALE, bitmap.height * SNAP_SCALE);
        newBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newBitmap.width, newBitmap.height);
        return newBitmap;
    };

    //#endregion

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        // セーブファイルのスナップショット一時保存
        this._savefileBitmap = null;
        // セーブ・ロードどちらのモードか
        this._saveLoadMode = 'save';
        // セーブ画面でのカーソル画像
        this._cursorBitmap = null;
        // セーブ・ロード
        this._tabNum = -1;
    }

    Game_Temp.prototype.setSavefileBitmap = function(bitmap) {
        this._savefileBitmap = bitmap;
    };
    
    Game_Temp.prototype.getSavefileBitmap = function() {
        if (this._savefileBitmap) {
            return this._savefileBitmap;
        }
        else {
            return SceneManager.snap();
        }
    };

    const _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        // シーン生成時にセーブ禁止フラグを折る
        $gameTemp._loadOnly = false;
        _Scene_Map_initialize.call(this);
    }

    const _Scene_Map_stop = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function() {
        // シーン破棄前にスナップショットを残す
        $gameTemp.setSavefileBitmap(SceneManager.snap());
        _Scene_Map_stop.call(this);
    }

    //#region 従来のセーブ、ロードシーン読み込み書き換え
    // const _Scene_Menu_commandSave = Scene_Menu.prototype.commandSave;
    Scene_Menu.prototype.commandSave = function() {
        $gameTemp._saveLoadMode = 'save';
        $gameTemp._tabNum = -1;
        SceneManager.push(Scene_CustomSaveLoadScreen);
    };

    Scene_Title.prototype.commandContinue = function() {
        this._commandWindow.close();
        $gameTemp._loadOnly = true;
        $gameTemp._saveLoadMode = 'load';
        $gameTemp._tabNum = -1;
        SceneManager.push(Scene_CustomSaveLoadScreen);
    };

    //#region 補助関数

    /**
     * MapをJSON文字列に変換
     * @param {Map} map 
     * @returns 
     */
    function stringifyMap(map) {
        return JSON.stringify(map, (k, v) => {
            if (v instanceof Map) {
                return {
                    dataType: "Map",
                    value: [...v]
                }
            }
            return v
        });
    };

    /**
     * JSON文字列をMapに変換
     * @param {string} json 
     * @returns 
     */
    function parseToMap(json) {
        return JSON.parse(json, (k, v) => {
            if (typeof v === "object" && v !== null) {
                if (v.dataType === "Map") {
                    return new Map(v.value)
                }
            }
            return v
        });
    };

    //#endregion


    //#endregion

    /**
     * 専用セーブシーン
     */
    class Scene_CustomSaveLoadScreen extends Scene_MenuBase {
        constructor() {
            super();

            this._mode = $gameTemp._saveLoadMode;
            this._listWindow = null;
            this._tabWindow = null;

            // NOTE: カーソル画像のプリロード
            this._frameCursorBitmap = null;
            if(FRAME_SETTINGS.image !== '') {
                this._frameCursorBitmap = ImageManager.loadNormalBitmap(FRAME_SETTINGS.image + '.png');
            }
            this._tabCursorBitmap = null;
            if(TAB_CURSOR_IMAGE !== '') {
                this._tabCursorBitmap = ImageManager.loadNormalBitmap(TAB_CURSOR_IMAGE + '.png');
            }
        }

        create() {
            super.create();
            DataManager.loadAllSavefileImages();
            this.createHelpWindow();
            this.createTabWindow();
            this.createListWindow();
        }

        start() {
            super.start();
            this._listWindow.refresh();
        }

        get savefileId() {
            return this._listWindow.index() + 1;
        }

        get activateListWindow() {
            return this._listWindow.activate();
        }

        /**
         * セーブ、ロードモードを返す
         * @returns 
         */
        get mode() {
            return this._mode;
        }

        set mode(value) {
            this._mode = value;
            this.onModeChange();
        }

        createHelpWindow() {
            this._helpWindow = new Window_CironishHelp(1);
            this._helpWindow.setText(this.helpWindowText);

            this.addWindow(this._helpWindow);
        }

        createTabWindow() {
            const x = 0;
            const y = this._helpWindow.height;

            // タブ用ウィンドウの作成
            this._tabWindow = new Window_CustomSaveLoadTabWindow(x, y, this._tabCursorBitmap);
            if($gameSwitches.value(700) == true){
			this._tabWindow.setHandler('reload', this.onReloadScene.bind(this));}
            this._tabWindow.setHandler('cancel', this.popScene.bind(this));
            if($gameTemp._tabNum !== -1) {
                this._tabWindow.deactivate();
            }
            this._tabWindow.refresh();
            this.addWindow(this._tabWindow);
        }

        createListWindow() {
            var x = 0;
            var y = this._helpWindow.height + this._tabWindow.height;
            var width = Graphics.boxWidth;
            var height = Graphics.boxHeight - y;
            this._listWindow = new Window_CustomSaveLoadSavefileList(x, y, width, height, this._frameCursorBitmap);
            this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
            this._listWindow.setHandler('cancel', this.popScene.bind(this));
            this._listWindow.setTopRow(this.firstSavefileIndex - 2);
            this._listWindow.setMode(this.mode);
            if($gameTemp._tabNum === -1) {
                const index = Math.min(this._listWindow.maxItems(), this.firstSavefileIndex);
                this._listWindow.select(index);
                this._listWindow.activate();
            }
            this._listWindow.refresh();
            this.addWindow(this._listWindow);
        }

        /**
         * セーブ、ロード画面の背景書き換え
         * @override
         */
        createBackground() {
            super.createBackground();
            const bitmap = (mode => {
                switch(mode) {
                    case 'save': if(SAVESCREEN_BACK_IMAGE !== '') return ImageManager.loadNormalBitmap(SAVESCREEN_BACK_IMAGE + '.png');
                    case 'load':
                        if($gameTemp._loadOnly && LOADONLYSCREEN_BACK_IMAGE !== ''){
                            return ImageManager.loadNormalBitmap(LOADONLYSCREEN_BACK_IMAGE + '.png');
                        }
                        else if(LOADSCREEN_BACK_IMAGE !== ''){
                            return ImageManager.loadNormalBitmap(LOADSCREEN_BACK_IMAGE + '.png');
                        }
                    default: return null;
                }
            })(this.mode);
            if(bitmap !== null) {
                this._backgroundSprite.bitmap = bitmap;
            }
        }

        /**
         * ヘルプテキストを返す
         * @override
         */
        get helpWindowText() {
            switch(this.mode){
                case 'save': return TextManager.saveMessage;
                case 'load': return TextManager.loadMessage;
                default: return '';
            }
        }
        
        get firstSavefileIndex() {
            switch(this.mode){
                case 'save': return DataManager.lastAccessedSavefileId() - 1;
                case 'load': return DataManager.latestSavefileId() - 1;
                default : return 0;
            }
        }

        /**
         * @returns 
         */
        onSavefileOk() {
            // super.onSavefileOk();
            switch(this.mode){
                case 'save':
                    this._listWindow.restoreSwitches();
                    $gameSystem.onBeforeSave();
                    if (DataManager.saveGame(this.savefileId)) {
                        this.onSaveSuccess();
                    } else {
                        this.onSaveFailure();
                    }
                    break;
                case 'load':
                    if(this._loadSuccess !== true) {
                        if (DataManager.loadGame(this.savefileId)) {
                            this.onLoadSuccess();
                        } else {
                            this.onLoadFailure();
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        onModeChange() {
            this._listWindow.setMode(this.mode);
            this._helpWindow.setText(this.helpWindowText);
        }

        //#region Save
        onSaveSuccess() {
            SoundManager.playSave();
            StorageManager.cleanBackup(this.savefileId);
            if(IS_CLOSE_ON_SAVE) {
                this.popScene();
            }
            else {
                this.onReloadScene();
            }
        }

        onSaveFailure() {
            SoundManager.playBuzzer();
            this.activateListWindow;
        }
        //#endregion

        //#region Load
        onLoadSuccess() {
            if(ONLOAD_COMMON_EVENT > 0) {
                $gameTemp.reserveCommonEvent(ONLOAD_COMMON_EVENT);
            }
            SoundManager.playLoad();
            this.fadeOutAll();
            this.reloadMapIfUpdated();
            SceneManager.goto(Scene_Map);
            this._loadSuccess = true;
        }

        onLoadFailure() {
            SoundManager.playBuzzer();
            this.activateListWindow;
        }

        reloadMapIfUpdated() {
            if ($gameSystem.versionId() !== $dataSystem.versionId) {
                $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
                $gamePlayer.requestMapReload();
            }
        }
        //#endregion

        onReloadScene() {
            this._listWindow.restoreSwitches();
            $gameTemp._tabNum = this._tabWindow.index();
            $gameTemp._saveLoadMode = (t => {
                switch(t){
                    case 0: return 'save';
                    case 1: return 'load';
                    default: return 'save';
                }
            })($gameTemp._tabNum);
            
            SceneManager.goto(Scene_CustomSaveLoadScreen);
        }
    };

    /**
     * フレーム非表示用ヘルプウィンドウ
     */
    class Window_CironishHelp extends Window_Help {
        constructor(numLines) {
            super(numLines);
        }

        _refreshAllParts() {
            if(VISIBLE_WINDOW_FRAME === false) {
                this._refreshContents();
                this._refreshCursor();
            }
            else {
                super._refreshAllParts();
            }
        }
    };

    /**
     * タブ選択用ウィンドウ
     */
    class Window_CustomSaveLoadTabWindow extends Window_HorzCommand {
        constructor(x, y, cursorBitmap = null) {
            super(x, y);

            this._cursorBitmap = cursorBitmap;
            this._windowCursorSprite.bitmap = this._cursorBitmap;
            this.select($gameTemp._tabNum);
            this._baseIndex = $gameTemp._tabNum;
        }
        
        windowWidth() {
            return Graphics.boxWidth;
        }

        makeCommandList() {
            this.addCommand(SAVE_TAB_NAME, 'save');
            this.addCommand(LOAD_TAB_NAME, 'load');
        }

        /**
         * @override
         */
        update() {
            super.update();

            const _i = this.index();
            // 項目が変更されていたら項目を選択した時と同様の処理を行なう
            if(this._baseIndex !== _i) {
                $gameTemp._tabNum = _i;
                this.callHandler('reload');
                this._baseIndex = _i;
            }

            // タブが選択されている時のみアクティブにする
            if($gameTemp._tabNum !== -1) {
                this.activate();
                if(_i !== $gameTemp._tabNum) {
                    this.select($gameTemp._tabNum);
                    this._baseIndex = $gameTemp._tabNum;
                }
            }
            else {
                this.deactivate();
            }
        }

        /**
         * @override
         * @param {*} wrap 
         */
        cursorDown(wrap) {
            super.cursorDown(wrap);
            $gameTemp._tabNum = -1;
            SoundManager.playCursor();
            this.deactivate();
        }

        /**
         * @override
         * @param {*} wrap 
         */
        cursorRight(wrap) {
            if($gameTemp._loadOnly !== true) {
                super.cursorRight(wrap);
            }
        }

        /**
         * @override
         * @param {*} wrap 
         */
        cursorLeft(wrap) {
            if($gameTemp._loadOnly !== true) {
                super.cursorLeft(wrap);
            }
        }

        /**
         * ウィンドウパーツの描画抑制
         * NOTE: 全パーツ描画のみ抑制しているため個別の描画は通るので注意
         * @override
         */
        _refreshAllParts() {
            if(VISIBLE_WINDOW_FRAME === false) {
                this._refreshContents();
                this._refreshCursor();
            }
            else {
                super._refreshAllParts();
            }
        }

        /**
         * カーソルの画像化
         */
        _refreshCursor() {
            if(FRAME_SETTINGS.image === '') {
                super._refreshCursor();
                return;
            }
            if(this.isOpenAndActive()) {
                if(!this._cursorBitmap) {
                    return;
                }
            }

            var pad = this._padding;
            var x = this.itemWidth() * this.index() + pad;
            var y = pad;

            this._windowCursorSprite.move(x, y);
        }

        /**
         * タッチのみ非アクティブでも処理する
         * @override
         */
        processTouch() {
            this.activate();
            var currentIndex = this.index();
            // TODO: セーブ・ロード以外に項目を追加する場合は変更する必要がある
            if($gameTemp._loadOnly === true && currentIndex !== 0) {
                this.deactivate();
            }
            super.processTouch();
            if(currentIndex !== this.index()) {
                $gameTemp._tabNum = this.index();
            }
            else {
                this.deactivate();
            }
        }
    }


    class Window_CustomSaveLoadSavefileList extends Window_SavefileList {
        constructor(x, y, width, height, cursorBitmap = null, maxCols = 3, maxItems = 9) {
            super(x, y, width, height);

            this._maxCols = maxCols;
            this._maxItems = maxItems;
            this._loadOnlyCount = 0;
            if('isLoadOnly' in this) {
                range(0, maxItems - 1).forEach((v, i) => {
                    if(this.isLoadOnly(i)) {
                        this._loadOnlyCount++;
                    }
                });
            }

            this._lastSelectIndex = -1;
            this._noImageBitmap = ImageManager.loadNormalBitmap(NODATA_IMAGE + '.png');
            this._windowCursorSprite.bitmap = cursorBitmap;
            if(FRAME_SETTINGS.isFront) {
                this.swapChildren(this._windowCursorSprite, this._windowContentsSprite);
            }

            // ディープコピー
            this._switches = JSON.parse(JSON.stringify($gameSwitches._data));
        }

        /**
         * @override
         * @returns 
         */
        maxCols() {
            return this._maxCols;
        }

        /**
         * @override
         * @returns 
         */
        itemWidth() {
            return Math.floor(SAVEFILE_AREA_SIZE.x / this._maxCols) - this.spacing();
        }

        /**
         * @override
         * @returns 
         */
        itemHeight() {
            return Math.floor(SAVEFILE_AREA_SIZE.y / this._maxCols) - this.spacing();
        }

        /**
         * @override
         * @returns 
         */
        maxItems() {
            return this._maxItems;
        }

        /**
         * @override
         * @returns 
         */
        maxVisibleItems() {
            return this._maxItems / this._maxCols;
        }

        get snapImagePadding() {
            return SNAP_PADDING;
        }

        /**
         * @override
         * @param {*} wrap 
         */
        cursorUp(wrap) {
            var index = this.index();
            var maxItems = this.maxItems();
            var maxCols = this.maxCols();
            if (index >= maxCols || (wrap && maxCols === 1)) {
                this.select((index - maxCols + maxItems) % maxItems);
            }
            else {
                // カーソルをタブバーに移動する
                $gameTemp._tabNum = (t => {
                    switch(t){
                        case 'save': return 0;
                        case 'load': return 1;
                        default: return -1;
                    }
                })($gameTemp._saveLoadMode);
                this.deselect();
                SoundManager.playCursor();
            }
        }

        /**
         * タッチのみ非アクティブでも処理する
         * @override
         */
        processTouch() {
            this.activate();
            const currentIndex = this.index();
            super.processTouch();
            if(currentIndex !== this.index()) {
                $gameTemp._tabNum = -1;
            }
            else {
                this.deactivate();
            }
        }

        /**
         * @override
         * @param {number} index 
         * @returns 
         */
        itemRect(index) {
            var rect = super.itemRect(index);
            // var rect = new Rectangle();
            // var maxCols = this.maxCols();
            // rect.width = this.itemWidth();
            // rect.height = this.itemHeight();
            // let h = this.spacing();
            // let v = this.spacing();
            // rect.x = index % maxCols * (rect.width + h) - this._scrollX;
            // rect.y = Math.floor(index / maxCols) * (rect.height) - this._scrollY;
            rect.x += SAVEFILE_OFFSET_POSITION.x;
            rect.y += SAVEFILE_OFFSET_POSITION.y;

            return rect;
        }

        /**
         * @override
         */
        _createAllParts() {
            super._createAllParts();
            this._windowTextSprite = new Sprite();
            this.addChildAt(this._windowTextSprite, 3);
        }

        /**
         * @override
         */
        update() {
            super.update();

            if($gameTemp._tabNum === -1) {
                this.activate();
                if(this.index() === -1) {
                    this.select(0);
                }
            }
            else {
                this.deactivate();
            }

            const index = this.index();
            if(index !== this._lastSelectIndex) {
                this._refreshAllParts();
                this.drawAllItems();
                this.updateSwitches();
                this.drawSelectSnappedImage(
                    new Rectangle(
                        SAVEFILE_SNAP_POSITION.x,
                        SAVEFILE_SNAP_POSITION.y,
                        SAVEFILE_SNAP_SIZE.x,
                        SAVEFILE_SNAP_SIZE.y
                        ))
                this.drawVariableText(
                    SAVE_TEXT_POSITION.x,
                    SAVE_TEXT_POSITION.y,
                    SAVE_TEXT_WIDTH
                    )
                this._lastSelectIndex = index;
            }
        }

        /**
         * スイッチの一時的更新
         */
        updateSwitches() {
            const index = this.index();
            const id = index + 1;
            const info = DataManager.loadSavefileInfo(id);

            if(info === null) {
                return;
            }

            const switchMap = parseToMap(info.switches);
            switchMap.forEach((k, v) => {
                $gameSwitches.setValue(v, k);
            });
        }

        /**
         * スイッチの状態を元に戻す
         */
        restoreSwitches() {
            $gameSwitches._data = this._switches;
        }

        /**
         * @override
         * @param {number} index 
         */
        drawItem(index) {
            const id = index + 1;
            const info = DataManager.loadSavefileInfo(id);
            const valid = DataManager.isThisGameFile(id);
            const rect = this.itemRectForText(index);
            this.drawSnappedImage(info, rect, valid);

            super.drawItem(index);
        }

        /**
         * @override
         * @param {string} text 
         * @param {number} x 
         * @param {number} y 
         * @param {number} maxWidth 
         * @param {string} align 
         */
        drawText(text, x, y, maxWidth, align) {
            this._windowTextSprite.bitmap.drawText(text, x, y, maxWidth, this.lineHeight(), align);
        }

        /**
         * @override
         * @param {number} iconIndex 
         * @param {number} x 
         * @param {number} y 
         */
        drawIcon(iconIndex, x, y) {
            var bitmap = ImageManager.loadSystem('IconSet');
            var pw = Window_Base._iconWidth;
            var ph = Window_Base._iconHeight;
            var sx = iconIndex % 16 * pw;
            var sy = Math.floor(iconIndex / 16) * ph;
            this._windowTextSprite.bitmap.blt(bitmap, sx, sy, pw, ph, x, y);
        }

        /**
         * セーブファイルの項目名の書き換え
         * @override
         * @param {number} id 
         * @param {number} x 
         * @param {number} y 
         */
        drawFileId(id, x, y) {
            const valid = 'isLoadOnly' in this;
            let filename;
            switch(this._mode) {
                case 'save':
                    filename = SAVEFILE_NAME;
                    if(valid) {
                        this.changePaintOpacity(!this.isLoadOnly(id));
                    }
                    else {
                        this.changePaintOpacity(DataManager.isThisGameFile(id));
                    }
                    break;
                case 'load':
                    filename = LOADFILE_NAME;
                    this.changePaintOpacity(DataManager.isThisGameFile(id));
                    break;
                default:
                    filename = TextManager.file;
                    break;
            }

            if(valid && this.isLoadOnly(id)) {
                this.drawText(AUTOSAVE_FILE_NAME, x, y, 180);
                this.drawIcon(AUTOSAVE_ICON_INDEX, x + 212 - Window_Base._iconWidth, y + 2);
            }
            else {
                // NOTE: rpg_window.js 2837行目
                const re_id = /<id>/gi;
                filename = filename.replace(re_id, id - this._loadOnlyCount);
                this.drawText(filename, x, y, 180);
            }
        }

        /**
         * @override
         * @param {Object} info 
         * @param {number} x 
         * @param {number} y 
         * @param {number} width 
         */
        drawPlaytime(info, x, y, width) {
            if(IS_DRAW_PLAYTIME !== true) {
                return;
            }

            super.drawPlaytime(info, x, y, width);
        }

        /**
         * 選択中のセーブファイルの画像を表示する
         * @param {Rectangle} rect 
         * @returns 
         */
        drawSelectSnappedImage(rect) {
            const index = this.index();
            const id = index + 1;
            const info = DataManager.loadSavefileInfo(id);
            const valid = DataManager.isThisGameFile(id);
            const bitmap = this._loadBitmapOrDefault(info, valid);

            var dh = rect.height;
            var dw = bitmap.width * dh / bitmap.height;
            var dx = rect.x + Math.max(rect.width - dw - 80, 0);
            var dy = rect.y;

            this.changePaintOpacity(true);
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, dw, dh);
        }

        /**
         * 変数テキストの表示
         * @param {number} x 
         * @param {number} y 
         * @param {number} maxWidth
         */
        drawVariableText(x, y, maxWidth) {
            const index = this.index();
            const id = index + 1;
            const info = DataManager.loadSavefileInfo(id);
            const valid = DataManager.isThisGameFile(id);

            if(info === null) {
                return;
            }

            if(SAVE_VARIABLE_TEXT === ''){
                return;
            }

            let text = SAVE_VARIABLE_TEXT;
            let re_time = /<time>/gi;
            if (info.playtime) {
                text = text.replace(re_time, info.playtime);
            }

            if('mapName' in info) {
                let re_map = /<map>/gi;
                text = text.replace(re_map, info.mapName);
            }

            if('variables' in info) {
                let re_num = /<(\d+)>/i;
                let variables = parseToMap(info.variables);
                let match;
    
                while((match = re_num.exec(text)) !== null) {
                    let e = Number.parseInt(match[1]);
                    if(variables.has(e)){
                        text = text.replace(`<${e}>`, variables.get(e).value);
                    }
                    else {
                        throw `変数番号 ${e} の内容が保存されていないセーブファイルがあります`;
                        text = text.replace(`<${e}>`, '');
                    }
                }

                // 変数名での検索
                let re_val = /<([^0-9|^><]+)>/gi;
    
                let _text = text;
                while((match = re_val.exec(_text)) !== null) {
                    let e = match[1];
                    for (const [key, value] of variables) {
                        value.names.forEach(name => {
                            if(name === e) {
                                text = text.replace(`<${name}>`, variables.get(key).value);
                            }
                        });
                    }
                }
            }

            // 改行ごとに描画する
            text.split('\\n').forEach((v, i) => {
                this._windowTextSprite.bitmap.drawText(v, x, y + this.lineHeight() * i, maxWidth, this.lineHeight());
            });
        }

        /**
         * 項目に画像を表示する
         * @param {Object} info 
         * @param {Rectangle} rect 
         * @param {boolean} valid 
         * @returns 
         */
        drawSnappedImage(info, rect, valid) {
            var bitmap = this._loadBitmapOrDefault(info, valid);
            let pd = this.snapImagePadding;
            let pdh = Math.floor(pd / 2);
            var dw = this.itemWidth() - pd;
            var dh = this.itemHeight() - pd;
            var dx = rect.x + pdh;
            var dy = rect.y + pdh;

            this.changePaintOpacity(true);
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, dw, dh);
        }

        /**
         * セーブファイルに紐づいた画像の読み込み
         * @param {Object} info 
         * @param {boolean} valid 
         * @returns {Bitmap} セーブファイルに紐づいた画像、なければNODATA画像
         */
        _loadBitmapOrDefault(info, valid) {
            let hasEncryptedImages = Decrypter.hasEncryptedImages;
            Decrypter.hasEncryptedImages = false;
            const bitmap = (() => {
                if (info !== null && (valid && info.snapUrl)) {
                    return ImageManager.loadNormalBitmap(info.snapUrl);
                }
                else {
                    return this._noImageBitmap;
                }
            })();
            Decrypter.hasEncryptedImages = hasEncryptedImages;

            return bitmap;
        }

        /**
         * ウィンドウパーツの描画抑制
         * NOTE: 全パーツ描画のみ抑制しているため個別の描画は通るので注意
         * @override
         */
        _refreshAllParts() {
            if(VISIBLE_WINDOW_FRAME === false) {
                this._refreshContents();
                this._refreshCursor();
            }
            else {
                super._refreshAllParts();
            }
        }

        /**
         * @override
         */
        _refreshContents() {
            super._refreshContents();

            this._windowTextSprite.bitmap = new Bitmap(this._width, this._height);
        }

        /**
         * 読み込んだカーソル画像をリサイズする
         * @param {Bitmap} b 
         */
        _resizeCursorBitmap(b) {
            // 縦横比を維持したままリサイズ
            const dh = this.itemHeight();
            const dw = this.itemWidth();

            let newBitmap = new Bitmap(dw, dh);
            newBitmap.blt(b, 0, 0, b.width, b.height, 0, 0, dw, dh);

            return newBitmap;
        }

        /**
         * カーソルの画像化
         * @override
         */
        _refreshCursor() {
            if(FRAME_SETTINGS.image === '') {
                super._refreshCursor();
                return;
            }

            if(!this._windowCursorSprite.bitmap) {
                return;
            }

            var pad = this._padding;
            var x = this._cursorRect.x + pad - this.origin.x + FRAME_SETTINGS.offset.x;
            var y = this._cursorRect.y + pad - this.origin.y + FRAME_SETTINGS.offset.y;
            // var w2 = Math.min(w, this._width - pad - x2);
            // var h2 = Math.min(h, this._height - pad - y2);

            // this._windowCursorSprite.setFrame(0, 0, this._windowCursorSprite.bitmap.width, this._windowCursorSprite.bitmap.height);
            // this._windowCursorSprite.move(x2, y2);
            this._windowCursorSprite.move(x, y);
        }

        /**
         * カーソルの点滅
         */
        _updateCursor() {
            // NOTE: rpg_core.js 6810行目
            if(FRAME_SETTINGS.blinkSpeed !== 0 && FRAME_SETTINGS.blinkDuration !== 0){
                var blinkCount = this._animationCount % FRAME_SETTINGS.blinkDuration;
                var cursorOpacity = this.contentsOpacity;
                if (this.active) {
                    if (blinkCount < Math.floor(FRAME_SETTINGS.blinkDuration / 2)) {
                        cursorOpacity -= blinkCount * FRAME_SETTINGS.blinkSpeed;
                    } else {
                        cursorOpacity -= (FRAME_SETTINGS.blinkDuration - blinkCount) * FRAME_SETTINGS.blinkSpeed;
                    }
                }
                this._windowCursorSprite.alpha = cursorOpacity / 255;
            }
            this._windowCursorSprite.visible = this.isOpenAndActive();
        }
    };
})();