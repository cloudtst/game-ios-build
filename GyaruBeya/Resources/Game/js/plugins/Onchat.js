//=============================================================================
// Onchat.js
//=============================================================================

/*:
 * @plugindesc スクロール式ログsystem
 * @author Onmoremind
 *
 * @param SwitchID
 * @text 表示スイッチID
 * @type switch
 * @desc チャットログを表示・非表示にするスイッチのID
 * @default 1
 * 
 * @param ScrollSpeed
 * @text スクロール速度
 * @type number
 * @desc テキストがスクロールする速度 (ピクセル/フレーム)
 * @default 2
 *
 * @param WindowX
 * @text ウィンドウのX座標
 * @type number
 * @desc ウィンドウのX座標（ピクセル単位）
 * @default 0
 * 
 * @param WindowY
 * @text ウィンドウのY座標
 * @type number
 * @desc ウィンドウのY座標（ピクセル単位）
 * @default 0
 * 
 * @param WindowWidth
 * @text ウィンドウ幅
 * @type number
 * @desc ウィンドウの幅（ピクセル単位）
 * @default 480
 * 
 * @param WindowHeight
 * @text ウィンドウ高さ
 * @type number
 * @desc ウィンドウの高さ（ピクセル単位）
 * @default 216
 * 
 * @param WindowOpacity
 * @text ウィンドウの透明度
 * @type number
 * @min 0
 * @max 255
 * @desc ウィンドウの透明度を0（完全透明）から255（完全不透明）で指定します
 * @default 255
 *
 * @param FontSize
 * @text フォントサイズ
 * @type number
 * @min 8
 * @desc チャットログのフォントサイズを設定
 * @default 28
 * 
 * @param IconSize
 * @text アイコンサイズ
 * @type number
 * @desc アイコンを表示する際のサイズ (ピクセル)
 * @default 32
 * 
 * @help
 * 【プラグインコマンド一覧】
 * 
 * ■ テキストをウィンドウ左側に流す
 * chatleft [text]
 * 
 * ■ テキストをウィンドウ右側に流す
 * chatright [text]
 * 
 * ■ スクロール速度を変更
 * chatscroll [value]
 *   例）chatscroll 5   // スクロール速度を5に設定
 *
 * ■ ウィンドウサイズや位置、透明度を変更
 * chatsize [width] [height] [x] [y] [opacity]
 *   例）chatsize 600 300 50 400 200
 *       幅600px / 高さ300px / X座標=50 / Y座標=400 / ウィンドウ透明度=200
 *
 * ■ チャットログのリセット（すべてのログをクリア）
 * chatreset
 *
 * 
 * 【デフォルトの制御文字】
 *  \V[n]  : 指定IDの変数の値
 *  \N[n]  : 指定IDのアクター名
 *  \I[n]  : 指定IDのアイコン画像（パラメータでサイズ変更可能）
 *  \C[n]  : 指定IDの文字色に変更
 * 
 * 【本プラグイン独自の制御文字】
 *  \ITEM[n]   : 指定IDのアイテム名
 *  \WEAPON[n] : 指定IDの武器名
 *  \ARMOR[n]  : 指定IDの防具名
 * 
 * 利用規約：
 *  プラグイン作者に無断で使用、改変、再配布は不可。
 */

(function () {
    var parameters = PluginManager.parameters('Onchat');
    var switchId = Number(parameters['SwitchID'] || 1);
    var scrollSpeed = Number(parameters['ScrollSpeed'] || 2);
    var defaultWindowX = Number(parameters['WindowX'] || 0);
    var defaultWindowY = Number(parameters['WindowY'] || 500);
    var defaultWindowWidth = Number(parameters['WindowWidth'] || 480);
    var defaultWindowHeight = Number(parameters['WindowHeight'] || 216);
    var defaultWindowOpacity = Number(parameters['WindowOpacity'] || 255);
    var fontSize = Number(parameters['FontSize'] || 28);
    var iconSize = Number(parameters['IconSize'] || 32);

    var currentWindowX = defaultWindowX;
    var currentWindowY = defaultWindowY;
    var currentWindowWidth = defaultWindowWidth;
    var currentWindowHeight = defaultWindowHeight;
    var currentWindowOpacity = defaultWindowOpacity;

    var chatLog = [];
    var yPositions = [];
    var alignments = [];
    var isScrolling = false;
    var messageQueue = [];
    var scrollComplete = true;
    var accumulatedScroll = 0;
    var wasChatWindowVisible = false;  // ウィンドウの表示状態を追跡

    function Window_ChatLog() {
        this.initialize.apply(this, arguments);
    }

    Window_ChatLog.prototype = Object.create(Window_Base.prototype);
    Window_ChatLog.prototype.constructor = Window_ChatLog;

    Window_ChatLog.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, currentWindowX, currentWindowY, currentWindowWidth, currentWindowHeight);
        this.opacity = currentWindowOpacity;
        this.contentsOpacity = 255;
        this.contents.fontSize = fontSize;
        this.hide();
    };

    Window_ChatLog.prototype.lineHeight = function () {
        return this.contents.fontSize + 6;
    };

    Window_ChatLog.prototype.convertEscapeCharacters = function (text) {
        text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
        text = text.replace(/\x1bITEM\[(\d+)\]/gi, function () {
            var itemId = parseInt(arguments[1]);
            var item = $dataItems[itemId];
            return item ? item.name : '';
        });
        text = text.replace(/\x1bWEAPON\[(\d+)\]/gi, function () {
            var weaponId = parseInt(arguments[1]);
            var weapon = $dataWeapons[weaponId];
            return weapon ? weapon.name : '';
        });
        text = text.replace(/\x1bARMOR\[(\d+)\]/gi, function () {
            var armorId = parseInt(arguments[1]);
            var armor = $dataArmors[armorId];
            return armor ? armor.name : '';
        });
        return text;
    };

    Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = 32;
        var ph = 32;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y, iconSize, iconSize);
    };

    Window_ChatLog.prototype.drawTextWithEscapeCharacters = function (text, x, y) {
        this.resetFontSettings();
        this.contents.fontSize = fontSize;
        var originalText = this.convertEscapeCharacters(text);
        var textState = { index: 0, x: x, y: y, text: originalText };
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
    };

    Window_ChatLog.prototype.processCharacter = function (textState) {
        var c = textState.text[textState.index];
        if (c === '\x1b') {
            this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
        } else {
            this.processNormalCharacter(textState);
        }
    };

    Window_ChatLog.prototype.processNormalCharacter = function (textState) {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);
        this.contents.drawText(c, textState.x, textState.y, w * 2, this.lineHeight());
        textState.x += w;
    };

    Window_ChatLog.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if ($gameSwitches.value(switchId)) {
            if (!this.visible) {
                this.showWindow();
            }
        } else {
            if (this.visible) {
                this.hideWindow();
            }
        }
        if (this.visible && isScrolling) {
            this.clearWindow();
            accumulatedScroll += scrollSpeed;
            scrollComplete = true;
            for (var i = 0; i < chatLog.length; i++) {
                var targetY = this.contentsHeight() - this.lineHeight() * (chatLog.length - i);
                if (yPositions[i] > targetY) {
                    yPositions[i] -= scrollSpeed;
                    scrollComplete = false;
                } else {
                    yPositions[i] = targetY;
                }
                var textX = (alignments[i] === 'right')
                    ? this.contentsWidth() - this.textWidth(chatLog[i])
                    : 0;
                this.drawTextWithEscapeCharacters(chatLog[i], textX, yPositions[i]);
            }
            if (yPositions[0] + this.lineHeight() < 0) {
                chatLog.shift();
                yPositions.shift();
                alignments.shift();
            }
            if (scrollComplete) {
                isScrolling = false;
                this.processQueue();
            }
        }
    };

    Window_ChatLog.prototype.clearWindow = function () {
        this.contents.clear();
    };

    Window_ChatLog.prototype.clearLog = function () {
        chatLog = [];
        yPositions = [];
        alignments = [];
        this.clearWindow();
    };

    Window_ChatLog.prototype.addChatText = function (text, align) {
        text = this.convertEscapeCharacters(text);
        chatLog.push(text);
        alignments.push(align);
        var newY = this.contentsHeight();
        yPositions.push(newY);
        isScrolling = true;
        this.showWindow();
    };

    Window_ChatLog.prototype.queueChatText = function (text, align) {
        messageQueue.push({ text: text, align: align });
        if (!isScrolling) {
            this.processQueue();
        }
    };

    Window_ChatLog.prototype.processQueue = function () {
        if (messageQueue.length > 0) {
            var nextMessage = messageQueue.shift();
            this.addChatText(nextMessage.text, nextMessage.align);
        }
    };

    Window_ChatLog.prototype.showWindow = function () {
        this.show();
        wasChatWindowVisible = true; // 表示状態を追跡
    };

    Window_ChatLog.prototype.hideWindow = function () {
        this.hide();
        wasChatWindowVisible = false; // 非表示状態を追跡
    };

    Window_ChatLog.prototype.redrawLog = function () {
        this.clearWindow();
        for (var i = 0; i < chatLog.length; i++) {
            var textX = (alignments[i] === 'right') ? this.contentsWidth() - this.textWidth(chatLog[i]) : 0;
            this.drawTextWithEscapeCharacters(chatLog[i], textX, yPositions[i]);
        }
    };

    Window_ChatLog.prototype.setWindowSize = function (width, height, x, y, opacity) {
        currentWindowX = x !== undefined ? x : currentWindowX;
        currentWindowY = y !== undefined ? y : currentWindowY;
        currentWindowWidth = width !== undefined ? width : currentWindowWidth;
        currentWindowHeight = height !== undefined ? height : currentWindowHeight;
        currentWindowOpacity = opacity !== undefined ? opacity : currentWindowOpacity;
        this.move(currentWindowX, currentWindowY, currentWindowWidth, currentWindowHeight);
        this.opacity = currentWindowOpacity;
        this.createContents();
        this.clearLog();
    };

    // Scene_Mapでウィンドウを作成する際、表示状態を復元する
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _Scene_Map_createAllWindows.call(this);
        this._chatLogWindow = new Window_ChatLog();
        this.addWindow(this._chatLogWindow);

        // ウィンドウの表示状態を復元
        if (wasChatWindowVisible) {
            this._chatLogWindow.showWindow();
            this._chatLogWindow.redrawLog();  // ログを再描画
        }
    };

    // 場所移動後にウィンドウを再表示して再描画する
    var _Scene_Map_transferPlayer = Scene_Map.prototype.transferPlayer;
    Scene_Map.prototype.transferPlayer = function () {
        wasChatWindowVisible = this._chatLogWindow.visible;  // 場所移動前に表示状態を保存
        _Scene_Map_transferPlayer.call(this);

        // 場所移動後にウィンドウを再表示
        if (wasChatWindowVisible) {
            this._chatLogWindow.showWindow();
            this._chatLogWindow.redrawLog();   // ログを再描画
        }
    };

    // マップ更新時にもウィンドウを再表示
    var _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function () {
        _Scene_Map_updateMain.call(this);

        // ウィンドウが非表示かつフラグが立っていれば再表示
        if (!this._chatLogWindow.visible && wasChatWindowVisible) {
            this._chatLogWindow.showWindow();
            this._chatLogWindow.redrawLog();   // ログを再描画
        }
    };

    // メニューを開いたときの処理
    var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function () {
        wasChatWindowVisible = this._chatLogWindow.visible;  // ウィンドウの状態を保存
        _Scene_Map_callMenu.call(this);
    };

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        if (wasChatWindowVisible) {
            this._chatLogWindow.showWindow();
            this._chatLogWindow.redrawLog();  // メニュー終了後にログを再描画
        }
    };

    // プラグインコマンドの追加
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        // 左側または右側にテキストを追加するコマンド
        if (command === 'chatleft' || command === 'chatright') {
            var text = args.join(' ').replace(/_/g, ' ');
            var align = (command === 'chatleft') ? 'left' : 'right';
            SceneManager._scene._chatLogWindow.queueChatText(text, align);
            SceneManager._scene._chatLogWindow.showWindow();
        }

        // ウィンドウのサイズ変更コマンド
        if (command === 'chatsize') {
            var width = Number(args[0] || currentWindowWidth);
            var height = Number(args[1] || currentWindowHeight);
            var x = Number(args[2] || currentWindowX);
            var y = Number(args[3] || currentWindowY);
            var opacity = args[4] !== undefined ? Number(args[4]) : undefined;
            SceneManager._scene._chatLogWindow.setWindowSize(width, height, x, y, opacity);
        }

        // スクロール速度を変更するコマンド
        if (command === 'chatscroll') {
            var newScrollSpeed = Number(args[0]);
            if (!isNaN(newScrollSpeed) && newScrollSpeed >= 0) {
                scrollSpeed = newScrollSpeed;
                console.log(`スクロール速度が ${scrollSpeed} に設定されました。`);
            } else {
                console.log("無効なスクロール速度が入力されました。正しい数値を入力してください。");
            }
        }

        // ★ログのリセットコマンドを追加
        if (command === 'chatreset') {
            SceneManager._scene._chatLogWindow.clearLog();
        }
    };
})();
