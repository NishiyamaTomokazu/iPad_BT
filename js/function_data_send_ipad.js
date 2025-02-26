//転送処理(iPad)
function sendHID_iPad() {    
    setupEventListeners();
    resumeAudioContext();
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


///////////
//ここから追加
///////////
// DOM要素の取得
const numberDisplay = document.getElementById('numberDisplay');
const editButton = document.getElementById('editButton');
const editModal = document.getElementById('editModal');
const numberInput = document.getElementById('numberInput');
const cancelButton = document.getElementById('cancelButton');
const saveButton = document.getElementById('saveButton');
const soundLinks = document.querySelectorAll('.sound-link');
const statusMessage = document.getElementById('statusMessage');

// オーディオシステムの初期化
function initAudioSystem() {
    try {
        // 既存のコンテキストを閉じる
        if (audioContext) {
            audioContext.close();
        }
        
        // 新しいオーディオコンテキストを作成
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("オーディオシステムが初期化されました");
        
        if (audioContext.state === "running") {
            audioInitialized = true;
            updateStatus("オーディオシステム準備完了");
        } else {
            updateStatus("次のタップで音が有効になります");
        }
        
        return true;
    } catch (error) {
        console.error("オーディオシステムの初期化に失敗:", error);
        updateStatus("オーディオシステムの初期化に失敗しました");
        return false;
    }
}

function resumeAudioContext() {
    if (audioContext && audioContext.state !== 'running') {
        audioContext.resume().then(() => {
            console.log("オーディオコンテキストが再開されました");
            audioInitialized = true;
            updateStatus("音が有効になりました");
        }).catch(error => {
            console.error("オーディオコンテキストの再開に失敗:", error);
        });
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // 音声リンクのイベントリスナー
    soundLinks.forEach(link => {
        // 既存のリスナーを削除（重複を避けるため）
        link.removeEventListener('click', playSound);
        link.removeEventListener('touchstart', playSound);
        
        // 新しいリスナーを追加
        link.addEventListener('click', playSound);
        // iOS Safariではclickよりもtouchstartの方が反応が良い
        link.addEventListener('touchstart', playSound);
    });
    
    console.log("サウンドリンクのイベントリスナーが設定されました");
}

// 編集ボタンのイベントリスナー
    editButton.addEventListener('click', () => {
        numberInput.value = numberDisplay.textContent;
        editModal.style.display = 'flex';
    });

    // キャンセルボタンのイベントリスナー
    cancelButton.addEventListener('click', () => {
        editModal.style.display = 'none';
        // ダイアログを閉じる操作をユーザーインタラクションとして利用
        resumeAudioContext();
    });

    // ページ全体のタッチイベントでもオーディオを有効化
    document.body.addEventListener('touchstart', function() {
        if (!audioInitialized) {
            if (!audioContext) {
                initAudioSystem();
            }
            resumeAudioContext();
        }
    }, { once: false });

    // ページロード時の初期化
    window.addEventListener('DOMContentLoaded', () => {
        // 初期オーディオ設定
        initAudioSystem();
        setupEventListeners();
        
        // iOS SafariではDOMContentLoadedでも初期化できない場合があるので
        // 最初のユーザーインタラクションを待つメッセージを表示
        if (!audioInitialized) {
            updateStatus("画面をタップすると音が有効になります");
        }
    });


// ステータスメッセージを更新
function updateStatus(message) {
    statusMessage.textContent = message;
    // 5秒後にメッセージをクリア
    setTimeout(() => {
        if (statusMessage.textContent === message) {
            statusMessage.textContent = "";
        }
    }, 5000);
}

// ページ全体のタッチイベントでもオーディオを有効化
document.body.addEventListener('touchstart', function() {
    if (!audioInitialized) {
        if (!audioContext) {
            initAudioSystem();
        }
        resumeAudioContext();
    }
}, { once: false });