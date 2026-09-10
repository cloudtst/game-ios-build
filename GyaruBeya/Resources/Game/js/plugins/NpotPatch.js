// NpotSimpleFix.js - Simple plugin for RPG Maker MV/MZ to resize large images (>4096x4096) and fix black screen on Android
// Author: Grok (based on Pixi.js handling)
// Version: 1.0 - Focus on Bitmap resize only

(function() {
  const MAX_SIZE = 4096; // Adjust to 2048 if device has lower GPU limit

  // Helper to resize image using canvas
  function resizeBitmap(bitmap) {
    if (!bitmap || !bitmap._image || bitmap.width <= MAX_SIZE && bitmap.height <= MAX_SIZE) return;

    try {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(MAX_SIZE / bitmap.width, MAX_SIZE / bitmap.height, 1);
      canvas.width = bitmap.width * ratio;
      canvas.height = bitmap.height * ratio;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('NpotSimpleFix: Canvas context null, skipping resize');
        return;
      }
      ctx.drawImage(bitmap._image, 0, 0, canvas.width, canvas.height);
      bitmap._image.src = canvas.toDataURL('image/png');
      bitmap._url = bitmap._image.src;
      bitmap.width = canvas.width;
      bitmap.height = canvas.height;
      console.log('NpotSimpleFix: Resized bitmap to', canvas.width, 'x', canvas.height);
    } catch (err) {
      console.error('NpotSimpleFix: Resize error', err);
    }
  }

  // Override Bitmap.prototype._onLoad to resize after load
  const oldBitmapOnLoad = Bitmap.prototype._onLoad;
  Bitmap.prototype._onLoad = function() {
    oldBitmapOnLoad.call(this);
    resizeBitmap(this);
  };

  // Override Sprite.setBitmap to adjust scale if resized
  const oldSpriteSetBitmap = Sprite.prototype._createBitmap;
  Sprite.prototype._createBitmap = function() {
    oldSpriteSetBitmap.call(this);
    if (this._bitmap && (this._bitmap.originalWidth || this._bitmap.width > MAX_SIZE)) {
      const origW = this._bitmap.originalWidth || this._bitmap.width;
      const origH = this._bitmap.originalHeight || this._bitmap.height;
      this.scale.x = origW / this._bitmap.width;
      this.scale.y = origH / this._bitmap.height;
      console.log('NpotSimpleFix: Adjusted sprite scale', this.scale.x, this.scale.y);
    }
  };

  // Optional: Set PIXI precision for Android fix
  if (PIXI && PIXI.settings) {
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
    console.log('NpotSimpleFix: Set PIXI precision to HIGH for Android');
  }

  console.log('NpotSimpleFix: Plugin loaded successfully');
})();