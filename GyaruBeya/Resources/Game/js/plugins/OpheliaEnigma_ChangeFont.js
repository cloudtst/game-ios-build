//=============================================================================
// OpheliaEnigma_ChangeFont.js
//=============================================================================

/*:
 * @plugindesc Allows the developer to set a specific font name and/or size
 * throughout all the game's text (all windows, messages, etc).
 *
 * @author OpheliaEnigma
 *
 * @param font name
 * @desc the name of the font, such as Verdana, Courier New, etc.
 * Padrão: GameFont
 * @default GameFont
 *
 * @param font size
 * @desc the size of the font.
 * Padrão: 28
 * @default 28
 * @help
 * 
 *                      COPYRIGHT NOTICE:
 *                      -----------------
 *
 * This plugin is free to be used for non-commercial projects, however, for
 * usage on commercial projects, please visit https://opheliaenigma.itch.io/
 * and donate the amount specified for this plugin. Any doubt don't hesitate
 * to contact me, OpheliaEnigma, either through the specified link or my
 * email address: OpheliaEnigmaUltimateCoder [at] gmail.com
 */


//=============================================================================
// OpheliaEnigma_ChangeFont Code
//=============================================================================
(function(){
	// get plugin parameters
	params = PluginManager.parameters('OpheliaEnigma_ChangeFont');

	var _size = Number(params["font size"]);
	var _font = Number(params["font name"]);
	
	//=============================================================================
	// Window_Base
	//=============================================================================
	Window_Base.prototype.standardFontSize = function() { return _size; };
	Window_Base.prototype.standardFontFace = function() { return _font; };
})();
