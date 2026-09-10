//=============================================================================
// OnttlQE.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc タイトル強制スキップ
 * @author Onmoremind
 *
 * @help タイトル強制ニューゲーム処理
 */

(function() {
    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        this.commandNewGame(); 
    };

    Scene_Title.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
        this._commandWindow.close(); 
    };
})();
