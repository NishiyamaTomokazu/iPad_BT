// //元のプログラム
// //転送処理(iPad)
// function sendHID_iPad() {    
// 	try{
// 	//プログラムの自動保存
// 	autosave();
		
//     //文字プログラムに変換
//     outputProData();
//     //転送データに変換
//     changeSendData();
// 	//改行コードを\nに統一
//     var text  = document.getElementById('sendText').value.replace(/\r\n|\r/g, "\n");
//     var lines = text.split( '\n' );    
//     if (lines.length > 120){ 
// 		alert("データ転送量が超えています。");
// 		return;
// 	}
//     for  (var i = 0; i < lines.length; i++) { 
//         if (lines[i] == "230"){
//             break;
//         }
//         if (i == lines.length - 1){
//             alert("開始命令がありません。");
//             throw new Error("エラーメッセージ");
//         }
//     }
//     //for  (var i = 0; i < lines.length; i++) { 
//     //    if (lines[i] == "231"){
//     //        break;
//     //    }
//     //    if (i == lines.length - 1){
//     //        alert("終了命令がありません。");
//     //        throw new Error("エラーメッセージ");
//     //    }
//     //}
        
// 	document.form6.textarea5.value ="";
//     var blcnt = Math.ceil(lines.length / 16);//32バイトずつ転送するので何ブロックあるか
//     for  (var i = 0; i < blcnt; i++) {
// 		var sendArray = new Array(19);   
//     	sendArray.fill(0);
// 		sendArray[0] = 253;
// 		sendArray[1] = 1;// 1:転送 2:実行
// 		sendArray[2] = i + 1;
// 		for (var j = 0; j < 16; j++) {
// 			if ((i * 16 + j) > lines.length -1){break;}
//         	sendArray[j + 3] = Number(lines[i * 16 + j]);			
// 		}
// 		sendDataBySound(sendArray);  				
//     	sleep(500);   		  
// 		//console.log(sendArray);
// 		document.form6.textarea5.value +=sendArray+"\n";
// 	}

		
//     }catch(e){}
// }

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
		// var sendArray = new Array(19);   //有線の場合の設定
    	// sendArray.fill(0);
		// sendArray[0] = 253;
		// sendArray[1] = 1;// 1:転送 2:実行
		// sendArray[2] = i + 1;
    //Bluetoothで接続する場合
        var sendArray = new Array(23);
        //var sendArray = new Array();
        sendArray.fill(0);      //0で初期化
        // sendArray[0] = 0;
        // sendArray[1] = 0;
        // sendArray[2] = 0;
        // sendArray[3] = 0;
        // sendArray[4] = 253;
        // sendArray[5] = 1;   //1:転送　2:実行
        // sendArray[6] = i + 1;   //これ以降に実際のデータを送信する
        sendArray[0] = 0;
        sendArray[1] = 1;
        sendArray[2] = 2;
        sendArray[3] = 3;
        sendArray[4] = 253;
        sendArray[5] = 1;   //1:転送　2:実行
        sendArray[6] = i + 1;   //これ以降に実際のデータを送信する
		for (var j = 0; j < 16; j++) {
			if ((i * 16 + j) > lines.length -1){break;}
        	sendArray[j + 7] = Number(lines[i * 16 + j]);			
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
	var sendArray = new Array(23);   
	sendArray.fill(0);
	// sendArray[0] = 0;
    // sendArray[1] = 0;
    // sendArray[2] = 0;
    // sendArray[3] = 0;
    // sendArray[4] = 253;
    // sendArray[5] = 2;       //1:転送 2:実行

    sendArray[0] = 0;
    sendArray[1] = 1;
    sendArray[2] = 2;
    sendArray[3] = 3;
    sendArray[4] = 253;
    sendArray[5] = 2;
    sendArray[6] = 9;
    sendArray[7] = 9;
    sendArray[8] = 9;
    sendArray[9] = 9;
    sendArray[10] = 9;


    
	sendDataBySound(sendArray);
}