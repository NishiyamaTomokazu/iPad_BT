﻿let outputReportId = 0x00;
let outputReport = new Uint8Array([64]);

let hidDevice;

//転送済データを受信
function get_send_data(){
	getsendDataArray.length = 0;
	//受信停止
	getHIDend();
	sleep(300);
	let runData = new Array();
	runData[0] = 0xF5;	//245
	transferHID(runData);
	sleep(300);	
	hidDevice.addEventListener('inputreport', handleinputReport_1);
	//500ms後に最初の64バイト取得
	delayedCall(2000,function(){	 
		hidDevice.removeEventListener('inputreport', handleinputReport_1);
		//console.log(getsendDataArray);
		
		var data_start = false;
		let proData = new Array();
		for  (var i = 0; i < getsendDataArray.length; i++) {
			if (getsendDataArray[i] == "230"){
				data_start = true;
			}
			if (data_start && getsendDataArray[i] == "250"){
				data_start = false;
				//console.log(proData);
				break;
			}
			if (data_start){
				proData.push(getsendDataArray[i]);
			}

		}
		let resultList = new Array();
		for  (var i = 0; i < proData.length; i++) {
			if (i % 2 == 0){
				resultList.push(proData[i]);
			}
		}
		//console.log(resultList);
		//温度、明るさ受信開始
		getHID();
		//吸い取ったデータをtextareaに
		document.form6.textarea5.value=resultList.join('\n');
		//読み込み処理
		read_data();
	});
	
}
let getsendDataArray = new Array();
function handleinputReport_1(e) {
	let byte_one = e.data.getUint8(0);
	let byte_two = e.data.getUint8(1);
	//console.log(byte_one);
	//console.log(byte_two);
	getsendDataArray.push(byte_one);
	getsendDataArray.push(byte_two);
}

//ミリ秒停止する
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function transferHID(outData){
	let data = new Array();
	for(var i=0; i<outData.length; i++){
		outputReport[0] = outData[i];
		hidDevice.sendReport(outputReportId, outputReport);
		//console.log(i + "回目" + outputReport[0]);	//確認用
		//await wait(70);	//少し長めウェイト
		await wait(90);	//少し長めウェイト
	}
}
//時計合わせ用の接続
async function connectHIDtime() {
	// chrome://flags/#enable-experimental-web-platform-features これを有効にする
	let hidDevices = await navigator.hid.requestDevice({ filters: [{vendorId: 0x21CF, productId: 0x0002}] });
	if (hidDevices === null || hidDevices.length == 0) return;

	hidDevice = hidDevices[0];

	//以下、確認のため入れている
	//console.log('found hidDevice: ' + hidDevice.productName);
	if(hidDevice.open()) {
		//1秒後にstartCdS実行
	   delayedCall(1200,function(){
		   //新型なら252を送って緑のLEDを点灯させる
		   if (hidDevice.productName.indexOf('UD-1') != -1){			   
			   //接続できたら252を送る
			   let runData = new Array();
			   runData[0] = 0xFC;	//252
			   transferHID(runData);  
		   }
		   getHID();
		   document.querySelector("#setuzokujotai").innerHTML = "接続中";
	   })
	}
}
//
async function connectHID() {
	// chrome://flags/#enable-experimental-web-platform-features これを有効にする
	let hidDevices = await navigator.hid.requestDevice({ filters: [{vendorId: 0x21CF, productId: 0x0002}] });
	if (hidDevices === null || hidDevices.length == 0) return;

	hidDevice = hidDevices[0];

	//以下、確認のため入れている
	//console.log('found hidDevice: ' + hidDevice.productName);
	if(hidDevice.open()) {
		//1秒後にstartCdS実行
	   delayedCall(1200,function(){
		   //新型なら252を送って緑のLEDを点灯させる
		   if (hidDevice.productName.indexOf('UD-1') != -1){			   
			   //接続できたら252を送る
			   let runData = new Array();
			   runData[0] = 0xFC;	//252
			   transferHID(runData);  
		   }
		   getHID();
		   document.querySelector("#setuzokujotai").innerHTML = "接続中";
	   })
		//console.log('Opened hidDevice: ' + hidDevice.productName);
	}
}

// 数秒後に実行メソッド
function delayedCall(second, callBack){
  setTimeout(callBack, second);
}

//デバイスが接続されているか
function usb_info_HID(){
	try{
		if(hidDevice.productName.indexOf('UD-1') != -1){ 
			return true;
		}
		else{
			return false;	
		}
	}
	catch{
		return false;	
	}
}

//デバイスが接続されているか
function usb_info_HID_all(){
	try{
		if(hidDevice.productName.indexOf('UD-1') != -1){ 
			return true;
		}
		else{
			return false;	
		}
	}
	catch{
		return false;	
	}
}

//切断されたら
function handleDisconnectedDevice(e) {
  //console.log("Device disconnected: " + e.device.productName);
	document.querySelector("#setuzokujotai").innerHTML = "接続されていません";
}

var usbinputdata = new Array();//配列の先頭は必ず240になるように
var arraypushbool = false;//取得したデータを配列にセットするか
function handleinputReport(e) {
	//切断されたらhandleDisconnectedDeviceイベント
	navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
	let byte_one = e.data.getUint8(0);
	let byte_two = e.data.getUint8(1);
	if (byte_one == "255" || byte_two == "255"){
		//状態を非表示
		document.getElementById("tenso_status").style.display ="none";		
		document.getElementById("jikko_status").style.display ="none";		
		document.getElementById("dispsensor_off").style.display ="none";	
		document.getElementById("dispsensor_on").style.display ="block";	
	}
	//0 0 1 0 温度(1)　温度(2) 2 0 明るさ(1) 明るさ(2) 3 0 外部(1) 外部(2)
	if (byte_one == "0" && byte_two == "0"){
		//配列の開始をそろえるためにフラグを利用する
		arraypushbool = true;
		usbinputdata.push(byte_one);
		usbinputdata.push(byte_two);
	}
	else{
		if (arraypushbool == true){
			usbinputdata.push(byte_one);
			usbinputdata.push(byte_two);
			if (byte_two == "240" || byte_two == "241"){
				if (byte_two == "240"){
					document.querySelector("#gaibuData").innerHTML = "OFF";
				}
				else{
					document.querySelector("#gaibuData").innerHTML = "ON";
				}
			}
			//console.log(usbinputdata);
			if (usbinputdata.length >= 6){	
				//0 1 温度 2 明るさ 3　の配列				
				//let ondo16 = cov16(usbinputdata[5]) + cov16(usbinputdata[4]);
				//let ondo16 = Number(usbinputdata[5]).toString(16) + Number(usbinputdata[4]).toString(16);
				//let ondo = (parseInt(ondo16,16)/100).toFixed(1);
				//document.querySelector("#ondoData").innerHTML = ondo;
				if (usbinputdata[3] == "100"){					
					document.querySelector("#cdSData").innerHTML = usbinputdata[3];
				}
				else{
					document.querySelector("#cdSData").innerHTML = " " + usbinputdata[3];
				}
				usbinputdata.length = 0;
				arraypushbool = false;
			}
		}
	}
}
// 10進数＝＞16進数転換し2桁で返す
function cov16(n){
sin = "0123456789ABCDEF";
if(n>255)return 'FF';
if(n<0) return '00';
return sin.charAt(Math.floor(n/16))+sin.charAt(n%16);//16進数2桁を返す
  }

//温度、明るさデータ取得開始
function getHID() {
	hidDevice.addEventListener('inputreport', handleinputReport);
}
//温度、明るさデータ取得終了
function getHIDend() {
	hidDevice.removeEventListener('inputreport', handleinputReport);
}

//送信済プログラムの取得
function getHIDprogram(){
	getHIDend();
	let runData = new Array();
	runData[0] = 0xF5;	//プログラム取得(245)
	transferHID(runData);
	hidDevice.addEventListener('inputreport', handleinputReportprogram);
}

var inputprogramdata = new Array();
var proarraypushbool = true;//取得したデータを配列にセットするか(255が来たら終了)
function handleinputReportprogram(e) {
	let byte_one = e.data.getUint8(1);
	if (proarraypushbool == true){
		inputprogramdata.push(byte_one);
		//console.log(inputprogramdata);
		if (inputprogramdata.length == 256){
			proarraypushbool = false;
		}
	}
	else{		
		hidDevice.removeEventListener('inputreport', handleinputReportprogram);
		let totalCount = 0;	
		let searchbool = false;//実命令かどうか
		while (totalCount < inputprogramdata.length) {
			dataNo0 = inputprogramdata[totalCount];
			if (searchbool == false){
				//開始命令があればフラグを立てる
				if (inputprogramdata[totalCount]=="230"){
					searchbool = true;
				}
				else{continue;}
			}
			else{				
				totalCount++;
				//プログラム終了命令なら終わり
                if (dataNo0 == "250") {
                    break;
                }
			}
			
		}
	}
}