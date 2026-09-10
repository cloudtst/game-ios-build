/*:
 * @plugindesc Allows to use image masking on pictures
 * @version 1.0.1
 * @editor moca
 *
 * @help
 *
 * This plugin allows to use a picture image as a graphic mask of another
 * picture.
 *
 * A mask is an image that determines the visibility of pixels for another image.
 * White pixels on the mask image makes visible the pixels on the affected image.
 *
 * Commands
 *
 * SETMASK affected_picture_id    mask_picture_id
 * REMOVEMASK affected_picture_id
 *
 *
 * @param EnableRedraw
 * @desc Enable masks across scenes
 * @default true
 * @type boolean
 * 
 */

(function() {

    //#region P.S.
    const PLUGIN_NAME = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);
    const ENABLE_REDRAW = PARAMS["EnableRedraw"] === 'true'
    //#endregion

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        console.log(command);
        if( command == 'SETMASK' ){
            //#region P.S.
            SceneManager._scene.setMask(args[0]-1, args[1]-1);
            SceneManager._scene.applyMask(args[0]-1);
            //#endregion
            console.log('APPLY');
            //#region CommentOut
            // id_1 = args[0]-1;
            // id_2 = args[1]-1;
            // SceneManager._scene._spriteset._pictureContainer.children[id_1].mask = SceneManager._scene._spriteset._pictureContainer.children[id_2];
            //#endregion
        }

        if( command == 'REMOVEMASK' ){
            //#region P.S.
            SceneManager._scene.removeMask(args[0]-1);
            //#endregion
            //#region CommentOut
            // id_1 = args[0]-1;
            // SceneManager._scene._spriteset._pictureContainer.children[id_1].mask = false;
            //#endregion
        }
    }

    //#region P.S.
    // add mask data as temporary data
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);

        this._maskPair = {};
    }

    Scene_Map.prototype.setMask = function(id_1, id_2) {
        $gameTemp._maskPair[id_1] = id_2;
    }
    Scene_Map.prototype.applyMask = function(id_1) {
        if(id_1 in $gameTemp._maskPair){
            var id_2 = $gameTemp._maskPair[id_1];
            this._spriteset._pictureContainer.children[id_1].mask = SceneManager._scene._spriteset._pictureContainer.children[id_2];
        }
    }
    Scene_Map.prototype.applyMaskAll = function() {
        Object.keys($gameTemp._maskPair).forEach(key => this.applyMask(key, $gameTemp._maskPair[key]));
    }
    Scene_Map.prototype.removeMask = function(id_1) {
        delete $gameTemp._maskPair[id_1];
        this._spriteset._pictureContainer.children[id_1].mask = false;
    }

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);

        if(ENABLE_REDRAW) {
            this.applyMaskAll();
        }
    }

    //#endregion

})();