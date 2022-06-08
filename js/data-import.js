// 網址分析
function analyzeUrl(){
  var webUrl = location.search
  var webUrlData = {
    "csv":"",
    "google":"",
    "title":"",
  }

  // 網址文字分段
  webUrl = webUrl.slice(1);   // 去除第一個問號?字元
  webUrl = webUrl.split("&"); // 分段

  // 將文字丟入 webUrlData 物件中
  for(i=0; i < webUrl.length; i++){
    // 單純 CSV 網址
    c = webUrl[i].indexOf("csv=")
    if( c != -1 ){
      $(".hint-text .text").text("讀取中...");
      webUrlData.csv = webUrl[i].replace("csv=","");
      $(".import-url").val(webUrlData.csv);
      csvUrl = $(".import-url").val();
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importSuccess(data);
          $(".btn-import, .btn-instruction, .btn-about, .btn-share").css("opacity","0");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {undefined
          importError();
        },
      });
    }
    // GOOGLE CSV 網址
    g = webUrl[i].indexOf("google=")
    if( g != -1 ){
      $(".hint-text .text").text("讀取中...");
      webUrlData.google = webUrl[i].replace("google=","");
      $(".import-url").val("https://docs.google.com/spreadsheets/d/e/"+webUrlData.google+"/pub?output=csv");
      csvUrl = $(".import-url").val();
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importSuccess(data);
          $(".btn-import, .btn-instruction, .btn-about, .btn-share").css("opacity","0");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {undefined
          importError();
        },
      });
    }
    // 標題
    t = webUrl[i].indexOf("title=")
    if( t != -1 ){
      webUrlData.title = decodeURI( webUrl[i].replace("title=",""));
    }

  }



}
analyzeUrl();


//---------------------------------------------------------------------
var csvUrl;  // CSV 連結
var csvList; // 放 CSV 資料的陣列
// 匯入 CSV
function importCsv(){
  $(".import-btn").click(function() {
    $(this).text("載入中");
    csvUrl = $(".import-url").val();
    if( csvUrl=="" ){
      $(".import-url").addClass("warning");
      $(".warning-text").text("此欄位不可空白。");
      $(".warning-text").css("display","block");
    }
    else{
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importSuccess(data);
          closeMenu();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {undefined
          importError();
        },
      });
    }
  });
}
// 載入成功
function importSuccess(data){
  // 讀取 csv 資料
  csvList = $.csv.toArrays(data + "\n");
  console.log(csvList);
  importState = 1;
  $(".hint-text .text").text("匯入成功");
  $('#import-modal').modal('hide');
  $(".import-url").removeClass("warning");
  $(".warning-text").text("");
  $(".warning-text").css("display","none");
  $(".btn-about").css("display","flex");
  $(".import-btn").text("確認");
  
  // 產生分享連結
  exportUrl();

}
// 載入失敗
function importError(){
  importState = 0;
  $(".import-url").addClass("warning");
  $(".hint-text .text").text("載入錯誤");
  $(".warning-text").text("網址載入錯誤。");
  $(".warning-text").css("display","block");
}
importCsv();
//---------------------------------------------------------------------
// 產生分享連結
function exportUrl(){
  port = ""
  if(location.port != ""){
    port = ":"+location.port
  }

  if(csvUrl.indexOf("https://docs.google.com/spreadsheets/d/e/") != -1 ){
    // 將 google csv 去頭去尾
    x = csvUrl.replace("https://docs.google.com/spreadsheets/d/e/","");
    x = x.split("/")[0];

    $(".share-url").val("https://"+location.hostname + port +location.pathname + "?google=" + x);
  }else{
    $(".share-url").val("https://"+location.hostname + port +location.pathname + "?csv=" + csvUrl);
  }

}





//---------------------------------------------------------------------
function showImportModal(){
  $(".gashapon-main").click(function() {
    if( csvUrl == undefined){
      $('#import-modal').modal('show');
    }
  });
}
showImportModal();



//---------------------------------------------------------------------
// 複製網址
const btnCopy = document.querySelector('.share-url-copy');
btnCopy.addEventListener('click', function() {
  const inputText = document.querySelector('.share-url');
  
  // pc
  inputText.select();
  // ios
  x = $(".share-url").val().length
  inputText.setSelectionRange(0, x); 
  
  document.execCommand('copy');
});

