// 抓取哪一項元素
var rangeWrapper = document.querySelector('body');

// 滑鼠座標值
var mouseClick_Y = 0;
var mouseMove_Y  = 0; 

// 滑鼠狀況值
var mouseState = 0;
// 視窗狀況值
var modalState = 0; 

var importState = 0;

// 轉蛋機縮放值
var gashaponScale_X = 0;
var gashaponScale_Y = 0;

// 視窗高度
var windowsHeight = document.body.clientHeight;

// 轉蛋機ID
var itemId=[
  "#e0dj51prVt431_to","#e0dj51prVt432_to","#e0dj51prVt433_to","#e0dj51prVt434_to",
  // ------------------------------------------------------------------------- //
  // 旋鈕
  "#e0dj51prVt435_to","#e0dj51prVt438_tr","#e0dj51prVt439_tr","#e0dj51prVt440_tr",
  "#e0dj51prVt441_tr","#e0dj51prVt442_tr","#e0dj51prVt443_tr","#e0dj51prVt444_tr",
  "#e0dj51prVt445_tr","#e0dj51prVt446_tr","#e0dj51prVt447_tr","#e0dj51prVt448_tr",
  "#e0dj51prVt449_tr","#e0dj51prVt450_tr","#e0dj51prVt451_tr","#e0dj51prVt452_tr",
  // ------------------------------------------------------------------------- //
  // 扭蛋
  "#e0dj51prVt455_to","#e0dj51prVt455_tr","#e0dj51prVt458_to","#e0dj51prVt458_tr",
  "#e0dj51prVt461_to","#e0dj51prVt461_tr","#e0dj51prVt464_to","#e0dj51prVt464_tr",
  "#e0dj51prVt467_to","#e0dj51prVt467_tr","#e0dj51prVt470_to","#e0dj51prVt470_tr",
  "#e0dj51prVt473_to","#e0dj51prVt473_tr","#e0dj51prVt476_to","#e0dj51prVt476_tr",
  "#e0dj51prVt479_to","#e0dj51prVt479_tr","#e0dj51prVt482_to","#e0dj51prVt482_tr",
  "#e0dj51prVt485_to","#e0dj51prVt485_tr","#e0dj51prVt488_to","#e0dj51prVt488_tr",
]
var dropGashaponId = [
  // 掉出來的扭蛋
  "#e0dj51prVt428_to","#e0dj51prVt428_tr","#e0dj51prVt428_ts","#e0dj51prVt428",
  "#XXX_to", "#XXX_tr", "#XXX_ts", "#XXX",

]
var dropGashaponColor = [
  "#ff8271","#ca8ff7","#ffd278","#b7dd87","#9db1ef"
]
var modalBackground = [
  "#f7524b","#a159d9","#f5ad56","#accf4e","#6685e3"
]
// 轉蛋機動畫
function gashaponAnimation(state){
  if(state=="play"){
    // 播放動畫
    document.documentElement.style.setProperty('--play-number', "1");
    document.documentElement.style.setProperty('--play-state', "running");
    for(i=0; i<itemId.length; i++){
      $(itemId[i]).css("animation-name","");
    }
  }else if(state=="stop"){
    // 暫停動畫定重置   
    document.documentElement.style.setProperty('--play-number', "0");
    document.documentElement.style.setProperty('--play-state', "paused");
    for(i=0; i<itemId.length; i++){
      $(itemId[i]).css("animation-name","unset");
    }
  }else if(state=="drop"){
    getRandomGashapon();
    // 播放動畫
    document.documentElement.style.setProperty('--play-number-drop', "1");
    document.documentElement.style.setProperty('--play-state-drop', "running");
    for(i=0; i<itemId.length; i++){
      $(dropGashaponId[i]).css("animation-name","");
    }
    setTimeout(function(){
      document.documentElement.style.setProperty('--play-number-drop', "0");
      document.documentElement.style.setProperty('--play-state-drop', "paused");
      for(i=0; i<itemId.length; i++){
        $(dropGashaponId[i]).css("animation-name","unset");
      }
    }, 3*1000 );
      
  }
}

// 轉蛋機變形
function gashaponScale(state){
  // 「變形」與「變形時間」重置
  if(state=="reset"){
    $(".gashapon-main").css("transition","");
    $(".gashapon-main").css("transform","");
  }

  // 「回彈動畫（變矮後回彈）」
  if(state=="rebound-short"){
    // 回彈一秒
    $(".gashapon-main").css("transition","1s");
    $(".gashapon-main").css("transform","scale(1.05, 0.95)");
    // 一秒後重置時間
    setTimeout(function(){
      $(".gashapon-main").css("transform","");
      $(".energy-bar").css("transition","");
      $(".gashapon-main").addClass("default-animation");
    }, 1*1000 );
  }

  // 「回彈動畫（變高後回彈）」
  if(state=="rebound-high"){
    // 回彈一秒
    $(".gashapon-main").css("transition","1s");
    $(".gashapon-main").css("transform","scale(0.95, 1.05)");
    // 一秒後重置時間
    setTimeout(function(){
      $(".gashapon-main").css("transform","");
      $(".energy-bar").css("transition","");
      $(".gashapon-main").addClass("default-animation");
    }, 1*1000 );
  }

  // 還原
  if(state=="reduction"){
    $(".gashapon-main").css("transition","1s");
    $(".gashapon-main").css("transform","");
    $(".gashapon-main").addClass("default-animation");
  }

}

function getRandomGashapon(){
  r = getRandom(dropGashaponColor.length) - 1 ;
  $("#drop-gashapon").css({ fill: dropGashaponColor[r] });
  $("#drop-gashapon-m").css({ fill: dropGashaponColor[r] });
  $(".modal-header").css("background",modalBackground[r]);
}

// ------------------------------------------------------------- //
// 游標按下
function mouseDown(e) {
  // 視窗狀況是否有被開啟   
  if(modalState == 0 && importState ==1 ){
    // $(".gashapon-main").removeClass("default-animation");
    $(".energy-bar").css("transition","0s");

    // 「變形」與「變形時間」重置
    gashaponScale("reset");

    // 暫停動畫定重置 
    gashaponAnimation("stop");

    // 滑鼠點擊時的 Y 座標
    mouseClick_Y = e.pageY;
    if(e.pageY == undefined){
      mouseClick_Y = e.touches[0].pageY
    }

    // 狀態更新
    mouseState = 1;
  }
}

// 游標一進入視窗就會一直執行。   
function mouseMove(e) {
  // 滑鼠必須有先點下，才會執行。   
  if( mouseState == 1 && modalState == 0){

    // $(".gashapon-main").css("transition","0.2s");
    $(".gashapon-main").removeClass("default-animation");

    // 修復手機版本會抓不到 e.pageY 這個數值。
    Y = e.pageY;
    if(Y == undefined){
      Y = e.touches[0].pageY
    }
    // 游標位移量（負值向下、正值向上）
    mouseMove_Y = mouseClick_Y - Y;
    
    gashaponScale_X = -( mouseMove_Y * 0.0005 - 1);
    gashaponScale_Y =    mouseMove_Y * 0.001 + 1;
    gashaponScale_CSS = "scale("+ gashaponScale_X + "," +  gashaponScale_Y +")";
    
    $(".gashapon-main").css("transform", gashaponScale_CSS );

    if(mouseMove_Y < -30 || mouseMove_Y > 30){
      closeMenu();
    }


    // 向下
    if(mouseMove_Y < 0){
      // console.log(mouseMove_Y)
      $(".energy-bar").css("transform","scaleY("+(mouseMove_Y)/-350+")");
      $(".hint-text .energy").css("transform","scaleX("+(mouseMove_Y)/-350+")");
      if(mouseMove_Y< -350){
        $(".hint-text .text").text("可放開轉蛋機");
      }
    }
    // 向上
    else if(mouseMove_Y > 0){
      // console.log(mouseMove_Y)
      $(".energy-bar").css("transform","scaleY("+(mouseMove_Y)/350+")");
      $(".hint-text .energy").css("transform","scaleX("+(mouseMove_Y)/350+")");
      if(mouseMove_Y> 350){
        $(".hint-text .text").text("可放開轉蛋機");
      }
    }
    else{
      $(".hint-text .text").text("請持續滑動");
    }

  }
}

// 游標放開   
function mouseUp(e) {
  // $(".hint-text .text").text("游標放開");
  $(".energy-bar").css("transition","1s");
  $(".energy-bar").css("transform","scaleY(0)");
  
  if( mouseState == 1){
    
    //處理回彈的變形效果
    // mouseMove_Y（負值向下拉，往上回彈變高）
    if( mouseMove_Y<= 0 && mouseMove_Y< -100 ){
      gashaponScale("rebound-high");
      $(".hint-text .text").text("按住螢幕滑動");

    }
    // mouseMove_Y（正值向上拉，往下回彈變矮）
    else if( mouseMove_Y> 0  && mouseMove_Y> 100 ){
      gashaponScale("rebound-short");
      $(".hint-text .text").text("按住螢幕滑動");

    }
    // 其他還原不回彈     
    else{
      gashaponScale("reduction");
      $(".hint-text .text").text("按住螢幕滑動");

    }

    // console.log(mouseMove_Y);
    
    // 播放動畫（負值向下拉，滑鼠位移植小於 -350 才會出發動畫）
    if( mouseMove_Y< -350 || mouseMove_Y> 350){
      modalState = 1;
      gashaponAnimation("play");
      setTimeout(function(){
        gashaponAnimation("drop");
      }, 1.25*1000 );
      $(".hint-text .text").text("顯示結果");
      showModal();
    }
  }
  
  // 狀態更新
  mouseState = 0;
  mouseMove_Y = 0;
}

// ------------------------------------------------------------- //
function showModal(){
  setTimeout(function(){
    printResultText();
    $('#result-modal').modal('show');
    $(".result-btn").click(function() {
      modalState = 0;
      $(".hint-text .text").text("按住螢幕滑動");
    });
  }, 3*1000 );
}
function printResultText(){
  $(".modal-body").html("");
  r = getRandom(csvList.length-1);
  resultImg = 0;
  for(i=0; i< csvList[0].length; i++){
    resultTitle  = csvList[0][i];
    resultContent= csvList[r][i];
    if(resultTitle != undefined || resultContent != undefined){
      console.log(resultTitle);
      console.log(resultContent);
      if(resultTitle == "地址"){
        $(".modal-body").append("<p>"+ resultTitle +"："+"<a href='https://www.google.com/maps/place/"+resultContent+"' target='_blank'>"+ resultContent +"</a></p>")
      }
      else if(resultTitle == "圖片"){
        resultImg = 1;
        // $(".modal-body").append("<img src='"+resultContent+"' class='result'>")
      }
      else{
        $(".modal-body").append("<p>"+ resultTitle +"："+ resultContent +"</p>")
      }
      
    }
  }
  if(resultImg == 1){
    $(".modal-body").append("<img src='"+resultContent+"' class='result'>")
    resultImg = 0;
  }


}
      


// --------------
// 亂數（1~x）的隨機整數
function getRandom(x){
    return Math.floor(Math.random()*x)+1;
};
// --------------
// 各種游標事件
rangeWrapper.addEventListener('mousedown', mouseDown);
rangeWrapper.addEventListener('touchstart', mouseDown);

rangeWrapper.addEventListener('mousemove', mouseMove);
rangeWrapper.addEventListener('touchmove', mouseMove);

rangeWrapper.addEventListener('mouseup', mouseUp);
rangeWrapper.addEventListener('mouseleave', mouseUp);
rangeWrapper.addEventListener('touchend', mouseUp);
// ----------------


