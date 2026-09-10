/*:
 * @plugindesc Hiển thị thêm một dòng chữ có thể click được trên màn hình tiêu đề RPG Maker MV. 
 * @author GPT
 *
 * @param Extra Text
 * @type string
 * @desc Dòng chữ muốn hiển thị ở Title
 * @default Translate by: H-Game18.xyz
 *
 * @param Font Size
 * @type number
 * @min 12
 * @max 72
 * @default 20
 * @desc Cỡ chữ
 *
 * @param Text Color
 * @type string
 * @default #FFFFFF
 * @desc Màu chữ (dùng mã HEX, ví dụ: #FF0000 cho màu đỏ)
 *
 * @param Position
 * @type select
 * @option Bottom-Left
 * @option Bottom-Center
 * @option Bottom-Right
 * @default Bottom-Center
 * @desc Vị trí hiển thị ở màn hình Title
 *
 * @param Website URL
 * @type string
 * @default https://h-game18.xyz
 * @desc Trang web sẽ mở khi click vào dòng chữ
 *
 * @help
 * Plugin này sẽ thêm một dòng chữ vào Title Screen:
 * - Có thể click chuột (hoặc chạm trên mobile) để mở website.
 * - Tùy chỉnh text, màu, vị trí.
 */

(function() {
    var params = PluginManager.parameters('TitleExtraText');
    var extraText = String(params['Extra Text'] || 'Translate by: H-Game18.xyz');
    var fontSize  = Number(params['Font Size'] || 20);
    var textColor = String(params['Text Color'] || '#FFFFFF');
    var position  = String(params['Position'] || 'Bottom-Center');
    var website   = String(params['Website URL'] || 'https://h-game18.xyz');

    var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        _Scene_Title_createForeground.call(this);

        this._extraTextSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        var bmp = this._extraTextSprite.bitmap;
        bmp.fontSize = fontSize;
        bmp.textColor = textColor;
        bmp.outlineColor = 'rgba(0,0,0,0.5)';
        bmp.outlineWidth = 4;

        var padding = 20;
        var y = Graphics.height - fontSize - padding;

        if (position === 'Bottom-Left') {
            bmp.drawText(extraText, padding, y, Graphics.width / 3, fontSize + 10, 'left');
            this._extraTextRect = new Rectangle(padding, y, Graphics.width / 3, fontSize + 10);
        } else if (position === 'Bottom-Center') {
            bmp.drawText(extraText, 0, y, Graphics.width, fontSize + 10, 'center');
            this._extraTextRect = new Rectangle(0, y, Graphics.width, fontSize + 10);
        } else if (position === 'Bottom-Right') {
            bmp.drawText(extraText, -padding, y, Graphics.width - padding * 2, fontSize + 10, 'right');
            this._extraTextRect = new Rectangle(Graphics.width / 3 * 2, y, Graphics.width / 3, fontSize + 10);
        }

        this.addChild(this._extraTextSprite);
    };

    // Xử lý click chuột hoặc chạm vào dòng chữ
    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.call(this);
        if (TouchInput.isTriggered()) {
            var x = TouchInput.x;
            var y = TouchInput.y;
            if (this._extraTextRect && this._extraTextRect.contains(x, y)) {
                if (Utils.isNwjs()) {
                    const exec = require('child_process').exec;
                    if (process.platform === 'win32') {
                        exec('start ' + website);
                    } else if (process.platform === 'darwin') {
                        exec('open ' + website);
                    } else {
                        exec('xdg-open ' + website);
                    }
                } else {
                    window.open(website, "_blank");
                }
            }
        }
    };

})();
