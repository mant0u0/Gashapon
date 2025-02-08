let csvUrl;               // CSV 連結
let csvList;              // 放 CSV 資料的陣列
let dataObjectArray;      // 放 CSV 資料的物件
let historyList = [];     // 歷史紀錄
let repeatDrawState = 0;  // 重複抽獎狀態 0:不重複抽獎 1:重複抽獎
let importModel = "text"; // 匯入模式: text / csv
let importState = 0;      // 匯入狀況值

analyzeUrl();

// 網址分析
function analyzeUrl() {
  let webUrl = location.search.slice(1).split("&"); // 去除第一個問號並分段
  let webUrlData = {
    "csv": "",
    "google": "",
    "title": "",
    "item": ""
  };

  webUrl.forEach(param => {
    // 處理 CSV 網址
    if (param.includes("csv=")) {
      document.querySelector(".hint-text .text").textContent = "讀取中...";
      webUrlData.csv = param.replace("csv=", "");
      document.querySelector("#importUrl").value = webUrlData.csv;
      csvUrl = document.querySelector("#importUrl").value;
      fetchCsv(csvUrl);
    }

    // 處理 GOOGLE CSV 網址
    if (param.includes("google=")) {
      document.querySelector(".hint-text .text").textContent = "讀取中...";
      webUrlData.google = param.replace("google=", "");
      document.querySelector("#importUrl").value = `https://docs.google.com/spreadsheets/d/e/${webUrlData.google}/pub?output=csv`;
      csvUrl = document.querySelector("#importUrl").value;
      fetchCsv(csvUrl);
    }

    // 處理標題
    if (param.includes("title=")) {
      webUrlData.title = decodeURI(param.replace("title=", ""));
    }

    // 處理項目
    if (param.includes("item=") && !param.includes("google=") && !param.includes("csv=")) {
      webUrlData.item = decodeURI(param.replace("item=", "")).replace(/__/g, "\n");
      document.querySelector("#importText").value = webUrlData.item;
      importTextSuccess(webUrlData.item);
    }
  });
}

function fetchCsv(csvUrl) {
  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      importCsvSuccess(data);
      hideButtons();
    })
    .catch(() => {
      importCsvError();
    });
}

function hideButtons() {
  const buttons = document.querySelectorAll(".btn-import, .btn-display, .btn-instruction, .btn-about, .btn-share");
  buttons.forEach(button => button.style.opacity = "0");
}


//---------------------------------------------------------------------


// 匯入 CSV
importCsv();

function importCsv() {
  const importCsvBtn = document.querySelector("#import-csv-btn");
  const importUrlInput = document.querySelector("#importUrl");
  const importCsvWarning = document.querySelector("#importCsvWarning");

  importCsvBtn.addEventListener("click", function () {
    this.textContent = "匯入中";
    csvUrl = importUrlInput.value;

    console.log("csvURL: ", csvUrl);

    if (csvUrl === "") {
      importUrlInput.parentElement.classList.add("warning");
      importCsvWarning.textContent = "此欄位不可空白。";
      importCsvWarning.style.display = "block";
      this.textContent = "確認";
    } else {

      fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
          // let rows = data.split("\n");
          // console.log(rows);
          importCsvSuccess(data);
          closeMenu();
          modalState = 0;
        })
        .catch(error => {
          console.log(error);
          importCsvError();
        });
    }
  });
}

// 匯入成功
function importCsvSuccess(data) {

  importModel = "csv";

  // 讀取 csv 資料
  csvList = data.split('\n');

  for (let i = 0; i < csvList.length; i++) {
    csvList[i] = csvList[i].trim().split(',');
  }

  dataObjectArray = convertListToObjectArray(csvList);

  console.log("dataObjectArray: ", dataObjectArray);

  importState = 1;
  closeModal();

  // 將匯入成功文字顯示
  document.querySelector(".hint-text .text").textContent = "匯入成功";

  // 移除警告狀態
  document.querySelector("#importUrl").parentElement.classList.remove("warning");
  document.querySelector("#importCsvWarning").textContent = "";
  document.querySelector("#importCsvWarning").style.display = "none";

  // 將按鈕文字設置為確認
  document.querySelector("#import-csv-btn").textContent = "確認";

  // 隱藏無資料的提示文字
  document.querySelector(".no-data-text").style.display = "none";

  // 產生分享連結
  exportUrl('csv');

  // 列印匯入的扭蛋項目
  printGachaList();
}

// 匯入失敗
function importCsvError() {
  importState = 0;

  // 增加警告狀態
  document.querySelector("#importUrl").parentElement.classList.add("warning");

  // 設定按鈕文字
  document.querySelector("#import-csv-btn").textContent = "確認";

  // 顯示匯入錯誤提示
  document.querySelector(".hint-text .text").textContent = "匯入錯誤";

  // 顯示警告訊息
  document.querySelector("#importCsvWarning").textContent = "網址匯入錯誤。";
  document.querySelector("#importCsvWarning").style.display = "block";

  // 顯示無資料的提示文字
  document.querySelector(".no-data-text").style.display = "block";
}


//---------------------------------------------------------------------
// 匯入 Text
importText();

function importText() {
  const importTextBtn = document.querySelector("#import-text-btn");
  const importTextInput = document.querySelector("#importText");
  const importTextWarning = document.querySelector("#importTextWarning");

  importTextBtn.addEventListener("click", function () {
    this.textContent = "匯入中";
    let textList = importTextInput.value;

    // 去除 textList 所有 \n \r 與空白
    let textListTmp = textList.replace(/\n/g, "").replace(/\r/g, "").replace(/ /g, "");

    if (textListTmp === "") {
      importTextInput.parentElement.classList.add("warning");
      importTextWarning.textContent = "此欄位不可空白。";
      importTextWarning.style.display = "block";
      this.textContent = "確認";
    } else {
      modalState = 0;
      closeModal();
      importTextSuccess(textList);
    }
  });
}


function importTextSuccess(textList) {
  importModel = "text";
  importState = 1;

  // 第一行為項目類別
  textList = "項目\n" + textList;

  // 將 textList 分割成 csvList，去除空白與無效項目
  csvList = textList.split('\n').map(item => [item]);
  csvList = csvList.filter(item => item[0] !== "" && item[0] !== "\n" && item[0] !== " " && item[0] !== " \n");

  // 將 csvList 轉換成物件陣列
  dataObjectArray = convertListToObjectArray(csvList);

  // 更新匯入成功提示
  document.querySelector(".hint-text .text").textContent = "匯入成功";

  // 移除警告狀態
  document.querySelector("#importText").parentElement.classList.remove("warning");
  document.querySelector("#importTextWarning").textContent = "";
  document.querySelector("#importTextWarning").style.display = "none";

  // 更新按鈕文字
  document.querySelector("#import-text-btn").textContent = "確認";

  // 隱藏無資料提示
  document.querySelector(".no-data-text").style.display = "none";

  // 產生分享連結
  exportUrl("text");

  // 列印匯入的扭蛋項目
  printGachaList();
}

//---------------------------------------------------------------------

// 列表轉換
function convertListToObjectArray(list) {

  // 獲取標題行
  const headers = list[0];

  // 創建物件陣列，跳過標題行
  return list.slice(1).map((item, index) => {
    const obj = headers.reduce((acc, header, i) => {
      acc[header] = item[i] || ""; // 確保 undefined 或空的項目被初始化為空字串
      return acc;
    }, {});

    // 新增屬性：itemIsDrawn、itemId、itemCount
    obj["itemIsDrawn"] = false;
    obj["itemId"] = `gacha-item-${index}`;
    obj["itemCount"] = 0;

    return obj;
  });
}


//---------------------------------------------------------------------
// 產生分享連結
function exportUrl(type) {
  let shareUrlInput = document.querySelector(".share-url");
  let hostname = location.href.replace(location.search, "");

  if (type === 'csv') {
    let urlParam = csvUrl.indexOf("https://docs.google.com/spreadsheets/d/e/") !== -1
      ? `google=${csvUrl.replace("https://docs.google.com/spreadsheets/d/e/", "").split("/")[0]}`
      : `csv=${csvUrl}`;
    shareUrlInput.value = `${hostname}?${urlParam}`;
  } else if (type === 'text') {
    let itemText = document.querySelector("#importText").value.replace(/\n/g, "__");
    shareUrlInput.value = `${hostname}?item=${itemText}`;
  }
}


//---------------------------------------------------------------------
// 複製網址
const btnCopy = document.querySelector('.share-url-copy');
btnCopy.addEventListener('click', function () {
  const inputText = document.querySelector('.share-url');

  // Use Clipboard API to copy URL
  navigator.clipboard.writeText(inputText.value);
});

//---------------------------------------------------------------------
// 列印匯入扭蛋項目
printGachaList();

// 列印匯入扭蛋項目清單
function printGachaList() {
  const gachaList = document.querySelector("ul.gacha-list");
  const displayListGroup = document.querySelector(".display-list-group");
  const modalNoData = document.querySelector(".modal-body-display .modal-no-data");
  const displayModalReset = document.querySelector("#display-modal-reset");

  if (!dataObjectArray) {
    gachaList.innerHTML = "";
    displayListGroup.style.display = "none";
    modalNoData.style.display = "block";
    displayModalReset.style.display = "none";
  } else {
    displayListGroup.style.display = "block";
    modalNoData.style.display = "none";
    displayModalReset.style.display = "flex";

    gachaList.innerHTML = ""; // 清空列表
    dataObjectArray.forEach(item => {
      const key = Object.keys(item)[0];
      const li = document.createElement("li");
      li.className = "item";
      li.id = item.itemId;
      li.innerHTML = `<p class='item-name'>${item[key]}</p><p class='item-count'>${item.itemCount}</p>`;

      if (item.itemIsDrawn && repeatDrawState === 0) {
        li.classList.add("is-drawn");
      }

      gachaList.appendChild(li);
    });
  }

  // 設定 GachaList 按鈕
  setGachaListBtnClickEvent();
}


// 列印歷史紀錄
function printHistoryList() {
  const historyListElement = document.querySelector("ul.history-list");
  historyListElement.innerHTML = ""; // 清空歷史列表

  historyList.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `<p class='item-name'>${index + 1}. ${item}</p>`;
    historyListElement.appendChild(li);
  });
}

repeatDraw();

// 重複抽獎選項
function repeatDraw() {
  const repeatDrawCheckbox = document.getElementById("repeat-draw");
  const gachaList = document.querySelector("ul.gacha-list");
  const repeatDrawLabel = document.querySelector(".repeat-draw");

  if (repeatDrawCheckbox.checked) {
    console.log("重複抽獎");
    repeatDrawState = 1;
    repeatDrawLabel.classList.add("checked");
    gachaList.classList.add("repeat-draw-list");
    gachaList.classList.remove("no-repeat-draw-list");
  } else {
    console.log("不重複抽獎");
    repeatDrawState = 0;
    repeatDrawLabel.classList.remove("checked");
    gachaList.classList.remove("repeat-draw-list");
    gachaList.classList.add("no-repeat-draw-list");
  }
}


// 設定 GachaList 按鈕
function setGachaListBtnClickEvent() {
  const items = document.querySelectorAll(".gacha-list .item");

  items.forEach(item => {
    item.addEventListener("click", () => {
      const id = item.id;
      console.log(id);

      // 如果是不重複抽獎才執行
      if (repeatDrawState === 0) {
        const isDrawn = item.classList.contains("is-drawn");

        if (isDrawn) {
          item.classList.remove("is-drawn");
          // 清除該項目的 itemIsDrawn 狀態
          dataObjectArray.forEach(dataItem => {
            if (dataItem["itemId"] === id) {
              dataItem["itemIsDrawn"] = false;
            }
          });
        } else {
          item.classList.add("is-drawn");
          // 更新該項目的 itemIsDrawn 狀態
          dataObjectArray.forEach(dataItem => {
            if (dataItem["itemId"] === id) {
              dataItem["itemIsDrawn"] = true;
            }
          });
        }
      }
    });
  });
}


// 重置按鈕
function resetDataObjectArray() {
  // 清除 active 和 is-drawn 樣式
  const items = document.querySelectorAll(".gacha-list .item");
  items.forEach(item => {
    item.classList.remove("active", "is-drawn");
  });

  // 重置 dataObjectArray
  dataObjectArray.forEach(item => {
    item["itemIsDrawn"] = false;
    item["itemCount"] = 0;
  });

  printGachaList();

  // 清空歷史紀錄
  historyList = [];
  const historyListElement = document.querySelector(".history-list");
  historyListElement.innerHTML = "<li class='item'>暫無紀錄</li>";

  showModal("#display-modal");
}


// display 頁籤按鈕
displayTabClickEvent();
function displayTabClickEvent() {
  const tabs = document.querySelectorAll("#display-modal .tab-list .tab");
  const tabPages = document.querySelectorAll("#display-modal .tab-page");

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(sibling => sibling.classList.remove('active'));
      this.classList.add('active');

      const id = this.getAttribute("data-tab-page-id");
      tabPages.forEach(page => page.classList.remove('active'));
      document.querySelector(id).classList.add('active');
    });
  });
}


// import 頁籤按鈕
importTabClickEvent();
function importTabClickEvent() {
  const tabs = document.querySelectorAll("#import-modal .tab-list .tab");
  const tabPages = document.querySelectorAll("#import-modal .tab-page");

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(sibling => sibling.classList.remove('active'));
      this.classList.add('active');

      const id = this.getAttribute("data-tab-page-id");
      tabPages.forEach(page => page.classList.remove('active'));
      document.querySelector(id).classList.add('active');

      importModel = (id === "#import-csv") ? "csv" : "text";
      importBtnShowHide();
    });
  });
}

// 顯示匯入按鈕
importBtnShowHide()
function importBtnShowHide() {
  const importCsvBtn = document.getElementById("import-csv-btn");
  const importTextBtn = document.getElementById("import-text-btn");

  if (importModel === "csv") {
    importCsvBtn.style.display = "flex";
    importTextBtn.style.display = "none";
  } else if (importModel === "text") {
    importCsvBtn.style.display = "none";
    importTextBtn.style.display = "flex";
  }
}
