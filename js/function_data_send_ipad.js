//転送処理(iPad)
function sendHID_iPad() {    
	try{
	//プログラムの自動保存
	autosave();
		
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
        
	document.form6.textarea5.value ="";
    var blcnt = Math.ceil(lines.length / 16);//32バイトずつ転送するので何ブロックあるか
    for  (var i = 0; i < blcnt; i++) {
		var sendArray = new Array(19);   
    	sendArray.fill(0);
		sendArray[0] = 253;
		sendArray[1] = 1;// 1:転送 2:実行
		sendArray[2] = i + 1;
		for (var j = 0; j < 16; j++) {
			if ((i * 16 + j) > lines.length -1){break;}
        	sendArray[j + 3] = Number(lines[i * 16 + j]);			
		}
		sendDataBySound(sendArray);  				
    	sleep(500);   		  
		//console.log(sendArray);
		document.form6.textarea5.value +=sendArray+"\n";
	}

		
    }catch(e){}
}
//実行処理(iPad)
function runHID_iPad(){
	var sendArray = new Array(19);   
	sendArray.fill(0);
	sendArray[0] = 253;
	sendArray[1] = 2;// 1:転送 2:実行
	
	sendDataBySound(sendArray);
}