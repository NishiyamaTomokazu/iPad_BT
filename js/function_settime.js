//CUC用
function settime(){
	var sendArray = new Array(64);   
    sendArray.fill(255);
	sendArray[0] = "247";
	sendArray[1] = document.getElementById('jikoku_nen').value;
	sendArray[2] = document.getElementById('jikoku_gatu').value;
	sendArray[3] = document.getElementById('jikoku_niti').value;
	sendArray[4] = document.getElementById('jikoku_ji').value;
	sendArray[5] = document.getElementById('jikoku_hun').value;
	
	var alermcheck = document.getElementById('alermon');
	if (alermcheck.checked){ sendArray[6] = "1"; }
	else{ sendArray[6] = "0"; }
	
	sendArray[7] = document.getElementById('alerm_ji').value;
	sendArray[8] = document.getElementById('alerm_hun').value;
	//sendArray[9] = "250";	

	//console.log(sendArray);	
	transferUSB4(sendArray);  			
}
//UC用
function settimeHID(){
	if (usb_info_HID_all() == false){		
        alert("デバイスが接続されておりません");
		return;
	}
	var sendArray = new Array(19);   
    sendArray.fill("255");
	sendArray[0] = "247";
	sendArray[1] = document.getElementById('jikoku_nen').value;
	sendArray[2] = document.getElementById('jikoku_gatu').value;
	sendArray[3] = document.getElementById('jikoku_niti').value;
	sendArray[4] = document.getElementById('jikoku_ji').value;
	sendArray[5] = document.getElementById('jikoku_hun').value;
	
	var alermcheck = document.getElementById('alermon');
	if (alermcheck.checked){ sendArray[6] = "1"; }
	else{ sendArray[6] = "0"; }
	
	sendArray[7] = document.getElementById('alerm_ji').value;
	sendArray[8] = document.getElementById('alerm_hun').value;	  
	//console.log(sendArray);
	transferHID(sendArray);		
	document.form3.textarea2.value +=sendArray+"\n";
}

//音楽初期化用
function sendInitSound(){
	if (usb_info_HID_all() == false){		
        alert("デバイスが接続されておりません");
		return;
	}
	var soundData = [251,242,1,194,201,195,201,196,197,201,198,201,199,201,\
		200,201,192,2,49,53,54,93,187,49,53,54,93,187,\
		49,53,54,93,90,86,90,88,187,53,53,51,86,187,90,\
		93,56,91,187,53,54,93,90,86,88,86,187,250];
		transferHID(soundData);

}

//iPad用
function settime_iPad(){
	var sendArray = new Array(19);   
    sendArray.fill("255");
	sendArray[0] = "247";
	sendArray[1] = document.getElementById('jikoku_nen').value;
	sendArray[2] = document.getElementById('jikoku_gatu').value;
	sendArray[3] = document.getElementById('jikoku_niti').value;
	sendArray[4] = document.getElementById('jikoku_ji').value;
	sendArray[5] = document.getElementById('jikoku_hun').value;
	
	var alermcheck = document.getElementById('alermon');
	if (alermcheck.checked){ sendArray[6] = "1"; }
	else{ sendArray[6] = "0"; }
	
	sendArray[7] = document.getElementById('alerm_ji').value;
	sendArray[8] = document.getElementById('alerm_hun').value; 		  
	//console.log(sendArray);
	sendDataBySound(sendArray);
	//document.form6.textarea5.value +=sendArray+"\n";
}