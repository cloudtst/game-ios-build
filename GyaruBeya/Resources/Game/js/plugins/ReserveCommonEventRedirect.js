/*:
 * @plugindesc スタック対策
 * @author  
 *
 * @param TargetCommonEventIds
 * @text コモンイベントID
 * @type string
 * @default 5,6
 *
 * @help
 */
(function() {
  'use strict';

  var pluginName = 'ReserveCommonEventRedirect';
  var param = PluginManager.parameters(pluginName);
  var idListStr = (param['TargetCommonEventIds'] || '').trim();
  var targetIds = new Set();
  if (idListStr) {
    idListStr.split(',').forEach(function(s){
      var n = Number(s.trim());
      if (!isNaN(n) && n > 0) targetIds.add(n);
    });
  }

  var _command117 = Game_Interpreter.prototype.command117;
  Game_Interpreter.prototype.command117 = function() {
    var commonEventId = this._params[0];
    if (targetIds.has(commonEventId)) {
      $gameTemp.reserveCommonEvent(commonEventId);
      this._index = this._list.length; 
      return true;
    }
    return _command117.apply(this, arguments);
  };
})();
