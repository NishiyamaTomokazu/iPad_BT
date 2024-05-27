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
	sendArray[1] = document.getElementById('jikoku_ji').value;
	sendArray[2] = document.getElementById('jikoku_hun').value;
	
	var alermcheck = document.getElementById('alermon');
	if (alermcheck.checked){ sendArray[3] = "1"; }
	else{ sendArray[3] = "0"; }
	
	sendArray[4] = document.getElementById('alerm_ji').value;
	sendArray[5] = document.getElementById('alerm_hun').value;	  
	//console.log(sendArray);
	transferHID(sendArray);		
	document.form3.textarea2.value +=sendArray+"\n";
}
//iPad用
function settime_iPad(){
	var sendArray = new Array(19);   
    sendArray.fill("255");
	sendArray[0] = "247";
	sendArray[1] = document.getElementById('jikoku_ji').value;
	sendArray[2] = document.getElementById('jikoku_hun').value;
	
	var alermcheck = document.getElementById('alermon');
	if (alermcheck.checked){ sendArray[3] = "1"; }
	else{ sendArray[3] = "0"; }
	
	sendArray[4] = document.getElementById('alerm_ji').value;
	sendArray[5] = document.getElementById('alerm_hun').value; 		  
	//console.log(sendArray);
	sendDataBySound(sendArray);
	//document.form6.textarea5.value +=sendArray+"\n";
}