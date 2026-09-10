/* e.listener is not a function 対策 */
(function() {
  const GS = Game_Spine.prototype;
  const _dispatch = GS.dispatchEventListener;
  GS.dispatchEventListener = function(type, data) {
    const list = this._eventListeners && this._eventListeners[type];
    if (!list) return;
    for (let i = list.length - 1; i >= 0; i--) {
      const entry = list[i];
      const fn = entry && (entry.listener || entry);
      if (typeof fn !== 'function') {                
        list.splice(i, 1);
        continue;
      }
      fn.call(this, data);
      if (entry && entry.once) list.splice(i, 1);
    }
  };

  const _extract = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _extract.call(this, contents);
    if ($gameScreen && Array.isArray($gameScreen._spines)) {
      $gameScreen._spines.forEach(sp => sp && sp._rebindListeners && sp._rebindListeners());
    }
  };

  GS._rebindListeners = function() {
    this._eventListeners = this._eventListeners || {};
    for (const type in this._eventListeners) {
      const arr = this._eventListeners[type] || [];
      this._eventListeners[type] = arr
        .filter(e => typeof (e && (e.listener || e)) === 'function')
        .map(e => (typeof e === 'function' ? { listener: e, once: false } : e));
    }
  };
})();
