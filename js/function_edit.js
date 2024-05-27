//転送データに変換
function getSenddata(){
    //改行コードを\nに統一
    var text  = document.getElementById('proText').value.replace(/\r\n|\r/g, "\n");
    var lines = text.split( '\n' );
    var outArray = new Array();
    var LevelCount = 0;
    var Byte_Address = 0;
	var in_pro = false;//start命令でtrue 空白行でfalse
    for ( var i = 0; i < lines.length; i++ ) {
        lines[i] = lines[i].trim();	
        // 空行があれば終了
        if (in_pro == true){
		  if ( lines[i] == '' || i == lines.length - 1) {
              outArray.push( "231\n"); 
              //outArray.push( "250\n");  
              break;
		  }
        }
		//start命令でフラグをたて分析開始
		if (in_pro == false){
			if (lines[i] == "start"){
				in_pro = true;				
			}
			else{
				continue;
			}
		}
        if (lines[i] == "start"){
            outArray.push( "230\n");
            Byte_Address =Byte_Address + 2;             
        }
        else if (lines[i] == "end"){
            outArray.push( "231\n"); 
            //outArray.push( "250\n");  
            break;
        }
        else if (lines[i].indexOf('turnOn') != -1){
            var paraall = "";
            var paratime = strSplit(lines[i], 1, " "); 
            paratime = paratime / 0.25;
			outArray.push( "130\n");
            if(lines[i].indexOf('Red') != -1){                
                paraall = get_colordata("Red") + paratime;
            }
            else if(lines[i].indexOf('Green') != -1){                
                paraall = get_colordata("Green") + paratime;                            
            }
            else if(lines[i].indexOf('Blue') != -1){                
                paraall = get_colordata("Blue") + paratime;     
            }
            else if(lines[i].indexOf('Yellow') != -1){                
                paraall = get_colordata("Yellow") + paratime;     
            }
            else if(lines[i].indexOf('Purple') != -1){                
                paraall = get_colordata("Purple") + paratime;     
            }
            else if(lines[i].indexOf('Lightblue') != -1){                
                paraall = get_colordata("LighrBlue") + paratime;     
            }
            else if(lines[i].indexOf('White') != -1){                
                paraall = get_colordata("White") + paratime;     
            }          
            else if(lines[i].indexOf('Off') != -1){                
                paraall = get_colordata("Off") + paratime;     
            }                      
            var paraarray = paraall.split( ' ' );			
            for ( var j = 0; j < paraarray.length; j++ ) {          
                outArray.push( paraarray[j] + "\n");
				//console.log(jusin);
            }
            Byte_Address =Byte_Address + 6;
        }
        else if (lines[i].indexOf('led_point') != -1){
			var coloedata = strSplit(lines[i], 1, " "); 
            var paratime = strSplit(lines[i], 2, " "); 
            paratime = paratime / 0.25;
			
			outArray.push( "130\n");
			outArray.push( parseInt(coloedata.substring(1,3), 16) + "\n");
			outArray.push( parseInt(coloedata.substring(3,5), 16) + "\n");
			outArray.push( parseInt(coloedata.substring(5,7), 16) + "\n");
			outArray.push( paratime + "\n");
			
            Byte_Address =Byte_Address + 6;
		}
        else if (lines[i].indexOf('led_rgb') != -1){
			var c_r = strSplit(lines[i], 1, " "); 
			var c_g = strSplit(lines[i], 2, " "); 
			var c_b = strSplit(lines[i], 3, " "); 
            var paratime = strSplit(lines[i], 4, " ");
            paratime = paratime / 0.25;
			
			outArray.push( "130\n");
			outArray.push( c_r + "\n");
			outArray.push( c_g + "\n");
			outArray.push( c_b + "\n");
			outArray.push( paratime + "\n");
			
            Byte_Address =Byte_Address + 6;
		}
        else if (lines[i].indexOf('turnFade') != -1){			
            var para = strSplit(lines[i], 1, " "); 
			if (para == "f_in"){outArray.push( "131\n"); }
			else{{outArray.push( "132\n"); }}
			
			if(lines[i].indexOf('Red') != -1){                
                paraall = get_colordata("Red") + "4";
            }
            else if(lines[i].indexOf('Green') != -1){                
                paraall = get_colordata("Green") + "4";                            
            }
            else if(lines[i].indexOf('Blue') != -1){                
                paraall = get_colordata("Blue") + "4";     
            }
            else if(lines[i].indexOf('Yellow') != -1){                
                paraall = get_colordata("Yellow") + "4";     
            }
            else if(lines[i].indexOf('Purple') != -1){                
                paraall = get_colordata("Purple") + "4";     
            }
            else if(lines[i].indexOf('Lightblue') != -1){                
                paraall = get_colordata("LighrBlue") + "4";     
            }
            else if(lines[i].indexOf('White') != -1){                
                paraall = get_colordata("White") + "4";     
            }
			
			var c_r = strSplit(paraall, 0, " "); 
			var c_g = strSplit(paraall, 1, " "); 
			var c_b = strSplit(paraall, 2, " "); 
            //var paratime = strSplit(paraall, 3, " ");
			
			outArray.push( c_r + "\n");
			outArray.push( c_g + "\n");
			outArray.push( c_b + "\n");
			//outArray.push( paratime + "\n");
            Byte_Address =Byte_Address + 5;
		}
        else if (lines[i].indexOf('keepon') != -1){
            if(lines[i].indexOf('Off') != -1){
                outArray.push( "136\n");
                Byte_Address =Byte_Address + 2;      
            }
            else{
                outArray.push( "135\n");
                if(lines[i].indexOf('Red') != -1){
                    outArray.push( "0\n");            
                }
                else if(lines[i].indexOf('Green') != -1){
                    outArray.push( "1\n");            
                }
                else if(lines[i].indexOf('Blue') != -1){
                    outArray.push( "2\n");            
                }
                else if(lines[i].indexOf('Yellow') != -1){
                    outArray.push( "3\n");            
                }
                else if(lines[i].indexOf('Purple') != -1){
                    outArray.push( "4\n");            
                }
                else if(lines[i].indexOf('Lightblue') != -1){
                    outArray.push( "5\n");            
                }
                else if(lines[i].indexOf('White') != -1){
                    outArray.push( "6\n");            
                }
                Byte_Address =Byte_Address + 3;
            }
        }
        else if (lines[i].indexOf('turnBacklight') != -1){
            if(lines[i].indexOf('On') != -1){
                outArray.push( "140\n");
                outArray.push( "100\n");
                var para1 = strSplit(lines[i], 1, " ");
				para1 = para1 / 0.25;
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 4;
            }
            else if(lines[i].indexOf('Conti') != -1){
                outArray.push( "141\n");
                Byte_Address =Byte_Address + 2;
            }
            else if(lines[i].indexOf('Off') != -1){
                outArray.push( "142\n");
                Byte_Address =Byte_Address + 2;
            }
        }
        else if (lines[i].indexOf('play') != -1){
            if(lines[i].indexOf('Kakunin1') != -1){
                outArray.push( "150\n");
            }
            else if(lines[i].indexOf('Kakunin2') != -1){
                outArray.push( "151\n");
            }
            else if(lines[i].indexOf('Kakunin3') != -1){
                outArray.push( "152\n");
            }
            else if(lines[i].indexOf('Sounddata') != -1){
                outArray.push( "153\n");
                outArray.push( "1\n");
            }    
            else if(lines[i].indexOf('alarmSound') != -1){
                outArray.push( "159\n");
            }         
			if(lines[i].indexOf('Sounddata') != -1){
            	Byte_Address =Byte_Address + 3;
			}
			else{
            	Byte_Address =Byte_Address + 2;				
			}
        }
        else if (lines[i].indexOf('output') != -1){
            if(lines[i].indexOf('Signal') != -1){
                outArray.push( "210\n");
            }      
            Byte_Address =Byte_Address + 2;
        }
        else if (lines[i].indexOf('turnTimer') != -1){
            if(lines[i].indexOf('turnTimerFor') != -1){
                outArray.push( "160\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 3;
            }
            else if(lines[i].indexOf('turnTimerSoundFor') != -1){
                outArray.push( "161\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 3;
            }
            else if(lines[i].indexOf('turnTimerSWFor') != -1){
                outArray.push( "162\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 3;
            }
            else if(lines[i].indexOf('turnTimerLightFor') != -1){
                outArray.push( "163\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                var para2 = strSplit(lines[i], 3, " ");
                outArray.push( para2 + "\n"); 
                Byte_Address =Byte_Address + 4;
            }
            else if(lines[i].indexOf('turnTimerDarkFor') != -1){
                outArray.push( "164\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                var para2 = strSplit(lines[i], 3, " ");
                outArray.push( para2 + "\n"); 
                Byte_Address =Byte_Address + 4;
            }
        }
        else if (lines[i].indexOf('wait') != -1){
            if(lines[i].indexOf('Sound') != -1){
                outArray.push( "170\n");
                Byte_Address =Byte_Address + 2;
            }
            else if(lines[i].indexOf('SW') != -1){
                outArray.push( "171\n");
                Byte_Address =Byte_Address + 2;
            }
            else if(lines[i].indexOf('Light') != -1){
                outArray.push( "177\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 3;
            }
            else if(lines[i].indexOf('Dark') != -1){
                outArray.push( "178\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                Byte_Address =Byte_Address + 3;
            }
            else if(lines[i].indexOf('Clock') != -1){
                outArray.push( "179\n");
                var para1 = strSplit(lines[i], 2, " ");
                outArray.push( para1 + "\n"); 
                var para2 = strSplit(lines[i], 3, " ");
                outArray.push( para2 + "\n"); 
                Byte_Address =Byte_Address + 4;
            }
            else if(lines[i].indexOf('Signal') != -1){
                outArray.push( "175\n");
                Byte_Address =Byte_Address + 2;
            }
            else if(lines[i].indexOf('Alerm') != -1){
                outArray.push( "176\n");
                Byte_Address =Byte_Address + 2;
            }
        }
        else if (lines[i].indexOf('doRepeat') != -1){
            outArray.push( "190\n");
            var para1 = strSplit(lines[i], 1, " ");
            outArray.push( para1 + "\n");
            Byte_Address =Byte_Address + 3;
        }
        else if (lines[i].indexOf('endloop') != -1){
            outArray.push( "191\n");
            Byte_Address =Byte_Address + 2;
        }
        else if (lines[i].indexOf('doIf') != -1){
            var para1 = strSplit(lines[i], 1, " ");	 
            if (para1 == "swon"){                
                outArray.push( "180\n");
                Byte_Address =Byte_Address + 3;
            }
            else if (para1 == "swoff"){                
                outArray.push( "181\n");
                Byte_Address =Byte_Address + 3;
            }
            else if (para1.indexOf('light>=') != -1 || para1.indexOf('light<') != -1) {
                if (para1.indexOf('light>=') != -1){
                    var parapara = strSplit(lines[i], 2, " ");
                    outArray.push( "205\n");                    
                    outArray.push( parapara + "\n");                    
                }
                else if (para1.indexOf('light<') != -1){
                    var parapara = strSplit(lines[i], 2, " ");      
                    outArray.push( "206\n");                    
                    outArray.push( parapara + "\n");                    
                }      
                Byte_Address =Byte_Address + 4;
            }
			else{
				if (para1.indexOf('beforetime') != -1){
                    var parapara = strSplit(lines[i], 2, " ");
                    var parapara2 = strSplit(lines[i], 3, " ");
                    outArray.push( "182\n");                    
                    outArray.push( parapara + "\n");
                    outArray.push( parapara2 + "\n");       
                }
                else if (para1.indexOf('aftertime') != -1){
                    var parapara = strSplit(lines[i], 2, " ");
                    var parapara2 = strSplit(lines[i], 3, " ");    
                    outArray.push( "183\n");                    
                    outArray.push( parapara + "\n");
                    outArray.push( parapara2 + "\n"); 
                }      
                Byte_Address =Byte_Address + 5;
			}
            outArray.push( Byte_Address + "\n");
            LevelCount++;
            outArray.push(String(LevelCount) + "-" + String(i) + "\n");
            continue;
        }
        else if (lines[i].indexOf('else') != -1){
            LevelCount++;
            for ( var j = 0; j < outArray.length; j++ ) {
                if (outArray[j].indexOf(String(LevelCount - 1) + "-") != -1){
                    outArray[j] = String(Byte_Address) + "\n";
                    break;
                }
            }   
            continue;
        }
        //elseのないendif
        else if (lines[i].indexOf('endif1') != -1){
            LevelCount = LevelCount - 1;
            for ( var j = 0; j < outArray.length; j++ ) {
                if (outArray[j].indexOf(String(LevelCount + 1) + "-") != -1){
                    outArray[j] = String(Byte_Address) + "\n";
                    break;
                }
            }   
            continue;
        }
        //elseのあるendif
        else if (lines[i].indexOf('endif2') != -1){
            LevelCount = LevelCount - 2;
            for ( var j = 0; j < outArray.length; j++ ) {
                if (outArray[j].indexOf(String(LevelCount + 1) + "-") != -1){
                    outArray[j] = String(Byte_Address) + "\n";
                    break;
                }
            }   
            continue;
        }
        
        if (i < lines.length - 2){
            if (lines[i + 1].indexOf('else') != -1){
                outArray.push( String(LevelCount) + "-" + String(i) + "\n");
                continue;
            }
        }		
		  		
        outArray.push( Byte_Address + "\n");		
		
    }
    return outArray.join('');
}
//各コマンドの開始アドレスを保持
function get_head_address(dataarray){
	var add_list = new Array();
	var totalcnt=0;
	for ( var i = 0; i < dataarray.length; i++ ) {
        dataarray[i] = dataarray[i].trim();		
        if (dataarray[i].indexOf('else') != -1 || dataarray[i].indexOf('endif') != -1){
			add_list.push("");
			continue;
        }
		
		add_list.push( totalcnt.toString());
		
		if (dataarray[i] == "start"){			
            totalcnt += 2;
		}
        else if (dataarray[i].indexOf('turnOn') != -1){
            totalcnt += 6;
        }
        else if (dataarray[i].indexOf('led_point') != -1){
			totalcnt += 6;
		}
        else if (dataarray[i].indexOf('led_rgb') != -1){
			totalcnt += 6;
		}
        else if (dataarray[i].indexOf('turnFade') != -1){			
           totalcnt += 5;
		}
        else if (dataarray[i].indexOf('keepon') != -1){
            if(dataarray[i].indexOf('Off') != -1){
                totalcnt += 2;   
            }
            else{
                totalcnt += 3;
            }
        }
        else if (dataarray[i].indexOf('turnBacklight') != -1){
            if(dataarray[i].indexOf('On') != -1){
                totalcnt += 4;
            }
            else if(dataarray[i].indexOf('Conti') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('Off') != -1){
                totalcnt += 2;
            }
        }
        else if (dataarray[i].indexOf('play') != -1){
			if(dataarray[i].indexOf('Sounddata') != -1){
                totalcnt += 3;
            }
			else{
            	totalcnt += 2;
			}
        }
        else if (dataarray[i].indexOf('output') != -1){
            if(dataarray[i].indexOf('outputSignal') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('outputdc_time') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('outputdc_cont') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('outputdc_off') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('outputmame_time') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('outputmame_cont') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('outputmame_off') != -1){
                totalcnt += 2;
            }			
        }
        else if (dataarray[i].indexOf('turnTimer') != -1){
            if(dataarray[i].indexOf('turnTimerFor') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('turnTimerSoundFor') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('turnTimerSWFor') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('turnTimerLightFor') != -1){
                totalcnt += 4;
            }
            else if(dataarray[i].indexOf('turnTimerDarkFor') != -1){
                totalcnt += 4;
            }
        }
        else if (dataarray[i].indexOf('wait') != -1){
            if(dataarray[i].indexOf('Sound') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('SW') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('Light') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('Dark') != -1){
                totalcnt += 3;
            }
            else if(dataarray[i].indexOf('Clock') != -1){
                totalcnt += 4;
            }
            else if(dataarray[i].indexOf('Signal') != -1){
                totalcnt += 2;
            }
            else if(dataarray[i].indexOf('Alerm') != -1){
                totalcnt += 2;
            }
        }
        else if (dataarray[i].indexOf('doRepeat') != -1){
                totalcnt += 3;
        }
        else if (dataarray[i].indexOf('endloop') != -1){
                totalcnt += 2;
        }
        else if (dataarray[i].indexOf('doIf') != -1){
            var para1 = strSplit(dataarray[i], 1, " ");	 
            if (para1 == "swon"){       
                totalcnt += 3;
            }
            else if (para1 == "swoff"){    
                totalcnt += 3;
            }
            else if (para1.indexOf('light>=') != -1){
                totalcnt += 4;
            }
            else if (para1.indexOf('light<') != -1){
                totalcnt += 4;
            }
            else if (para1.indexOf('beforetime') != -1){
                totalcnt += 5;
            }
            else if (para1.indexOf('aftertime') != -1){
                totalcnt += 5;
            }
        }
    }
	return add_list;
}
