//HIDデバイスへ転送
function sendHID(){
	try{
	//プログラムの自動保存
	autosave();
	//console.log(usb_info_HID());
	if (usb_info_HID() == false){		
        alert("オーロラクロック3が接続されておりません");
		return;
	}
    //文字プログラムに変換
    outputProData();
    //転送データに変換
    changeSendData();
	//改行コードを\nに統一
    var text  = document.getElementById('sendText').value.replace(/\r\n|\r/g, "\n");
    var lines = text.split( '\n' );    
    if (lines.length > 120){ 
		alert("データ転送量が超えています。");
		return;
	}
    for  (var i = 0; i < lines.length; i++) { 
        if (lines[i] == "230"){
            break;
        }
        if (i == lines.length - 1){
            alert("開始命令がありません。");
            throw new Error("エラーメッセージ");
        }
    }
    //for  (var i = 0; i < lines.length; i++) { 
    //    if (lines[i] == "231"){
    //        break;
    //    }
    //    if (i == lines.length - 1){
    //        alert("終了命令がありません。");
    //        throw new Error("エラーメッセージ");
    //    }
    //}
	
	var startArray = new Array(); 
	
	startArray.push("240");		
	for  (var i = 0; i < lines.length; i++) {
		if (lines[i] == ""){break;}
		startArray.push(lines[i]);	
	}
	startArray.push("250");	
	document.getElementById("tenso_status").style.display ="block";		
	document.getElementById("jikko_status").style.display ="none";	
	document.getElementById("dispsensor_off").style.display ="block";	
	document.getElementById("dispsensor_on").style.display ="none";
	transferHID(startArray);	
		
    }catch(e){}
}
//HIDデバイスの実行
function runHID(){
	if (usb_info_HID() == false){		
        alert("オーロラクロック3が接続されておりません");
		return;
	}
	let runData = new Array();
	runData[0] = 0xF1;	//LED実行
	//runData[0] = 0xF3;	//音プログラム実行
	document.getElementById("tenso_status").style.display ="none";		
	document.getElementById("jikko_status").style.display ="block";
	document.getElementById("dispsensor_off").style.display ="block";	
	document.getElementById("dispsensor_on").style.display ="none";
	transferHID(runData);
}