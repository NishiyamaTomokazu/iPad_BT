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
        var sendArray = new Array(24);   //Bluetoothの場合の設定
    	sendArray.fill(0);
 
		// sendArray[0] = 253;
		// sendArray[1] = 1;// 1:転送 2:実行
		// sendArray[2] = i + 1;
    //WLでBluetoothで接続する場合　最初の４つのデータが無視される
        //var sendArray = new Array(23);
        sendArray.fill(0);      //0で初期化
        sendArray[0] = 0;   //ダミーデータ
        sendArray[1] = 0;   //今のICでは最初のデータが送られない
        sendArray[2] = 0;
        sendArray[3] = 0;
        sendArray[4] = 0;   //ここまで
        sendArray[5] = 253;
        sendArray[6] = 1;   //1:転送　2:実行
        sendArray[7] = i + 1;   //これ以降に実際のデータを送信する
		for (var j = 0; j < 16; j++) {
			if ((i * 16 + j) > lines.length -1){break;}
            sendArray[j + 8] = Number(lines[i * 16 + j]);			//WLのBluetoothの場合
        	//sendArray[j + 7] = Number(lines[i * 16 + j]);			
            //sendArray[j + 3] = Number(lines[i * 16 + j]);			
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
	//var sendArray = new Array(23);   //WLのBluetooth
    var sendArray = new Array(24);      //SRのBluetooth
	sendArray.fill(0);

    sendArray[0] = 0;   //ダミーデータ
    sendArray[1] = 0;
    sendArray[2] = 0;
    sendArray[3] = 0;
    sendArray[4] = 0;   //ここまで
    sendArray[5] = 253;
    sendArray[6] = 2;   //2:実行


	sendDataBySound(sendArray);
}