var csvUrl;  // CSV 連結
var csvList; // 放 CSV 資料的陣列
var dataObjectArray; // 放 CSV 資料的物件
var historyList = []; // 歷史紀錄
var repeatDrawState = 0; // 重複抽獎狀態 0:不重複抽獎 1:重複抽獎
var importModel = "text"; // 匯入模式: text / csv
var importState = 0; // 匯入狀況值

analyzeUrl();
// 網址分析
function analyzeUrl() {
  var webUrl = location.search
  var webUrlData = {
    "csv": "",
    "google": "",
    "title": "",
    "item": ""
  }

  // 網址文字分段
  webUrl = webUrl.slice(1);   // 去除第一個問號?字元
  webUrl = webUrl.split("&"); // 分段

  // 將文字丟入 webUrlData 物件中
  for (i = 0; i < webUrl.length; i++) {
    // 單純 CSV 網址
    indexOfCsv = webUrl[i].indexOf("csv=")
    if (indexOfCsv != -1) {
      $(".hint-text .text").text("讀取中...");
      webUrlData.csv = webUrl[i].replace("csv=", "");
      $("#importUrl").val(webUrlData.csv);
      csvUrl = $("#importUrl").val();
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importCsvSuccess(data);
          $(".btn-import, .btn-display, .btn-instruction, .btn-about, .btn-share").css("opacity", "0");
        },
        error: function () {
          undefined
          importCsvError();
        },
      });
    }

    // GOOGLE CSV 網址
    indexOfGoogle = webUrl[i].indexOf("google=")
    if (indexOfGoogle != -1) {
      $(".hint-text .text").text("讀取中...");
      webUrlData.google = webUrl[i].replace("google=", "");
      $("#importUrl").val("https://docs.google.com/spreadsheets/d/e/" + webUrlData.google + "/pub?output=csv");
      csvUrl = $("#importUrl").val();
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importCsvSuccess(data);
          $(".btn-import, .btn-display, .btn-instruction, .btn-about, .btn-share").css("opacity", "0");
        },
        error: function () {
          undefined
          importCsvError();
        },
      });
    }

    // 標題
    indexOfTitle = webUrl[i].indexOf("title=")
    if (indexOfTitle != -1) {
      webUrlData.title = decodeURI(webUrl[i].replace("title=", ""));
    }

    // 項目
    indexOfItem = webUrl[i].indexOf("item=")
    if (indexOfItem != -1 && indexOfGoogle == -1 && indexOfCsv == -1) {
      webUrlData.item = decodeURI(webUrl[i].replace("item=", ""));

      // 1__2__3 -> 1\n2\n3
      webUrlData.item = webUrlData.item.replace(/__/g, "\n");
      $("#importText").val(webUrlData.item);
      textList = $("#importText").val();

      importState = 1;
      importTextSuccess(textList);
      $(".btn-import, .btn-display, .btn-instruction, .btn-about, .btn-share").css("opacity", "0");

    }

  }
}

//---------------------------------------------------------------------


// 匯入 CSV
importCsv();
function importCsv() {
  $("#import-csv-btn").click(function () {
    $(this).text("匯入中");
    csvUrl = $("#importUrl").val();
    if (csvUrl == "") {
      $("#importUrl").parent().addClass("warning");
      $("#importCsvWarning").text("此欄位不可空白。");
      $("#importCsvWarning").css("display", "block");
      $(this).text("確認");
    }
    else {
      $.ajax({
        url: csvUrl,
        success: function (data) {
          importCsvSuccess(data);
          closeMenu();
          modalState = 0;
        },
        error: function () {
          undefined
          importCsvError();
        },
      });
    }
  });
}
// 匯入成功
function importCsvSuccess(data) {

  importModel = "csv";

  // 讀取 csv 資料
  csvList = $.csv.toArrays(data + "\n");
  // console.log(csvList);
  dataObjectArray = convertListToObjectArray(csvList)

  importState = 1;
  closeModal();
  $(".hint-text .text").text("匯入成功");
  $("#importUrl").parent().removeClass("warning");
  $("#importCsvWarning").text("");
  $("#importCsvWarning").css("display", "none");
  $("#import-csv-btn").text("確認");
  $(".no-data-text").hide();

  // 產生分享連結
  exportCsvUrl();

  // 列印匯入扭蛋項目
  printGachaList();

}
// 匯入失敗
function importCsvError() {
  importState = 0;
  $("#importUrl").parent().addClass("warning");
  $("#import-csv-btn").text("確認");
  $(".hint-text .text").text("匯入錯誤");
  $("#importCsvWarning").text("網址匯入錯誤。");
  $("#importCsvWarning").css("display", "block");
  $(".no-data-text").show();
}
//---------------------------------------------------------------------
// 匯入 Text
importText();
function importText() {
  $("#import-text-btn").click(function () {
    $(this).text("匯入中");
    textList = $("#importText").val();
    // console.log(textList);

    // 去除 textList 所有 \n \r 與空白
    textListTmp = textList.replace(/\n/g, "").replace(/\r/g, "").replace(/ /g, "");

    if (textListTmp == "") {
      $("#importText").parent().addClass("warning");
      $("#importTextWarning").text("此欄位不可空白。");
      $("#importTextWarning").css("display", "block");
      $(this).text("確認");
    }
    else {
      modalState = 0;
      closeModal();
      importTextSuccess(textList);
    }
  });
}
function importTextSuccess(textList) {
  importModel = "text";
  importState = 1;

  textList = "項目\n" + textList; // 第一行為項目類別

  // textList: "項目1\n項目2\n項目3" -> csvList: [["項目1"], ["項目2"], ["項目3"]]
  csvList = textList.split('\n').map(item => [item]);
  // 去除[""] & ["\n"] & [" "] & [" \n"]
  csvList = csvList.filter(item => item[0] != "" && item[0] != "\n" && item[0] != " " && item[0] != " \n");

  // 轉成 Array
  // console.log(csvList);
  dataObjectArray = convertListToObjectArray(csvList)

  $(".hint-text .text").text("匯入成功");
  $("#importText").parent().removeClass("warning");
  $("#importTextWarning").text("");
  $("#importTextWarning").css("display", "none");
  $("#import-text-btn").text("確認");
  $(".no-data-text").hide();

  // 產生分享連結
  exportTextUrl();

  // 列印匯入扭蛋項目
  printGachaList();
}
//---------------------------------------------------------------------

// 列表轉換
function convertListToObjectArray(list) {
  // 獲取標題行
  const headers = list[0];

  // 創建物件陣列，跳過標題行
  const result = list.slice(1).map((item, index) => {
    const obj = {};
    // 對每一項目進行迴圈，將標題與值對應起來
    headers.forEach((header, i) => {
      obj[header] = item[i];
    });
    // 新增 itemIsDrawn 屬性：表示該項目是否被抽出
    obj["itemIsDrawn"] = false;
    // 新增 itemId 屬性：表示該項目的 id
    obj["itemId"] = `gacha-item-${index}`;
    // 新增 itemCount 屬性：表示該項目的抽出次數
    obj["itemCount"] = 0;
    return obj;
  });

  return result;
}

//---------------------------------------------------------------------
// 產生分享連結
function exportCsvUrl() {
  port = ""
  hostname = ""
  if (location.port != "") {
    port = ":" + location.port
  }
  if (location.hostname == "127.0.0.1") {
    hostname = location.hostname
  } else {
    hostname = "https://" + location.hostname
  }

  if (csvUrl.indexOf("https://docs.google.com/spreadsheets/d/e/") != -1) {
    // 將 google csv 去頭去尾
    googleUrl = csvUrl.replace("https://docs.google.com/spreadsheets/d/e/", "");
    googleUrl = googleUrl.split("/")[0];

    $(".share-url").val(hostname + port + location.pathname + "?google=" + googleUrl);
  } else {
    $(".share-url").val(hostname + port + location.pathname + "?csv=" + csvUrl);
  }

}
function exportTextUrl() {
  port = ""
  hostname = ""
  if (location.port != "") {
    port = ":" + location.port
  }
  if (location.hostname == "127.0.0.1") {
    hostname = location.hostname
  } else {
    hostname = "https://" + location.hostname
  }

  itemText = $("#importText").val();
  // itemText : 1\n2\n3 -> itemText : 1__2__3
  itemText = itemText.replace(/\n/g, "__");


  $(".share-url").val(hostname + port + location.pathname + "?item=" + itemText);
}

//---------------------------------------------------------------------
// 複製網址
const btnCopy = document.querySelector('.share-url-copy');
btnCopy.addEventListener('click', function () {
  const inputText = document.querySelector('.share-url');

  // pc
  inputText.select();
  // ios
  x = $(".share-url").val().length
  inputText.setSelectionRange(0, x);

  document.execCommand('copy');
});

//---------------------------------------------------------------------
// 列印匯入扭蛋項目
printGachaList();
// 列印匯入扭蛋項目清單
function printGachaList() {

  if (dataObjectArray == null) {
    $("ul.gacha-list").empty();
    $(".display-list-group").hide();
    $(".modal-body-display .modal-no-data").show();
    $("#display-modal-reset").hide();
  }
  else {
    $(".display-list-group").show();
    $(".modal-body-display .modal-no-data").hide();
    $("#display-modal-reset").css("display", "flex");

    // console.log(dataObjectArray);
    $("ul.gacha-list").empty();
    dataObjectArray.forEach(item => {
      const key = Object.keys(item)[0];
      const li = $("<li class='item' id='" + item["itemId"] + "'><p class='item-name'>" + item[key] + "</p><p class='item-count'>" + item["itemCount"] + "</p>" + "</li>");
      if (item["itemIsDrawn"] && repeatDrawState == 0) {
        li.addClass("is-drawn");
      }
      $("ul.gacha-list").append(li);
    });
  }

  // 設定 GachaList 按鈕
  setGachaListBtnClickEvent();
}

// 列印歷史紀錄
function printHistoryList() {

  $("ul.history-list").empty();

  historyList.forEach((item, index) => {
    const li = $("<li class='item'><p class='item-name'>" + (index + 1) + ". " + item + "</p></li>");
    $("ul.history-list").append(li);
  });

}

repeatDraw();
// 重複抽獎選項
function repeatDraw() {

  // 檢查 #repeat-draw 是否被勾選
  if ($("#repeat-draw").is(":checked")) {
    console.log("重複抽獎");
    repeatDrawState = 1;
    $(".repeat-draw").addClass("checked");
    $("ul.gacha-list").addClass("repeat-draw-list");
    $("ul.gacha-list").removeClass("no-repeat-draw-list");
  } else {
    console.log("不重複抽獎");
    repeatDrawState = 0;
    $(".repeat-draw").removeClass("checked");
    $("ul.gacha-list").removeClass("repeat-draw-list");
    $("ul.gacha-list").addClass("no-repeat-draw-list");
  }

}

// 設定 GachaList 按鈕
function setGachaListBtnClickEvent() {

  $(".gacha-list .item").click(function () {
    // 取得 this id 屬性的值
    const id = $(this).attr("id");
    console.log(id);

    // 如果是不重複抽獎才執行
    if (repeatDrawState == 0) {
      if ($(this).hasClass("is-drawn")) {
        $(this).removeClass("is-drawn");
        // 清除該項目的 itemIsDrawn 狀態
        dataObjectArray.forEach(item => {
          if (item["itemId"] == id) {
            item["itemIsDrawn"] = false;
          }
        });

      } else {
        $(this).addClass("is-drawn");
        // 更新該項目的 itemIsDrawn 狀態
        dataObjectArray.forEach(item => {
          if (item["itemId"] == id) {
            item["itemIsDrawn"] = true;
          }
        });
      }
    }
  });


}

// 重置按鈕
function resetDataObjectArray() {

  // 清除 active 樣式
  $(".gacha-list .item").removeClass("active");
  $(".gacha-list .item").removeClass("is-drawn");

  dataObjectArray.forEach(item => {
    item["itemIsDrawn"] = false;
    item["itemCount"] = 0;
  });

  printGachaList();

  historyList = [];
  $(".history-list").empty();
  $(".history-list").html("<li class='item'>暫無紀錄</li>");

  showModal("#display-modal")
}

// display 頁籤按鈕
displayTabClickEvent();
function displayTabClickEvent() {
  $("#display-modal .tab-list .tab").click(function () {
    $(this).siblings(".tab").removeClass("active");
    $(this).addClass("active");

    const id = $(this).attr("data-tab-page-id");
    $("#display-modal .tab-page").removeClass("active");
    $(id).addClass("active");
  })
}

// import 頁籤按鈕
importTabClickEvent();
function importTabClickEvent() {

  $("#import-modal .tab-list .tab").click(function () {
    $(this).siblings(".tab").removeClass("active");
    $(this).addClass("active");

    const id = $(this).attr("data-tab-page-id");
    $("#import-modal .tab-page").removeClass("active");
    $(id).addClass("active");

    if (id == "#import-csv") {
      importModel = "csv";
      importBtnShowHide();
    }

    if (id == "#import-text") {
      importModel = "text";
      importBtnShowHide();
    }


  })
}

// 顯示匯入按鈕
importBtnShowHide()
function importBtnShowHide() {
  if (importModel == "csv") {
    $("#import-csv-btn").css("display", "flex");
    $("#import-text-btn").css("display", "none");
  }
  if (importModel == "text") {
    $("#import-csv-btn").css("display", "none");
    $("#import-text-btn").css("display", "flex");
  }
}