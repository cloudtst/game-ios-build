(function () {
  'use strict';

  console.log('[BypassErrors] Applying patch to ignore image/audio loading errors.');

  // IMAGE ERROR BYPASS
  const _Bitmap_isReady = Bitmap.prototype.isReady;
  Bitmap.prototype.isReady = function () {
    if (this.isError()) this.eraseError();
    return _Bitmap_isReady.apply(this, arguments);
  };

  const _Bitmap_decode = Bitmap.prototype.decode;
  Bitmap.prototype.decode = function () {
    _Bitmap_decode.apply(this, arguments);
    if (this._loadingState === 'requesting' && this._image) {
      this._image.addEventListener('error', () => {
        this._hasError = false;
        this._isLoading = false;
        this._loadingState = 'loaded';
        console.warn('[BypassErrors] Ignored image load error.');
      });
    }
  };

  Bitmap.prototype.eraseError = function () {
    this._hasError = false;
    this._isLoading = false;
    this._loadingState = 'loaded';
  };

  // AUDIO ERROR BYPASS
  AudioManager.checkErrors = function () {
    // Intentionally do nothing to avoid crash
    console.warn('[BypassErrors] Ignored audio load error.');
  };

  // VIDEO ERROR BYPASS
  const _Graphics_playVideo = Graphics._playVideo;
  Graphics._playVideo = function (src) {
    _Graphics_playVideo.apply(this, arguments);
    if (this._video) {
      this._video.onerror = () => {
        console.warn('[BypassErrors] Ignored video load error.');
      };
    }
  };

  // OPTIONAL: Patch ResourceHandler to disable retry failures
  if (typeof ResourceHandler !== 'undefined') {
    const _createLoader = ResourceHandler.createLoader;
    ResourceHandler.createLoader = function (url, retryMethod, resignMethod, retryInterval) {
      // If it's image/audio/video, skip loader
      if (/^(img|audio|movie)\//.test(url)) {
        return null;
      } else {
        return _createLoader.call(this, url, retryMethod, resignMethod, retryInterval);
      }
    };
  }
})();