/*:
 * @plugindesc Tự động xuống dòng (word wrap) cho RPG Maker MV (có thể bật/tắt riêng cho Message & Choice). 
 * @author GPT
 *
 * @param Enable in Message Window
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Enable in Choice List
 * @type boolean
 * @on YES
 * @off NO
 * @default false
 *
 * @help
 * - Tự động xuống dòng khi text dài quá khung.
 * - Có thể bật/tắt riêng cho Message hoặc Choice.
 * - Hỗ trợ escape codes (\C[x], \N[x], \V[x]...).
 */

(function() {
    var params = PluginManager.parameters('AutoWordWrap');
    var wrapMessage = params['Enable in Message Window'] === 'true';
    var wrapChoice  = params['Enable in Choice List'] === 'true';

    // --- helper: kiểm tra có bật word wrap cho window này không ---
    function isWordWrapEnabled(win) {
        if (win instanceof Window_Message) return wrapMessage;
        if (win instanceof Window_ChoiceList) return wrapChoice;
        return false;
    }

    // --- override drawTextEx ---
    var _Window_Base_drawTextEx = Window_Base.prototype.drawTextEx;
    Window_Base.prototype.drawTextEx = function(text, x, y) {
        if (!text) return 0;
        if (!isWordWrapEnabled(this)) {
            return _Window_Base_drawTextEx.call(this, text, x, y);
        }

        this.resetFontSettings();
        var textState = { index: 0, x: x, y: y, left: x, text: this.convertEscapeCharacters(text) };
        textState.height = this.calcTextHeight(textState, false);

        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    };

    // --- override processNormalCharacter ---
    var _Window_Base_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
    Window_Base.prototype.processNormalCharacter = function(textState) {
        if (isWordWrapEnabled(this)) {
            var c = textState.text[textState.index];
            var w = this.textWidth(c);

            if (textState.x + w > this.contentsWidth()) {
                this.processNewLine(textState);
            }
        }
        _Window_Base_processNormalCharacter.call(this, textState);
    };

})();
