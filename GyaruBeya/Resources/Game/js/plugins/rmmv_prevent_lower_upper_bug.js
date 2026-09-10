//=============================================================================
// rpg_core.js v1.6.2
//=============================================================================
//-------------------------------------------
// rmmv_prevent_lower_upper_bug.js
// ver6.0
// 대소문자 오류를 방지하는 플러그인입니다.
//
//
// 업데이트 기록
//
// 2023년 1월 14일
// ver1.0 테스트 , 제작:mfsu, 테스트:미하리
// 부분 배포
//
// 2023년 1월 15일
// ver1.1 보급형 , 제작:mfsu, 테스트:mfsu
// 실행이 안되버리는 각종 오류 수정
//
// 2023년 1월 16일
// ver1.2 보급형 , 제작:mfsu, 테스트:mfsu
// 대소문자가 안맞으면 오류를 안내고, 이미지도 안보이는 버그 수정
//
// 2023년 1월 17일
// ver2.0 부분배포 , 제작:mfsu, 테스트:mfsu
// 대규모 최적화 진행작업 수행, 3분 로딩 -> 5초
//
// 2023년 1월 19일
// ver2.1 부분배포 , 제작:mfsu, 테스트:mfsu
// 파일 찾기 알고리즘 도입
//
// 2023년 1월 19일
// ver3.0 부분배포 , 제작:mfsu, 테스트:mfsu
// pc에서 파일 리스트생성 -> android에서 파일 리스트로 빠른파일찾기, 10초 -> 0초
//
// 2023년 2월 14일
// ver4.0 부분배포 , 제작:mfsu, 테스트:미하리
// 구버전 기능 삭제, mv 지원 시작, 낮은 버전에서도 작동할 수 있도록 변경
//
// 2023년 2월 15일
// ver4.1 부분배포 , 제작:mfsu, 테스트:미하리
// 오류를 일으킬 가능성이 있는 오타 수정, 오타 수정, 연속으로 일어날 수 있는 오류 알림이 1번만 오도록 변경
//
// 2023년 2월 15일
// ver4.2 부분배포 , 제작:mfsu, 테스트:mfsu
// pc버전에서 로딩을 못하는 오류 수정
//
// 2023년 2월 15일
// ver4.3 부분배포 , 제작:mfsu, 테스트:mfsu
// 각종 오류 알림창 추가, ./ ../ 에 대한 폴더 탐색에 대한 경우를 확인
//
// 2023년 2월 15일
// ver4.4 부분배포 , 제작:mfsu, 테스트:mfsu
// 오류를 일으킬 가능성이 있는 오타 수정
//
// 2023년 2월 17일
// ver5.0 부분배포 , 제작:mfsu, 테스트:mfsu
// / ./ ../를 사용하는 경로에 대한 모든 오류를 해결, \\를 사용했을때 일어나는 오류 해결, 콘솔 로그 기능 추가
//
// ver6.0 부분배포 , 제작:mfsu, 테스트:mfsu
// 내장되어있던 콘솔기능을 다른플러그인으로 분리(rm_console_log.js)
// url검사 방식 조금 변경
// 이미지 뿐만 아니라 음악도 대소문자 오류 방지 기능 지원
// 플러그인 충돌이 적어지도록 작동 방식을 변경
// 오류는 콘솔 로그에만 남고, 사용자에게 알리지 않도록 변경
//
//-------------------------------------------


function MFSU_PLUB() {
	throw new Error('This is a static class');
}

MFSU_PLUB.initialize = function() {
	this._fs_base = "www/"; // rpgmv전용
	this._img = {};
	this._img.folder = "img";
	this._img.decrypt = ".png";
	this._img.encrypt = /.rpgmvp$/; // rpgmv전용
	this._img.savefile = "img/img_data_mfsuplub.json";
	this._img.UrlDict = {};
	this._img.UrlDict_State = "loading";
	this._snd = {};
	this._snd.folder = "audio";
	this._snd.decrypt = ".ogg";
	this._snd.encrypt = /.rpgmvo$/; // rpgmv전용
	this._snd.savefile = "audio/snd_data_mfsuplub.json";
	this._snd.UrlDict = {};
	this._snd.UrlDict_State = "loading";
	this._folders = [];
	this._files = [];
	this._errors = {};
};

MFSU_PLUB.Log = function(data){
	console.log("mfsuplub : [정상] " + data);
};

MFSU_PLUB.Warn = function(data){
	console.warn("mfsuplub : [경고] " + data);
};

MFSU_PLUB.Error = function(data){
	console.error("mfsuplub : [오류] " + data);
};

MFSU_PLUB.UrlWarn = function(url, _data, warn){
	var line = [];
	line[0] = warn;
	line[1] = "플러그인 상태 : " + _data.UrlDict_State;
	line[2] = "이미지 경로 : " + url;
	this.Warn(line.join("\n"));
};

MFSU_PLUB.FirstRun = function() {
	if (Utils.isNwjs()) {
		this.Log("[정상] 환경 pc 버전");
		//pc 버전이 실행되는곳
		this.initialize();
		this.SaveData(this._img);
		this.SaveData(this._snd);
		//android 환경과 비슷하도록 제공
		this.initialize();
		this.LoadData(this._img);
		this.LoadData(this._snd);
	} else {
		this.Log("환경 android 버전");
		//android 버전이 실행되는곳
		this.initialize();
		this.LoadData(this._img);
		this.LoadData(this._snd);
	}
};

MFSU_PLUB.SaveData = function(_data) {
	this.Log(_data.folder + "파일 리스트를 사전에 저장중입니다.");
	this.Set_Folder(_data);
	this.Get_Files(_data);
	this.Save_Json(_data);
	this.Log(_data.folder + "파일 리스트가 사전에 저장되었습니다.");
};

MFSU_PLUB.Set_Folder = function(_data) {
	this._folders = [];
	this._folders.push(_data.folder);
};

MFSU_PLUB.Get_Files = function(_data) {
	const fs = require("fs");
	
	this._files = [];
	for(const folder of this._folders){
		this.Log("폴더 스캔중 " + folder);
		const file_list = fs.readdirSync(this._fs_base + folder);
		
		for(const file of file_list){
			const url = folder + "/" + file;
			const decrypt_url = url.replace(_data.encrypt,_data.decrypt);
			const encode_url = encodeURIComponent(decrypt_url).replace(/%2F/g, "/");
			
			if(fs.lstatSync(this._fs_base + url).isDirectory()){
				//this.Log("폴더 발견됨 " + url);
				this._folders.push(url);
			} else {
				//this.Log("파일 발견됨 " + url);
				if(encode_url == decrypt_url){
					this._files.push(decrypt_url);
				}else{
					this._files.push(decrypt_url);
					this._files.push(encode_url);
				}
			}
		}
	}
};

MFSU_PLUB.Save_Json = function(_data) {
	const fs = require("fs");
	
	const text_json = JSON.stringify({"data":this._files});
	const save_url = this._fs_base + _data.savefile;
	fs.writeFileSync(save_url, text_json, "utf-8");
};




MFSU_PLUB.LoadData = function(_data) {
	this.Log(_data.savefile + "사전 로딩을 시작합니다.");
	const xhr = new XMLHttpRequest();
	const url = _data.savefile;
	xhr.open("GET", url, false);
	xhr.onload = () => this._Onload(xhr, _data);
	xhr.onerror = () => this._Onerror(xhr, _data);
	xhr.send();
};

MFSU_PLUB._Onload = function(xhr, _data){
	if(xhr.status === 200) {
		const json = JSON.parse(xhr.responseText);
		for(var url of json.data){
			_data.UrlDict[url.toLowerCase()] = url;
		}
		_data.UrlDict_State = "complete";
		this.Log(_data.savefile + "사전 로딩이 완료되었습니다.");
	}
};

MFSU_PLUB._Onerror = function(xhr, _data){
	var line = [];
	line[0] = "사전 로딩에 실패했습니다.";
	line[1] = _data.savefile + "을 찾지 못했습니다.";
	this.Error(line.join("\n"));
};

MFSU_PLUB.UrlReduction = function(url){
	url.replace("\\","/")
	const split_url = url.split('/');
	var new_split_url = [];
	
	for(var i = 0; i < split_url.length; i++){
		if(split_url[i] == ".." && new_split_url.length != 0){
			new_split_url.pop();
			continue;
		}else if(split_url[i] == "."){
			continue;
		}else if(split_url[i] == "" && i == 0){
			continue; 
		}else if(split_url[i] == ".." && new_split_url.length == 0){
			this.UrlWarn(url, _data, "url이 하위 폴더를 접근하려고 합니다.");
			return url;
		}else{
			new_split_url.push(split_url[i]);
			continue;
		}
	}
	
	if(split_url.length === 0){
		this.UrlWarn(url, _data, "url이 현재 폴더를 가리키고 있습니다.");
		return url;
	}
	
	const new_url = split_url.join('/');
	
	return new_url;
}

MFSU_PLUB.Get_Url = function(url, _data){
	if(url.startsWith("data:image/jpeg;base64")){ //base64로 암호화된 url
		this.Log("이미지가 base64로 변환된 url입니다.");
		return url;
	}
	
	if(_data.UrlDict_State == "loading"){
		this.UrlWarn(url, _data, "플러그인이 로딩되기 전에 이미지 로드를 시도했습니다.");
		return url;
	}else if(_data.UrlDict_State != "complete"){
		this.UrlWarn(url, _data, "이미지를 로드하려했지만, 플러그인 상태를 알 수 없습니다.");
		return url;
	}
	
	const reduct_url = this.UrlReduction(url);
	const new_url = _data.UrlDict[reduct_url.toLowerCase()];
	
	if(new_url && url != new_url){
		var line = [];
		line[0] = "주소가 변경되었습니다.";
		line[1] = "변경 전 : " + url;
		line[2] = "변경 후 : " + new_url;
		this.Log(line.join("\n"));
		
		return new_url;
	}else if(new_url && url == new_url){
		//this.Log("변경되지 않음 " + url);
		
		return new_url;
	}else{
		this.UrlWarn(url, _data, "이미지 주소를 사전에서 찾을 수 없습니다.");
		return url;
	}
};

MFSU_PLUB.Get_ImgUrl = function(url){
	return this.Get_Url(url,this._img);
}

MFSU_PLUB.Get_SndUrl = function(url){
	return this.Get_Url(url,this._snd);
}

MFSU_PLUB.FirstRun();


//mfsu 변형된 함수 - mv전용
MFSU_PLUB_HOOK_bitmap_load = Bitmap.load;
Bitmap.load = function(url) {
	url = MFSU_PLUB.Get_ImgUrl(url);
	
	return MFSU_PLUB_HOOK_bitmap_load.call(this, url);
};

//mfsu 변형된 함수 - mv전용
MFSU_PLUB_HOOK_bitmap_request = Bitmap.request;
Bitmap.request = function(url){
	url = MFSU_PLUB.Get_ImgUrl(url);
	
	return MFSU_PLUB_HOOK_bitmap_request.call(this, url);
};

//mfsu 변형된 함수 - mv전용
MFSU_PLUB_HOOK_webaudio_initialize = WebAudio.prototype.initialize;
WebAudio.prototype.initialize = function(url){
	url = MFSU_PLUB.Get_SndUrl(url);
	
	return MFSU_PLUB_HOOK_webaudio_initialize.call(this, url);
};

//mfsu 변형된 함수 - mv전용
MFSU_PLUB_HOOK_html5audio_setup = Html5Audio.setup;
Html5Audio.setup = function(url){
	url = MFSU_PLUB.Get_SndUrl(url);
	
	return MFSU_PLUB_HOOK_html5audio_setup.call(this, url);
};