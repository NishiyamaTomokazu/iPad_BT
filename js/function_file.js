//ローカルストレージへプログラムの自動保存
function autosave(){
	var xml = Blockly.Xml.workspaceToDom(workspace);
	var text = Blockly.Xml.domToText(xml);
	text = text + "\n" + report_txt();
	localStorage.setItem("ud1_mainpro",  text);
}
function autosavefile_read(){
	var ABC = localStorage.getItem( "ud1_mainpro" ); // なかったらnullが返る
	if ( ABC ){
		var readdata =　"";
		var datast =　window.localStorage["ud1_mainpro"];
		if (datast.indexOf("REPORT") != -1){
			readdata = datast.substring(0, datast.indexOf("REPORT"));
		}
		else{
			readdata = datast;
		}
		var xml = Blockly.Xml.textToDom(readdata);
		//console.log(xml);
		if (xml != ""){
			workspace.clear();
			Blockly.Xml.domToWorkspace(xml, workspace);
			//レポート内容が保存されていればセット
			set_report(datast);
		}
	}
}
//ファイルへ保存
function downloadCode() {
    //文字プログラムに変換
    outputProData();
    //転送データに変換
    changeSendData();
	//改行コードを-に統一
    var s_text  = document.getElementById('sendText').value.replace(/\r\n|\r|\n/g, '-');
	
	var xml = Blockly.Xml.workspaceToDom(workspace);
	var text = Blockly.Xml.domToText(xml);
	text = text + "\n" + report_txt() + "SEND=" + s_text;
	
	text += "\n" + create_share_list();
	//console.log(text);
	var result = prompt("ファイル名を入力してください");
	if (result == null){return;}

	const a = document.createElement('a');
	a.href = URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
	a.download = result + ".ud1";
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
//ファイルから読み込み
function uploadCode(datast) {
	var readdata ="";
	if (datast.indexOf("REPORT") != -1){
		readdata = datast.substring(0, datast.indexOf("REPORT"));
	}
	else{
		readdata = datast.substring(0, datast.indexOf("SEND="));	
	}
	//console.log(readdata);
	var xml = Blockly.Xml.textToDom(readdata);
	workspace.clear();
	Blockly.Xml.domToWorkspace(xml, workspace);

	//レポート内容が保存されていればセット
	set_report(datast);
}
//ストレージへ保存
function saveCode() {
	//プログラムの自動保存
	autosave();
	var savedPrefix = 'saved.hisatomi-ud1.blk.';    //ローカルストレージに保存する時のキー
	if ('localStorage' in window) {
        var name = null;
        while (!name) {
          name = window.prompt('プログラム名を入力してください');
          if (!name) { return; } // ignore if empty
          if (window.localStorage[savedPrefix + name]) {
            if (! window.confirm(name + ' は存在します。上書きしますか?')) {
              name = null;
            }
          }
        }
        name = savedPrefix + name;
        var xml = Blockly.Xml.workspaceToDom(workspace);
		var text = Blockly.Xml.domToText(xml);
		text = text + "\n" + report_txt();
		
        window.localStorage.setItem(name, text);
      }
}
//ストレージへ保存されたファイルの表示処理
function restoreBlocks() {
	var savedBlockPrefix = 'saved.hisatomi-ud1.blk.';
	if ('localStorage' in window) {
	  var modal = document.getElementById('restoreModal');
	  var list  = document.getElementById('restoreList');
	  var items = [];
	  for (var key in window.localStorage) {
		if (key.startsWith(savedBlockPrefix)) {
		  var keyBody = key.substr(savedBlockPrefix.length);
		  items.push(keyBody);
		}
	  }
	if (items.length == 0) {
		window.alert('保存されているプログラムはありません');
		return;
	}
	items.sort();
	var itemsHtml = '';
	for (var i = 0; i < items.length; i++) {
		itemsHtml += '<li><a onclick="restoreBlocksFrom(\'' +
					 items[i] + '\')">' + items[i] + '</a></li>';
		}
		list.innerHTML = itemsHtml;
		modal.style.display = 'block';
	}
}
//ストレージから読み込み
function restoreBlocksFrom(name) {
	var savedBlockPrefix = 'saved.hisatomi-ud1.blk.';
	var modal = document.getElementById('restoreModal');
	modal.style.display = 'none';
	if (!name) { return; } // ignore if empty
	if (window.localStorage[savedBlockPrefix + name]) {
		name = savedBlockPrefix + name;
		
		var readdata =　"";
		var datast =　window.localStorage[name];
		if (datast.indexOf("REPORT") != -1){
			readdata = datast.substring(0, datast.indexOf("REPORT"));
		}
		else{
			readdata = datast;
		}		
		var xml = Blockly.Xml.textToDom(readdata);
		if (xml != ""){
			workspace.clear();
			Blockly.Xml.domToWorkspace(xml, workspace);
		}
		//レポート内容が保存されていればセット
		set_report(datast);
	} else {
		window.alert('Error: ' + name + ' がありません');
	}
}
function cancelRestoreBlocks() {
	var modal = document.getElementById('restoreModal');
	modal.style.display = 'none';
}
function pressCancelRestoreBlocks(event) {
	var modal = document.getElementById('restoreModal');
	if (event.target == modal) {
		cancelRestoreBlocks();
	}
}
//ファイルへ保存(iPad用)
function downloadCode_ipad() {
	//プログラムの自動保存
	autosave();
    //文字プログラムに変換
    outputProData();
    //転送データに変換
    changeSendData();
	//改行コードを-に統一
    var s_text  = document.getElementById('sendText').value.replace(/\r\n|\r|\n/g, '-');
	
	var xml = Blockly.Xml.workspaceToDom(workspace);
	var text = Blockly.Xml.domToText(xml);
	text = text + "\n" + report_txt() + "SEND=" + s_text;
	
	text += "\n" + create_share_list();
	
	var result = prompt("ファイル名を入力してください");
	if (result == null){return;}

	const a = document.getElementById("filesave");
	a.href = URL.createObjectURL(new Blob([text], {type: 'application/octet-stream'}));
	a.download = result + ".ud1";
	window.location.reload();
}

//レポート内容があれば代入
function set_report(datast){
	if (datast.indexOf("REPORT") != -1){
		var text = datast.replace(/\r\n|\r/g, "\n");		
        var lines = text.split( '\n' );
		var flag = false;
		for  (var i = 0; i < lines.length; i++) {
			if (lines[i] == "REPORT"){
				flag = true;
				continue;
			}
			if (lines[i].indexOf("SEND=") != -1){
				flag = false;
				return;
			}
			if (flag) {
				var shosai = lines[i].split('=');
				if (lines[i].indexOf("nen=") != -1){
					document.getElementById('print_nen').value = shosai[1];
				}
				else if (lines[i].indexOf("kumi=") != -1){
					document.getElementById('print_kumi').value = shosai[1];
				}
				else if (lines[i].indexOf("ban=") != -1){
					document.getElementById('print_ban').value = shosai[1];
				}
				else if (lines[i].indexOf("name=") != -1){
					document.getElementById('print_name').value = shosai[1];
				}
				else if (lines[i].indexOf("title=") != -1){
					document.getElementById('print_title').value = shosai[1];
				}
				else if (lines[i].indexOf("koso=") != -1){
					document.getElementById('print-text-koso').value = shosai[1].replace(/<br>/g, '\n');
				}
				else if (lines[i].indexOf("siyo=") != -1){
					document.getElementById('print-text-siyo').value = shosai[1].replace(/<br>/g, '\n');
				}
				else if (lines[i].indexOf("kuhu=") != -1){
					document.getElementById('print-text-kuhu').value = shosai[1].replace(/<br>/g, '\n');
				}
				else if (lines[i].indexOf("kanso=") != -1){
					document.getElementById('print-text-kanso').value = shosai[1].replace(/<br>/g, '\n');
					return;
				}
			}
		}
	}
}

//ブラウザへ保存したプログラムの削除
function delete_restoreBlocks(){
	var savedBlockPrefix = 'saved.hisatomi-ud1.blk.';
	if ('localStorage' in window) {
	  var modal = document.getElementById('delete_restoreModal');
	  var list  = document.getElementById('delete_restoreList');
	  var items = [];
	  for (var key in window.localStorage) {
		if (key.startsWith(savedBlockPrefix)) {
		  var keyBody = key.substr(savedBlockPrefix.length);
		  items.push(keyBody);
		}
	  }
	if (items.length == 0) {
		window.alert('保存されているプログラムはありません');
		return;
	}
	items.sort();
	var itemsHtml = '';
	for (var i = 0; i < items.length; i++) {
		itemsHtml += '<li><a onclick="delete_restoreBlocksFrom(\'' +
					 items[i] + '\')">' + items[i] + '</a></li>';
		}
		list.innerHTML = itemsHtml;
		modal.style.display = 'block';
	}
}
//ストレージから削除
function delete_restoreBlocksFrom(name) {
	var savedBlockPrefix = 'saved.hisatomi-ud1.blk.';
	var modal = document.getElementById('delete_restoreModal');
	modal.style.display = 'none';
	if (!name) { return; } // ignore if empty
	if (window.localStorage[savedBlockPrefix + name]) {
		name = savedBlockPrefix + name;
		localStorage.removeItem(name);
		
	} else {
		window.alert('Error: ' + name + ' がありません');
	}
}
function delete_cancelRestoreBlocks() {
	var modal = document.getElementById('delete_restoreModal');
	modal.style.display = 'none';
}
function pressCancelRestoreBlocks(event) {
	var modal = document.getElementById('delete_restoreModal');
	if (event.target == modal) {
		delete_cancelRestoreBlocks();
	}
}