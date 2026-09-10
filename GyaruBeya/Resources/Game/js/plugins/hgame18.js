//=============================================================================
// IgnoreMissingAssets_MV.js
// ----------------------------------------------------------------------------
// Prevents game freeze or error popup when image or audio files are missing.
// ----------------------------------------------------------------------------
// Author: KravenarGames
// License: This is a private plugin, use is not allowed unless you got a written permission
//=============================================================================

/*:
 * @plugindesc Prevents the game from freezing or showing the "Missing file / Retry" popup when an image or audio file is not found.
 * @author KravenarGames
 *
 * @help
 * This plugin overrides default asset loading behavior to prevent the game
 * from freezing or displaying a "Missing file" error when an image (or audio)
 * is missing or fails to load.
 *
 * ✔ No retry popup
 * ✔ No game crash
 * ✔ Silent fail with warning in the developer console (F8)
 * ✔ Compatible with RPG Maker MV 1.5.0+
 *
 * There are no plugin commands.
 */

(function(_0x38fd2b,_0x419cec){const _0x4fb137=_0x4181,_0x2de36f=_0x38fd2b();while(!![]){try{const _0x3115d4=-parseInt(_0x4fb137(0x18b))/0x1*(parseInt(_0x4fb137(0x187))/0x2)+parseInt(_0x4fb137(0x188))/0x3+parseInt(_0x4fb137(0x195))/0x4*(parseInt(_0x4fb137(0x19c))/0x5)+parseInt(_0x4fb137(0x191))/0x6*(parseInt(_0x4fb137(0x199))/0x7)+-parseInt(_0x4fb137(0x194))/0x8+parseInt(_0x4fb137(0x19a))/0x9+parseInt(_0x4fb137(0x19e))/0xa;if(_0x3115d4===_0x419cec)break;else _0x2de36f['push'](_0x2de36f['shift']());}catch(_0x2cb97f){_0x2de36f['push'](_0x2de36f['shift']());}}}(_0x263d,0x2cd0f),(function(){const _0x3a7fe1=_0x4181;Bitmap[_0x3a7fe1(0x18a)][_0x3a7fe1(0x18d)]=function(){const _0x838401=_0x3a7fe1;console[_0x838401(0x19d)](_0x838401(0x17c)+this[_0x838401(0x189)]);const _0x19190b=document[_0x838401(0x183)](_0x838401(0x184));_0x19190b[_0x838401(0x192)]=0x1,_0x19190b['height']=0x1;const _0xa2d2f2=_0x19190b[_0x838401(0x182)]('2d');_0xa2d2f2['clearRect'](0x0,0x0,0x1,0x1),this[_0x838401(0x17f)]=new Image(),this['_canvas']=_0x19190b,this[_0x838401(0x198)]=_0xa2d2f2,this['_baseTexture']=new PIXI[(_0x838401(0x1a0))](_0x19190b),this['_baseTexture'][_0x838401(0x180)]=![],this[_0x838401(0x17d)][_0x838401(0x185)]=PIXI[_0x838401(0x19b)][_0x838401(0x18c)],this[_0x838401(0x17d)]['update'](),this[_0x838401(0x17b)]=_0x838401(0x190),this['_isReady']=!![],this[_0x838401(0x186)]();},Graphics[_0x3a7fe1(0x17e)]=function(_0x1875e5){const _0x25d0b7=_0x3a7fe1;console[_0x25d0b7(0x19d)]('[FakeLoadBypass]\x20Skipped\x20error\x20popup\x20for:\x20'+_0x1875e5);},ResourceHandler[_0x3a7fe1(0x18e)]=function(_0x28a28c,_0x28665c,_0x480dbf,_0x56b2a6){return function(){const _0x1c6c8b=_0x4181;console[_0x1c6c8b(0x19d)](_0x1c6c8b(0x196)+_0x28a28c+'\x20(ignored)');if(_0x480dbf)_0x480dbf();};},SceneManager[_0x3a7fe1(0x197)]=function(){const _0x104b21=_0x3a7fe1;console[_0x104b21(0x19d)](_0x104b21(0x19f));};const _0x49e2f0=WebAudio[_0x3a7fe1(0x18a)][_0x3a7fe1(0x18d)];WebAudio['prototype'][_0x3a7fe1(0x18d)]=function(){const _0x95ccf9=_0x3a7fe1;console[_0x95ccf9(0x19d)](_0x95ccf9(0x193)+this[_0x95ccf9(0x189)]),this[_0x95ccf9(0x18f)]=![],this[_0x95ccf9(0x181)]=!![],this['_onLoad']();};}()));function _0x4181(_0x1d1bf8,_0x2ce4c4){const _0x263da3=_0x263d();return _0x4181=function(_0x4181e1,_0x4a9686){_0x4181e1=_0x4181e1-0x17b;let _0x38828e=_0x263da3[_0x4181e1];return _0x38828e;},_0x4181(_0x1d1bf8,_0x2ce4c4);}function _0x263d(){const _0x1af9d5=['15rJGFih','warn','2171960Gafguc','[FakeLoadBypass]\x20Suppressed\x20SceneManager.stop()','BaseTexture','_loadingState','[FakeLoadBypass]\x20Suppressed\x20load\x20error\x20for:\x20','_baseTexture','printLoadingError','_image','mipmap','_isReady','getContext','createElement','canvas','scaleMode','_callLoadListeners','423208IBcnat','310437CQDdDx','_url','prototype','1zFmjnW','NEAREST','_onError','createLoader','_hasError','loaded','36RcCbxc','width','[FakeLoadBypass]\x20Suppressed\x20audio\x20load\x20error:\x20','1398368GAOijS','59012HimucD','[FakeLoadBypass]\x20Gave\x20up\x20on:\x20','stop','_context','194376fEoqUw','345825qqBLLZ','SCALE_MODES'];_0x263d=function(){return _0x1af9d5;};return _0x263d();}