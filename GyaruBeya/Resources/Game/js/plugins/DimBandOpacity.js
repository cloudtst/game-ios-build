/*:
 * @target MV
 * @plugindesc 「暗くする」の黒帯を画面横断＋上下グラデで描画（innerHeight非依存版）
 * @author スミ
 *
 * @param Opacity
 * @type number
 * @min 0
 * @max 255
 * @desc 帯の中心の濃さ(0〜255)
 * @default 240
 *
 * @param EdgeSize
 * @type number
 * @min 0
 * @max 256
 * @desc 上下のぼかし幅(px)
 * @default 24
 *
 * @param MarginY
 * @type number
 * @min 0
 * @max 128
 * @desc 文字領域から上下に広げる余白(px)
 * @default 8
 *
 * @param FollowOpenness
 * @type boolean
 * @on ウィンドウ開閉に追従
 * @off 常に最大不透明
 * @default true
 *
 * @help メッセージ背景「暗くする」時だけ、黒帯を画面左右いっぱいに描きます。
 * 既定のディマーは無効化します。メッセージ系プラグインの最後尾に置いてください。
 */
(() => {
  const PLUGIN = 'WideDimBand';
  const p = PluginManager.parameters(PLUGIN);
  const OPACITY = Math.max(0, Math.min(255, Number(p.Opacity || 240)));
  const EDGE = Math.max(0, Number(p.EdgeSize || 24));
  const MARGIN = Math.max(0, Number(p.MarginY || 8));
  const FOLLOW = String(p.FollowOpenness || 'true') === 'true';

  const colorO = `rgba(0,0,0,${OPACITY / 255})`;
  const color0 = `rgba(0,0,0,0)`;

  const WideDim = {
    sprite: null,
    ensure() {
      const scene = SceneManager._scene;
      if (!scene) return null;
      const parent = scene._spriteset || scene; // WindowLayerより背面
      if (!this.sprite || this.sprite.parent !== parent) {
        this.dispose();
        const sp = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        sp.visible = false;
        parent.addChild(sp);
        this.sprite = sp;
      }
      const bmp = this.sprite.bitmap;
      if (bmp.width !== Graphics.width || bmp.height !== Graphics.height) {
        bmp.resize(Graphics.width, Graphics.height);
      }
      return this.sprite;
    },
    draw(y, h) {
      const sp = this.ensure();
      if (!sp) return;
      const bmp = sp.bitmap;
      bmp.clear();

      const top = Math.floor(Math.max(0, y));
      const hh  = Math.floor(Math.max(1, h));
      const edge = Math.min(EDGE, Math.floor(hh / 2));

      if (edge > 0) bmp.gradientFillRect(0, top, Graphics.width, edge, color0, colorO, true);
      const midY = top + edge;
      const midH = Math.max(0, hh - edge * 2);
      if (midH > 0) bmp.fillRect(0, midY, Graphics.width, midH, colorO);
      if (edge > 0) bmp.gradientFillRect(0, top + hh - edge, Graphics.width, edge, colorO, color0, true);

      sp.visible = true;
    },
    setOpacity(val) { if (this.sprite) this.sprite.opacity = val; },
    hide() { if (this.sprite) { this.sprite.visible = false; this.sprite.bitmap.clear(); } },
    dispose() { if (this.sprite && this.sprite.parent) this.sprite.parent.removeChild(this.sprite); this.sprite = null; }
  };

  // シーン切替で消す
  const _SceneBase_start = Scene_Base.prototype.start;
  Scene_Base.prototype.start = function() { _SceneBase_start.call(this); WideDim.hide(); };

  // 既定ディマー無効化（メッセージのみ）
  Window_Message.prototype._refreshDimmer = function() {
    if (this._dimmerSprite) this._dimmerSprite.visible = false;
  };

  // 変更契機（背景変更/配置/開始/終了）
  const _Msg_setBackgroundType = Window_Message.prototype.setBackgroundType;
  Window_Message.prototype.setBackgroundType = function(type) { _Msg_setBackgroundType.call(this, type); this._wideDimNeedsRefresh = true; };

  const _Msg_updatePlacement = Window_Message.prototype.updatePlacement;
  Window_Message.prototype.updatePlacement = function() { _Msg_updatePlacement.call(this); this._wideDimNeedsRefresh = true; };

  const _Msg_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() { _Msg_startMessage.call(this); this._wideDimNeedsRefresh = true; };

  const _Msg_terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() { _Msg_terminateMessage.call(this); WideDim.hide(); };

  const _Msg_update = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    _Msg_update.call(this);
    if (this._wideDimNeedsRefresh) {
      this.refreshWideDim();
      this._wideDimNeedsRefresh = false;
    }
    WideDim.setOpacity(FOLLOW ? this.openness : 255);
  };

  // ★ innerHeight() 非依存：高さは this.height - padding*2 で自前算出
  Window_Message.prototype.refreshWideDim = function() {
    if (this._background === 1) { // 1=暗くする
      const pad = (typeof this.padding === 'function') ? this.padding() : this.padding;
      const innerH = Math.max(0, this.height - pad * 2);
      const y = this.y + pad - MARGIN;
      const h = innerH + MARGIN * 2;
      WideDim.draw(y, h);
    } else {
      WideDim.hide();
    }
  };

  console.log(`[${PLUGIN}] enabled (opacity=${OPACITY}, edge=${EDGE}, margin=${MARGIN}, follow=${FOLLOW})`);
})();
