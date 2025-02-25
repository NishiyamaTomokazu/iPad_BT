//プログラム出力（textarea1へ）
function outputProData() {
	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
	let code = Blockly.JavaScript.workspaceToCode(workspace);
	//プログラムスタートからの命令だけにする
	var pro_text  = code.replace(/\r\n|\r/g, "\n");
    var lines = pro_text.split( '\n' );
	var text = "";
	var bool_start = false;
	for ( var i = 0; i < lines.length; i++ ) {
		if (lines[i] == "start"){
			bool_start = true;
			text += lines[i];
			continue;
		}
		if (bool_start){
			if (lines[i] == ""){
				bool_start = false;
				text += "\n";
				continue;
			}
			if (text != ""){text += "\n";}
			text += lines[i];
		}
	}	
	document.form2.textarea1.value = text;
}
//転送データ出力（textarea2へ）
function changeSendData() {
    document.form3.textarea2.value=getSenddata();    
}
//次のコマンドがelseなら
function get_next_else_add(cnt, iflevel, addarray ,ifarray){	
	for ( var i = cnt; i < addarray.length; i++ ) {
		if (Number(ifarray[i]) == iflevel -2 ){
			if (addarray[i] != ""){return addarray[i];}
		}
	}
	return addarray[addarray.length - 1];
}
//ifのelseの番地取得 cnt:検索開始位置　iflevel:検索開始位置のifレベル　addarrar;コマンドの開始アドレス　
function get_else_add(cnt, iflevel, addarray ,ifarray, allarray){	
	var doifcnt = 0;//ifが存在する個数
	for ( var i = cnt; i < addarray.length; i++ ) {
		//elseのあるifの場合
		if (doifcnt == 1){
			if (iflevel < Number(ifarray[i])){			
				if (addarray[i] != "" && i > cnt + 1){
					return addarray[i];
				}
			}
		}
		//elseのないifの場合
		if (doifcnt == -2){
			if (iflevel > Number(ifarray[i])){			
				if (addarray[i] != "" && i > cnt + 1){
					return addarray[i];
				}
			}
		}
		//if文があれば+1
		if (allarray[i].indexOf('doIf') != -1){
			doifcnt++;
		}
		else if (allarray[i].indexOf('else') != -1){
			doifcnt++;
		}
		else if (allarray[i].indexOf('endif') != -1){
			doifcnt -=2;
		}
	}
	return addarray[addarray.length - 1];
}
//cnt以降の次の番地取得
function get_add(cnt, iflevel, addarray ,ifarray){
	for ( var i = cnt; i < addarray.length; i++ ) {
		if (addarray[i] != ""){
			if (ifarray[i] == iflevel.toString() || ifarray[i] == (iflevel + 1).toString() || ifarray[i] == (iflevel - 1).toString()){
				return addarray[i];
			}
		}
	}	
	return addarray[addarray.length - 1];
}
//色からRGB値を取得
function get_colordata(color){
    if (color == "Red"){return "255 0 0 ";}
    else if  (color == "Green"){return "0 255 0 ";}
    else if  (color == "Blue"){return "0 0 255 ";}
    else if  (color == "Yellow"){return "255 255 0 ";}
    else if  (color == "Purple"){return "255 0 255 ";}
    else if  (color == "LighrBlue"){return "0 255 255 ";}
    else if  (color == "White"){return "255 255 255 ";}
    else if  (color == "Off"){return "0 0 0 ";}
}
//LED点灯用
function Change_4Byte(RGB_T_Para){   
    var All_C_data = "0";
    for ( var i = 0; i < 3; i++ ) {
        var C_par = Color_Data(strSplit(RGB_T_Para, i, " "));        
        var Binary = C_par.toString(2);          
        var cnt = "";
        for ( var j = 0; j < 6 - Binary.length; j++ ) {
            cnt += "0";
        }        
        Binary = cnt + Binary;
        All_C_data = All_C_data + Binary;
    }
    var Binarytime = strSplit(RGB_T_Para, 3, " ");
    Binarytime = Number(Binarytime).toString(2);
    var cnt = "";
    for ( var j = 0; j < 7 - Binarytime.length; j++ ) {
        cnt += "0"
    }   
    Binarytime =  cnt+ Binarytime;
    All_C_data = All_C_data + Binarytime;
    All_C_data += "000000";
    
    return All_C_data;
}
//フェードインアウト用
function Change_3Byte(RGB_T_Para){   
    var All_C_data = "0";
    for ( var i = 0; i < 3; i++ ) {
        var C_par = Color_Data(strSplit(RGB_T_Para, i, " "));        
        var Binary = C_par.toString(2);          
        var cnt = "";
        for ( var j = 0; j < 6 - Binary.length; j++ ) {
            cnt += "0";
        }        
        Binary = cnt + Binary;
        All_C_data = All_C_data + Binary;
    }
    var Binarytime = strSplit(RGB_T_Para, 3, " ");
    Binarytime = Number(Binarytime).toString(2);
    var cnt = "";
    for ( var j = 0; j < 5 - Binarytime.length; j++ ) {
        cnt += "0"
    }   
    Binarytime =  cnt+ Binarytime;
    All_C_data = All_C_data + Binarytime;
    
    return All_C_data;
}
//0～255を0～100に変換
function Color_Data(No){
    var xy = (No * 100 / 255) / 12;
    var vis= Math.ceil(Math.pow(xy, 2)) ;
    if ( vis > 63 ) {
        return 63;
    }
    else{
        return vis;
    }
}
//文字列を分解（str：文字列 , no：何番目を取得するか）
function strSplit(str, no, kugiri){
    var strArray = str.split(kugiri);
    return strArray[no];
}
//textareaの内容を配列にセット
function splitByLine() {
    //改行コードを\nに統一
    var text  = document.getElementById('proText').value.replace(/\r\n|\r/g, "\n");
    var lines = text.split( '\n' );
    var outArray = new Array();

    for ( var i = 0; i < lines.length; i++ ) {
        // 空行があれば終了
        if ( lines[i] == '' ) {
            break;
        }
        //lines[i] = lines[i].replace(",","");
        outArray.push( lines[i] +"\n");
    }
    return outArray;
}
//消費メモリ表示
function disp_memory(){//文字プログラムに変換
    outputProData();
    //転送データに変換
    changeSendData();
	//改行コードを\nに統一
	var text  = document.getElementById('sendText').value.replace(/\r\n|\r/g, "\n");
	var lines = text.split( '\n' );
	alert("消費メモリ数は" + (lines.length - 3).toString() + "/120 です");
}
// ビジーwaitを使う方法
function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}
//レポート内容を文字列化（保存時使用）
function report_txt(){
	var r_st = "REPORT" + "\n";
	r_st += "nen=" + document.getElementById('print_nen').value + "\n";
	r_st += "kumi=" + document.getElementById('print_kumi').value + "\n";
	r_st += "ban=" + document.getElementById('print_ban').value + "\n";
	r_st += "name=" + document.getElementById('print_name').value + "\n";
	r_st += "title=" + document.getElementById('print_title').value + "\n";
	r_st += "koso=" + document.getElementById('print-text-koso').value.replace(/\r\n|\r|\n/g, '<br>') + "\n";
	r_st += "siyo=" + document.getElementById('print-text-siyo').value.replace(/\r\n|\r|\n/g, '<br>') + "\n";
	r_st += "kuhu=" + document.getElementById('print-text-kuhu').value.replace(/\r\n|\r|\n/g, '<br>') + "\n";
	r_st += "kanso=" + document.getElementById('print-text-kanso').value.replace(/\r\n|\r|\n/g, '<br>') + "\n";
	return r_st;
}
//プログラムの印刷
function printBlock() {
	//idを取得
	let textkoso = document.getElementById('print-text-koso').value.replace(/\r\n|\r|\n/g, '<br>');
	if (textkoso == ""){textkoso = "<br><br><br><br><br>"}
	let koso = document.getElementById('print-koso');
	koso.innerHTML = textkoso;
	let textsiyo = document.getElementById('print-text-siyo').value.replace(/\r\n|\r|\n/g, '<br>');
	if (textsiyo == ""){textsiyo = "<br><br><br><br><br>"}
	let siyo = document.getElementById('print-siyo');
	siyo.innerHTML = textsiyo;
	let textkuhu = document.getElementById('print-text-kuhu').value.replace(/\r\n|\r|\n/g, '<br>');
	if (textkuhu == ""){textkuhu = "<br><br><br><br><br>"}
	let kuhu = document.getElementById('print-kuhu');
	kuhu.innerHTML = textkuhu;
	let textkanso = document.getElementById('print-text-kanso').value.replace(/\r\n|\r|\n/g, '<br>');
	if (textkanso == ""){textkanso = "<br><br><br><br><br>"}
	let kanso = document.getElementById('print-kanso');
	kanso.innerHTML = textkanso;
	//表示非表示を反転
	document.getElementById("print-koso").style.display ="block";
	document.getElementById("print-siyo").style.display ="block";
	document.getElementById("print-kuhu").style.display ="block";
	document.getElementById("print-kanso").style.display ="block";
	document.getElementById("print-text-koso").style.display ="none";
	document.getElementById("print-text-siyo").style.display ="none";
	document.getElementById("print-text-kuhu").style.display ="none";
	document.getElementById("print-text-kanso").style.display ="none";
	window.print();	//window全体を印刷
	//表示に戻す
	document.getElementById("print-koso").style.display ="none";
	document.getElementById("print-siyo").style.display ="none";
	document.getElementById("print-kuhu").style.display ="none";
	document.getElementById("print-kanso").style.display ="none";
	document.getElementById("print-text-koso").style.display ="block";
	document.getElementById("print-text-siyo").style.display ="block";
	document.getElementById("print-text-kuhu").style.display ="block";
	document.getElementById("print-text-kanso").style.display ="block";
}
//印刷エリアの表示
function printDisplay() {
	document.getElementById("printhead").style.display ="block";
}
//印刷エリアの非表示
function printNoDisplay() {
	document.getElementById("printhead").style.display ="none";
}