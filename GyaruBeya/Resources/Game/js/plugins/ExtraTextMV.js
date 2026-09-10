/*:
 * @plugindesc Hiển thị dòng chữ cố định trên tất cả các Scene (MV) và click để mở website. 
 * @author GPT
 *
 * @param Extra Text
 * @type string
 * @default Translate by: H-Game18.xyz
 *
 * @param Font Size
 * @type number
 * @default 20
 *
 * @param Text Color
 * @type string
 * @default #FFFFFF
 *
 * @param Position
 * @type select
 * @option Bottom-Left
 * @option Bottom-Center
 * @option Bottom-Right
 * @default Bottom-Center
 *
 * @param Website URL
 * @type string
 * @default https://h-game18.xyz
 *
 * @help
 * - Hiển thị chữ ở tất cả các scene (Title, Map, Menu, Battle, …).
 * - Click vào chữ → mở Website URL.
 */

(function() {
    var params = PluginManager.parameters('ExtraTextMV');
    var extraText = String(params['Extra Text'] || 'Translate by: H-Game18.xyz');
    var fontSize  = Number(params['Font Size'] || 20);
    var textColor = String(params['Text Color'] || '#FFFFFF');
    var position  = String(params['Position'] || 'Bottom-Center');
    var website   = String(params['Website URL'] || 'https://h-game18.xyz');

    function drawOverlay(scene) {
        if (scene._extraTextSprite) {
            scene.removeChild(scene._extraTextSprite);
            scene._extraTextSprite.destroy();
            scene._extraTextSprite = null;
        }

        var w = Graphics.width;
        var h = Graphics.height;
        var sprite = new Sprite(new Bitmap(w, h));
        scene._extraTextSprite = sprite;

        var bmp = sprite.bitmap;
        bmp.fontSize = fontSize;
        bmp.textColor = textColor;
        bmp.outlineColor = 'rgba(0,0,0,0.6)';
        bmp.outlineWidth = 4;

        var padding = 20;
        var lineHeight = Math.round(fontSize * 1.2);
        var y = h - lineHeight - padding;

        if (position === "Bottom-Left") {
            bmp.drawText(extraText, padding, y, w/2, lineHeight, "left");
            scene._extraTextRect = new Rectangle(padding, y, w/2, lineHeight);
        } else if (position === "Bottom-Center") {
            bmp.drawText(extraText, 0, y, w, lineHeight, "center");
            scene._extraTextRect = new Rectangle(0, y, w, lineHeight);
        } else { // Right
            bmp.drawText(extraText, 0, y, w - padding, lineHeight, "right");
            scene._extraTextRect = new Rectangle(w/2, y, w/2, lineHeight);
        }

        scene.addChild(sprite);
    }

    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        drawOverlay(this);
    };

    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        if (TouchInput.isTriggered() && this._extraTextRect) {
            var x = TouchInput.x, y = TouchInput.y;
            if (this._extraTextRect.contains(x, y)) {
                if (Utils.isNwjs()) {
                    const exec = require('child_process').exec;
                    if (process.platform === 'win32') exec('start ' + website);
                    else if (process.platform === 'darwin') exec('open ' + website);
                    else exec('xdg-open ' + website);
                } else {
                    window.open(website, "_blank");
                }
            }
        }
    };

    var _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        if (this._extraTextSprite) {
            this.removeChild(this._extraTextSprite);
            this._extraTextSprite.destroy();
            this._extraTextSprite = null;
            this._extraTextRect = null;
        }
        _Scene_Base_terminate.call(this);
    };
})();
