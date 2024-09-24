


/**************************************
 * webAudioの初期化
 * ここは、そのままで
**************************************/
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var channels = 2;
audioCtx.sampleRate = 44100;
var frameCount = audioCtx.sampleRate * 20.0
var myArrayBuffer = audioCtx.createBuffer(2,frameCount,audioCtx.sampleRate);


/*************************************
 * 
 * 送信用のデータを入れる配列
 * 
 * 1度に送信できるデータは、最大32バイトまで。
 * それ以上のデータの場合は、分割して送ること。
 * 送信前に、0で初期化する。
 * 送信データが32バイト未満のときは、必要な分だけ入力し、
 * 以降は、"0"のままで良い。（例2参照）
 * 
 * 識別用のデータ(2 or 3バイト)　+　転送データ(32バイト)
 * 識別用のデータ
 * 
 * sendDataArray[0] = 253;  :iPadモード
 * sendDataArray[1] = 1-4;
 *                      1:LEDデータ転送
 *                      2:LED実行
 *                      3:音データ転送
 *                      4:音実行
 * sendDataArray[2] = 1-4;
 *                      1:　最初の32バイトのデータ（1ブロック）
 *                      2:　次の32バイトのデータ（2ブロック）
 *                      3:　次の32バイトのデータ（3ブロック）
 *                      4:　次の32バイトのデータ（4ブロック）
 * 例1:
 * sendDataArray.fill(0);       :0で初期化
 * sendDataArray[0] = 253;      :iPadモード
 * sendDataArray[1] = 1;        :LEDデータ転送開始
 * sendDataArray[2] = 1;        :最初の32バイト転送
 * sendDataArray[3] = 230;      :最初のデータ
 *  ......
 * 
 * 例2:
 * sendDataArray.fill(0);       :0で初期化
 * sendDataArray[0] = 253;      :iPadモード
 * sendDataArray[1] = 3;        :音データ転送開始
 * sendDataArray[2] = 3;        :3ブロック目のデータを転送
 * sendDataArray[3] = 90;       :音符の”90”
 * sendDataArray[4] = 250;      :最終データ 以降は、入力しなくて良い
 * (sendDataArray[5] = 0;)      :最初に0で初期化しているので、以降は0になってる
 * 
 * 例3:
 * sendDataArray.fill(0);       :0で初期化
 * sendDataArray[0] = 253;      :iPadモード
 * sendDataArray[1] = 2;        :LED実行　　実行は、"253","2"だけ送れば良い
 * 
**************************************/
//送信用のデータの入った配列
//let sendDataArray = Array(19);
//let sendDataArray = Array(24);      //Bluetooth版のとき最初の4つ分が無視される

/**************************************
 * データの転送方法
 * sendDataArray配列に、転送用のデータを入力後、
 * 下記のように関数を呼び出す。
 * sendDataBySound(sendDataArray);
 * 
 * 複数回呼び出す場合は、500ミリ秒ほど空けてほしい
 * sendDataBySound(sendDataArray1);
 * wait500ms();      //PICへ書き込む時間
 * sendDataBySound(sendDataArray2);
 * 
 **************************************/

/**************************************
 * 接続処理
 * 最初の音声データが乱れるので、ダミーのデータを送る
 * iPadに接続し直したときには、最初に行う
 * 0を送る
**************************************/
// function connect_iPad(){
//     sendDataArray.fill(0);
//     //sendDataArray[0] = 253;
//     //sendDataArray[1] = 5;
//     sendDataArray[0] = 0;
//     sendDataArray[1] = 1;
//     sendDataArray[2] = 2;
//     sendDataArray[3] = 3;
//     sendDataArray[4] = 253;
//     sendDataArray[5] = 5;
//     sendDataArray[6] = 6;
//     // sendDataArray[7] = 7;
//     // sendDataArray[8] = 8;
//     // sendDataArray[9] = 9;
//     // sendDataArray[10] = 10;
//     // sendDataArray[11] = 11;
//     // sendDataArray[12] = 12;
//     // sendDataArray[13] = 13;
//     // sendDataArray[14] = 14;
//     // sendDataArray[15] = 15;
//     // sendDataArray[16] = 16;
//     // sendDataArray[17] = 17;
//     // sendDataArray[18] = 18;
//     // sendDataArray[19] = 19;
//     // sendDataArray[20] = 20;
//     // sendDataArray[21] = 21;
//     // sendDataArray[22] = 22;
//     // sendDataArray[23] = 23;
//     sendDataBySound(sendDataArray);
// }
function connect_iPad(){
    //let sendDataArray = Array(24);      //Bluetooth版のとき最初の4つ分が無視される
    let sendDataArray = Array(19);      //BT-01
    sendDataArray.fill(0);
  //WLのICを使った場合はうまくいく    
/*     sendDataArray[0] = 253;   //ダミーデータ
    sendDataArray[1] = 1;
    sendDataArray[2] = 2;
    sendDataArray[3] = 3;   //ここまで
    sendDataArray[4] = 4;
    sendDataArray[5] = 253;
    sendDataArray[6] = 5; */
    console.log("送信開始")

    sendDataArray[0] = 253;
    sendDataArray[1] = 5;

/*     sendDataArray[0] = 170;
     sendDataArray[1] = 1;
     sendDataArray[2] = 2;
     sendDataArray[3] = 3;
     sendDataArray[4] = 4;
     sendDataArray[5] = 5;
     sendDataArray[6] = 6;
     sendDataArray[7] = 7;
     sendDataArray[8] = 8;
     sendDataArray[9] = 9;
     sendDataArray[10] = 10;
     sendDataArray[11] = 11;
     sendDataArray[12] = 12;
     sendDataArray[13] = 13;
     sendDataArray[14] = 14;
     sendDataArray[15] = 15;
     sendDataArray[16] = 16;
     sendDataArray[17] = 17;
     sendDataArray[18] = 18;
     sendDataArray[19] = 19;
     sendDataArray[20] = 20;
     sendDataArray[21] = 21;
     sendDataArray[22] = 22;
     sendDataArray[23] = 23;

     console.log("昇進終了")
*/     

    sendDataBySound(sendDataArray);
    console.log("送信終了です")
}
/*
//テスト用
function soundRed(){
    sendDataArray.fill(0);      //0で初期化
    sendDataArray[0] = 253;     //iPadモード
    sendDataArray[1] = 1;       //LEDデータ転送開始
    sendDataArray[2] = 1;       //ブロック1へデータ書き込む
    sendDataArray[3] = 230;     //以下、LEDの点灯データ
    sendDataArray[4] = 2;
    sendDataArray[5] = 126;
    sendDataArray[6] = 0;
    sendDataArray[7] = 1;
    sendDataArray[8] = 0;
    sendDataArray[9] = 7;
    sendDataArray[10] = 1;
    sendDataArray[11] = 248;
    sendDataArray[12] = 1;
    sendDataArray[13] = 0;
    sendDataArray[14] = 12;
    sendDataArray[15] = 0;
    sendDataArray[16] = 7;
    sendDataArray[17] = 225;
    sendDataArray[18] = 0;
    sendDataArray[19] = 17;
    sendDataArray[20] = 231; 
    
    sendDataBySound(sendDataArray);     //スピーカー出力
    //console.log(sendDataArray);    
}

function sendWhite(){
    sendDataArray.fill(0);
    sendDataArray[0] = 253;
    sendDataArray[1] = 1;
    sendDataArray[2] = 1;
    sendDataArray[3] = 230;
    sendDataArray[4] = 2;
    sendDataArray[5] = 127;
    sendDataArray[6] = 255;
    sendDataArray[7] = 225;
    sendDataArray[8] = 0;
    sendDataArray[9] = 7;
    sendDataArray[10] = 126;
    sendDataArray[11] = 7;
    sendDataArray[12] = 225;
    sendDataArray[13] = 0;
    sendDataArray[14] = 12;
    sendDataArray[15] = 127;
    sendDataArray[16] = 248;
    sendDataArray[17] = 1;
    sendDataArray[18] = 0;
    sendDataArray[19] = 17;
    sendDataArray[20] = 231; 
    sendDataBySound(sendDataArray);
    //console.log(sendDataArray);
}

function sendLoop(){
    sendDataArray.fill(0);
    sendDataArray[0] = 253;
    sendDataArray[1] = 1;
    sendDataArray[2] = 1;
    sendDataArray[3] = 230;
    sendDataArray[4] = 2;
    sendDataArray[5] = 190;
    sendDataArray[6] = 3;
    sendDataArray[7] = 5;
    sendDataArray[8] = 1;
    sendDataArray[9] = 248;
    sendDataArray[10] = 0;
    sendDataArray[11] = 64;
    sendDataArray[12] = 10;
    sendDataArray[13] = 0;
    sendDataArray[14] = 7;
    sendDataArray[15] = 224;
    sendDataArray[16] = 64;
    sendDataArray[17] = 15;
    sendDataArray[18] = 127;
    sendDataArray[19] = 255;
    sendDataArray[20] = 224;
    sendDataArray[21] = 64;
    sendDataArray[22] = 20;
    sendDataArray[23] = 191;
    sendDataArray[24] = 22;
    sendDataArray[25] = 231;
    sendDataBySound(sendDataArray);
}
*/
//有線版の場合
// function soundRun() {
//     sendDataArray.fill(0);
//     //実行
//     sendDataArray[0] = 253;             //iPadモード
//     sendDataArray[1] = 2;               //実行
//                                         //以降の配列は、0が入っているので、そのままで良い
//     sendDataBySound(sendDataArray);
//     //console.log(sendDataArray);
// }
//Bluetooth版
function soundRun() {
    sendDataArray.fill(0);
    //実行
    sendDataArray[0] = 253;             //iPadモード
    sendDataArray[1] = 2;               //実行
                                        //以降の配列は、0が入っているので、そのままで良い
    sendDataBySound(sendDataArray);
    //console.log(sendDataArray);
}

/*******************************************
    送信用データの受け取り、音データに変換して、送信する

    引数のarrayDataに、送信用のデータを配列で渡す
    例: arrayData = [230,2,126,0,....]
    arrayDataに入れる配列の要素数はいくらでも良い

    内部で呼び出した関数が、音声出力処理まで行っている

*******************************************/
function sendDataBySound(arrayData) {
    //送信データをビットの配列に変換
    //map関数を使って、binarryDataArrayにデータを保存する
    let binaryDataArray = arrayData.map(getBinary);
    console.log(binaryDataArray);
    //ビットの配列をサウンドデータに変換して出力
    outputSoundData(binaryDataArray);
}

/*******************************************
    1バイトのデータを8文字分の0/1に変換する
    getBinary(10) -> return [0,0,0,0,1,0,1,0]
    10を入れたら、10を2進数に変換した0b00001010の配列を返す
*******************************************/
function getBinary(arrayData){
    var tmp = arrayData;
    let returnData = Array(8);
    //var returnData;

    for(let i=0; i<8; i++){
        tmp = tmp & 0b10000000;     //最上位ビットが1かどうかを確認
        if(tmp == 0){
            returnData[i] = 0;      //0だった
        } else {
            returnData[i] = 1;      //1だった
        }
        arrayData = arrayData << 1;           //次のビットを確認
        tmp = arrayData;
    }
    return returnData;      //バイトデータをビットの配列に変換したデータを返す
}

/*******************************************
    引数のビットのデータを0/1に応じて、サウンドデータに変換する
    スタートビットを出力後、１バイト分のデータを出力する
    if文が冗長なのは調整用のため

    最後にできた配列をwebAudioの出力バッファに入れて、出力する
*******************************************/
function outputSoundData(binaryDataArray) {
	/*var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var channels = 2;
	audioCtx.sampleRate = 44100;
	var frameCount = audioCtx.sampleRate * 20.0
	var myArrayBuffer = audioCtx.createBuffer(2,frameCount,audioCtx.sampleRate);*/
    //console.log(binaryDataArray);
    //let newArray = new Array();
    var newArray = myArrayBuffer.getChannelData(0);     //変換データを保存する配列
    let counter = 0;    //8ビット数えるためのカウンタ
    let i = 0;  //出力用の配列の現在値
    var tmp = 0;
    //console.log(newArray);
    binaryDataArray.forEach(element => {
        element.map(x => {
            //スタートビット
             if((counter % 8) == 0) {
                //ダミービット
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 0;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 1;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 0;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 1;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 0;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 1;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 0;
                }
                tmp = 5;
                while(i++ < tmp){
                    newArray[i] = 1;
                }
                //スタートビット
                tmp = 20;  //元の値
                while(i++ < tmp){
                    newArray[i] = 0;      //iPadイヤホンジャック出力の場合
                    //newArray[i] = 1;    //出力を反転してみた
                }
                tmp = i + 30;
                while(i++ < tmp){
                    newArray[i] = 1;
                    //newArray[i] = 0;
                }
            }
            if(x == 0){
                tmp = i + 5;  //元データ
                //tmp = i + 10;  //ちょっと大きかった
                //tmp = i + 8;
                //tmp = i + 8;
                while(i++ < tmp){
                    newArray[i] = 0;
                    //newArray[i] = 1;
                }
                tmp = i + 5;
                //tmp = i + 10;
                //tmp = i + 8;
                while(i++ < tmp){
                    newArray[i] = 1;
                    //newArray[i] = 0;
                 }
            } else {
                tmp = i + 5;
                //tmp = i + 10;
                //tmp = i + 8;
                while(i++ < tmp){
                    newArray[i] = 0;
                    //newArray[i] = 1;
                }
                tmp = i + 15;
                //tmp = i + 30;
                //tmp = i + 22;
                while(i++ < tmp){
                    newArray[i] = 1;
                    //newArray[i] = 0;
                }
            }
            counter++;
            //ストップビット
            if((counter % 8) == 0) {
                tmp = i+20;  //元の値
                //tmp = i + 25;
                //tmp = i + 30;
               while(i++ < tmp){
                    newArray[i] = 0;
                    //newArray[i] = 1;
               }
            }
        })
    });
    console.log(newArray);
    var source = audioCtx.createBufferSource();     //出力用のバッファを作成
    source.buffer = myArrayBuffer;                  //出力用のバッファに変換したデータを入れる
    source.connect(audioCtx.destination);           //出力先に接続する
    source.start();                                 //再生開始
}



