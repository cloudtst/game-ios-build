//=============================================================================
// RPG Maker MZ - Picture_Fade
//=============================================================================

/*:
 * @target MZ
 * @plugindesc ピクチャのフェードイン ＆ フェードアウト
 * @version 1.1
 * @author Kato Marine
 *
 * @help Picture_Fade.js
 *
 * このプラグインは、イベントコマンドの「スクリプト」で
 * $gameScreen.Picture_Fade(ピクチャ番号, 透明度, 時間);
 * と実行することで、ピクチャの座標や拡大率はそのままでピクチャの透明度を
 * 操作することができます。
 * 
 * 例１（ピクチャ1番を透明度0に15フレームかけて操作）：
 * $gameScreen.Picture_Fade(1, 0, 15);
 * 
 * 例２（ピクチャ1 ~ 10番を透明度0に30フレームかけて操作）
 * for(var i = 1; i <= 10; i++){
 * $gameScreen.Picture_Fade(i, 0, 30);
 * }
 * 
 * ※ウェイトはかからないので、イベントコマンドでご自身でかけてください。
 * 
 * 
 * プラグインコマンドはありません。
 * 
 * 
 * 
 * 
 * 
 * 【おまけ機能】
 * 演出によってはピクチャを相対的にスライドさせたかったり、ついでに
 * 拡大率もちょいいじりたいときがありますよね。
 * 
 * そういう時は
 * $gameScreen.Picture_Fade(ピクチャ番号, 透明度, 時間, イージング, 足すX座標, 足すY座標, 拡大率X, 拡大率Y);
 * このように後ろに引数を足していけば動きますよ。
 * 
 * イージングは、
 * 0: 一定速度  1: ゆっくり始まる  2: ゆっくり終わる  3: ゆっくり始まりゆっくり終わる
 * 
 */

(() => {

    Game_Screen.prototype.Picture_Fade = function (numset, opaset, duraset, easingType, plusX, plusY, scaleX, scaleY) {

        var pic = $gameScreen._pictures[$gameScreen.realPictureId(numset)];
        if (pic) {

        if (easingType == null) { easingType = 0; }
        if (plusX == null) { plusX = 0; }
        if (plusY == null) { plusY = 0; }
        if (scaleX == null) { scaleX = pic._targetScaleX; }
        if (scaleY == null) { scaleY = pic._targetScaleY; }
        
            pic.move(pic._origin, pic._targetX + plusX, pic._targetY + plusY, scaleX, scaleY, opaset, pic._blendMode, duraset, easingType);
        }

    }

})();
