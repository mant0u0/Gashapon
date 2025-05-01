// 抓取哪一項元素
const rangeWrapper = document.querySelector('body');

// 滑鼠座標值
let mouseClick_Y = 0;
let mouseMove_Y = 0;

// 滑鼠狀況值
let mouseState = 0;
// 視窗狀況值
let modalState = 0;

// 扭蛋機縮放值
let gashaponScale_X = 0;
let gashaponScale_Y = 0;

// 視窗高度 與 觸發高度
let windowsHeight = document.body.clientHeight;
let triggerHeight = windowsHeight / 4;


// 扭蛋機ID
let itemId = [
  "#e0dj51prVt431_to", "#e0dj51prVt432_to", "#e0dj51prVt433_to", "#e0dj51prVt434_to",
  // ------------------------------------------------------------------------- //
  // 旋鈕
  "#e0dj51prVt435_to", "#e0dj51prVt438_tr", "#e0dj51prVt439_tr", "#e0dj51prVt440_tr",
  "#e0dj51prVt441_tr", "#e0dj51prVt442_tr", "#e0dj51prVt443_tr", "#e0dj51prVt444_tr",
  "#e0dj51prVt445_tr", "#e0dj51prVt446_tr", "#e0dj51prVt447_tr", "#e0dj51prVt448_tr",
  "#e0dj51prVt449_tr", "#e0dj51prVt450_tr", "#e0dj51prVt451_tr", "#e0dj51prVt452_tr",
  // ------------------------------------------------------------------------- //
  // 扭蛋
  "#e0dj51prVt455_to", "#e0dj51prVt455_tr", "#e0dj51prVt458_to", "#e0dj51prVt458_tr",
  "#e0dj51prVt461_to", "#e0dj51prVt461_tr", "#e0dj51prVt464_to", "#e0dj51prVt464_tr",
  "#e0dj51prVt467_to", "#e0dj51prVt467_tr", "#e0dj51prVt470_to", "#e0dj51prVt470_tr",
  "#e0dj51prVt473_to", "#e0dj51prVt473_tr", "#e0dj51prVt476_to", "#e0dj51prVt476_tr",
  "#e0dj51prVt479_to", "#e0dj51prVt479_tr", "#e0dj51prVt482_to", "#e0dj51prVt482_tr",
  "#e0dj51prVt485_to", "#e0dj51prVt485_tr", "#e0dj51prVt488_to", "#e0dj51prVt488_tr",
]
let dropGashaponId = [
  // 掉出來的扭蛋
  "#e0dj51prVt428_to", "#e0dj51prVt428_tr", "#e0dj51prVt428_ts", "#e0dj51prVt428",
  "#XXX_to", "#XXX_tr", "#XXX_ts", "#XXX",

]
let dropGashaponColor = [
  "#ff8271", "#ca8ff7", "#ffd278", "#b7dd87", "#9db1ef"
]
let modalBackground = [
  "#f7524b", "#a159d9", "#f5ad56", "#accf4e", "#6685e3"
]

// 扭蛋機動畫
function gashaponAnimation(state) {
  const rootStyle = document.documentElement.style;

  if (state === "play") {
    // 播放動畫
    rootStyle.setProperty('--play-number', "1");
    rootStyle.setProperty('--play-state', "running");
    itemId.forEach(id => {
      document.querySelector(id).style.animationName = "";
    });
  } else if (state === "stop") {
    // 暫停動畫並重置
    rootStyle.setProperty('--play-number', "0");
    rootStyle.setProperty('--play-state', "paused");
    itemId.forEach(id => {
      document.querySelector(id).style.animationName = "unset";
    });
  } else if (state === "drop") {
    getRandomGashapon();
    // 播放掉落動畫
    rootStyle.setProperty('--play-number-drop', "1");
    rootStyle.setProperty('--play-state-drop', "running");
    dropGashaponId.forEach(id => {
      document.querySelector(id).style.animationName = "";
    });

    setTimeout(() => {
      rootStyle.setProperty('--play-number-drop', "0");
      rootStyle.setProperty('--play-state-drop', "paused");
      dropGashaponId.forEach(id => {
        document.querySelector(id).style.animationName = "unset";
      });
    }, 3000);
  }
}


// 扭蛋機變形
function gashaponScale(state) {
  const gashaponMain = document.querySelector('.gashapon-main');
  const energyBar = document.querySelector('.energy-bar');

  // 「變形」與「變形時間」重置
  if (state === "reset") {
    gashaponMain.style.transition = "";
    gashaponMain.style.transform = "";
  }

  // 「回彈動畫（變矮後回彈）」
  if (state === "rebound-short") {
    gashaponMain.style.transition = "1s";
    gashaponMain.style.transform = "scale(1.05, 0.95)";
    setTimeout(() => {
      gashaponMain.style.transform = "";
      energyBar.style.transition = "";
      gashaponMain.classList.add("default-animation");
    }, 1000);
  }

  // 「回彈動畫（變高後回彈）」
  if (state === "rebound-high") {
    gashaponMain.style.transition = "1s";
    gashaponMain.style.transform = "scale(0.95, 1.05)";
    setTimeout(() => {
      gashaponMain.style.transform = "";
      energyBar.style.transition = "";
      gashaponMain.classList.add("default-animation");
    }, 1000);
  }

  // 還原
  if (state === "reduction") {
    gashaponMain.style.transition = "1s";
    gashaponMain.style.transform = "";
    gashaponMain.classList.add("default-animation");
  }
}

function getRandomGashapon() {
  const r = getRandom(dropGashaponColor.length) - 1;

  // 更新顏色
  document.querySelector("#drop-gashapon").style.fill = dropGashaponColor[r];
  document.querySelector("#drop-gashapon-m").style.fill = dropGashaponColor[r];
  document.querySelector(".modal-header").style.background = modalBackground[r];
}


// ------------------------------------------------------------- //
// 觸發高度（拖曳距離要達觸發高度，才會觸發扭蛋）
function getTriggerHeight() {
  windowsHeight = document.body.clientHeight;
  triggerHeight = windowsHeight / 4;
  console.log(triggerHeight);
}

function showCoordinates(event) {
  var x = event.touches[0].clientX;
  var y = event.touches[0].clientY;
  document.getElementById("mobiletouch").innerHTML = x + ", " + y;
}


// ------------------------------------------------------------- //
// 游標按下
function mouseDown(e) {

  // 避免在手機上 curzr 出現錯誤
  if (e.touches == null) {
    // 表示出現在滑鼠上
    // 游標變色
    document.querySelector(".curzr .outer").style.fill = "#f6c0bb";
  }

  // 視窗狀況是否有被開啟   
  if (modalState == 0) {

    // 獲取觸發高度
    getTriggerHeight();

    // document.querySelector(".gashapon-main").classList.remove("default-animation");
    document.querySelector(".energy-bar").style.transition = "0s";

    // 「變形」與「變形時間」重置
    gashaponScale("reset");

    // 暫停動畫定重置 
    gashaponAnimation("stop");

    // 滑鼠點擊時的 Y 座標
    mouseClick_Y = e.pageY;
    if (e.pageY === undefined) {
      mouseClick_Y = e.touches[0].clientY;
    }

    // 狀態更新
    mouseState = 1;
  }
}


// 游標一進入視窗就會一直執行。   
function mouseMove(e) {

  // 滑鼠必須有先點下，才會執行。
  if (mouseState == 1 && modalState == 0) {

    // $(".gashapon-main").css("transition","0.2s");
    const gashaponMain = document.querySelector(".gashapon-main");
    gashaponMain.classList.remove("default-animation");

    // 修復手機版本會抓不到 e.pageY 這個數值。
    let Y = e.pageY;
    if (Y === undefined) {
      Y = e.touches[0].clientY;
    }
    // 游標位移量（負值向下、正值向上）
    mouseMove_Y = mouseClick_Y - Y;

    gashaponScale_X = -(mouseMove_Y * 0.0005 - 1);
    gashaponScale_Y = mouseMove_Y * 0.001 + 1;
    const gashaponScale_CSS = `scale(${gashaponScale_X},${gashaponScale_Y})`;

    gashaponMain.style.transform = gashaponScale_CSS;

    if (mouseMove_Y < -30 || mouseMove_Y > 30) {
      closeMenu();
    }

    const energyBar = document.querySelector(".energy-bar");
    const hintEnergy = document.querySelector(".hint-text .energy");
    const hintText = document.querySelector(".hint-text .text");

    if (mouseMove_Y < 0) {
      // 向下

      energyBar.style.transform = `scaleY(${mouseMove_Y / (-1 * triggerHeight)})`;
      hintEnergy.style.transform = `scaleX(${mouseMove_Y / (-1 * triggerHeight)})`;
      if (mouseMove_Y < -triggerHeight) {
        hintText.textContent = "可放開扭蛋機";
      }

    } else if (mouseMove_Y > 0) {
      // 向上

      energyBar.style.transform = `scaleY(${mouseMove_Y / triggerHeight})`;
      hintEnergy.style.transform = `scaleX(${mouseMove_Y / triggerHeight})`;
      if (mouseMove_Y > triggerHeight) {
        hintText.textContent = "可放開扭蛋機";
      }

    } else {
      hintText.textContent = "請持續滑動";
    }
  }
}

// 游標放開   
function mouseUp(e) {

  // 避免在手機上 curzr 出現錯誤
  if (e.touches == null) {
    // 游標變回原色
    document.querySelector(".curzr .outer").style.fill = "";
  }

  // document.querySelector(".hint-text .text").textContent = "游標放開";
  document.querySelector(".energy-bar").style.transition = "1s";
  document.querySelector(".energy-bar").style.transform = "scaleY(0)";
  document.querySelector(".hint-text .energy").style.transition = "0.2s";
  document.querySelector(".hint-text .energy").style.transform = "scaleX(0)";

  if (mouseState == 1) {

    //處理回彈的變形效果
    // mouseMove_Y（負值向下拉，往上回彈變高）
    if (mouseMove_Y <= 0 && mouseMove_Y < -100) {
      gashaponScale("rebound-high");
      document.querySelector(".hint-text .text").textContent = "按住螢幕滑動";

    }
    // mouseMove_Y（正值向上拉，往下回彈變矮）
    else if (mouseMove_Y > 0 && mouseMove_Y > 100) {
      gashaponScale("rebound-short");
      document.querySelector(".hint-text .text").textContent = "按住螢幕滑動";

    }
    // 其他還原不回彈     
    else {
      gashaponScale("reduction");
      document.querySelector(".hint-text .text").textContent = "按住螢幕滑動";
    }

    // 播放動畫（負值向下拉，滑鼠位移值小於 -1 * triggerHeight 才會出發動畫）
    if (mouseMove_Y < -1 * triggerHeight || mouseMove_Y > triggerHeight) {
      modalState = 1;
      gashaponAnimation("play");
      setTimeout(function () {
        gashaponAnimation("drop");
      }, 1.25 * 1000);
      document.querySelector(".hint-text .text").textContent = "顯示結果";
      showResultModal();
    }
  }

  // 狀態更新
  mouseState = 0;
  mouseMove_Y = 0;
}


// ------------------------------------------------------------- //
// 顯示結果視窗
function showResultModal() {

  setTimeout(function () {
    // 判斷是否有資料匯入（無資料：開啟匯入視窗；有資料：顯示結果）
    if (dataObjectArray === undefined || importState === 0) {

      let importModal = new bootstrap.Modal(document.getElementById('import-modal'));
      importModal.show();

      const cancelButton = document.getElementById('import-modal-cancel');
      if (cancelButton) {
        cancelButton.addEventListener('click', function () {
          modalState = 0;
          const hintTextElement = document.querySelector(".hint-text .text");
          if (importState === 0) {
            hintTextElement.textContent = "資料尚未匯入";
          } else {
            hintTextElement.textContent = "按住螢幕滑動";
          }
        });
      }
    } else {
      printResultText();

      let resultModal = new bootstrap.Modal(document.getElementById('result-modal'));
      resultModal.show();
    }

  }, 3 * 1000);
}


// 列印結果
function printResultText() {

  const resultContent = document.querySelector(".modal-body .result-content");
  resultContent.innerHTML = ""; // 內容清空

  document.querySelector(".modal-body-result .modal-no-data").style.display = 'none';

  let r;

  if (repeatDrawState === 1) { // 重複抽獎
    console.log("重複抽獎");
    r = getRandom(dataObjectArray.length) - 1; //取得亂數

  } else if (repeatDrawState === 0) { // 不重複抽獎
    console.log("不重複抽獎");

    const allDrawn = dataObjectArray.every(item => item["itemIsDrawn"]);

    if (allDrawn) {
      console.log("全部都抽完");

      document.querySelector(".modal-body-result .modal-no-data").style.display = 'block';

      return;
    }
    do {
      r = getRandom(dataObjectArray.length) - 1;
    } while (dataObjectArray[r]["itemIsDrawn"]);
  }

  console.log(dataObjectArray, r)

  // 計數器
  dataObjectArray[r]["itemCount"]++;
  if (repeatDrawState === 0) {
    dataObjectArray[r]["itemIsDrawn"] = true;
  }
  printGachaList(); // 列印匯入扭蛋項目


  // 加入歷史紀錄：第 0 個 key
  historyList.push(dataObjectArray[r][csvList[0][0]]);
  printHistoryList();

  // GachaListItem 新增 active  
  document.querySelectorAll(".gacha-list .item").forEach(item => item.classList.remove("active"));
  document.getElementById(dataObjectArray[r]["itemId"]).classList.add("active");

  const csvObjectKey = csvList[0];
  const csvObjectKeyLength = csvObjectKey.length;

  csvObjectKey.forEach(itemTitle => {
    const itemInfo = dataObjectArray[r][itemTitle];

    if (csvObjectKeyLength > 1 || itemTitle === "地址" || itemTitle === "圖片") {
      if (itemTitle === "地址") {
        resultContent.innerHTML += `<p>${itemTitle}：<a href='https://www.google.com/maps/place/${itemInfo}' target='_blank'>${itemInfo}</a></p>`;
      } else if (itemTitle === "圖片") {
        resultContent.innerHTML += `<img src='${itemInfo}' class='result-img'>`;
      } else if (isURL(itemInfo)) {
        if (isImageURL(itemInfo)) {
          resultContent.innerHTML += `<p>${itemTitle}</p><img src='${itemInfo}' class='result-img'>`;
        } else {
          resultContent.innerHTML += `<p>${itemTitle}：<a href='${itemInfo}' target='_blank'>${itemInfo}</a></p>`;
        }
      } else {
        resultContent.innerHTML += `<p>${itemTitle}：${itemInfo}</p>`;
      }
    } else {
      resultContent.innerHTML += `<p class='text-lg text-center'>${itemInfo}</p>`;
    }
  });
}


// --------------
// 顯示視窗
function showModal(id) {

  closeModal();
  const idModal = new bootstrap.Modal(id);
  idModal.show();

  closeMenu();
  modalState = 1;
}

// 關閉所有其他視窗
function closeModal() {

  let allModal = document.querySelectorAll('.modal');
  allModal.forEach(m => {
    let myModal = bootstrap.Modal.getInstance(m);
    // console.log("Close modal function: ", myModal);
    if (myModal) {
      myModal.hide();
    }
  });

  const hintTextElement = document.querySelector(".hint-text .text");
  if (hintTextElement) {
    hintTextElement.textContent = "按住螢幕滑動";
  }

  modalState = 0;
}

// --------------
// 判斷字串為連結
function isURL(str) {
  // 定義一個正則表達式來匹配合法的URL格式
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  // 使用正則表達式的 test 方法來檢查字串是否符合格式
  return urlRegex.test(str);
}
// 判斷字串為圖片連結
function isImageURL(str) {
  // 定義一個正則表達式來匹配合法的圖片URL格式
  const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/i;

  // 使用正則表達式的 test 方法來檢查字串是否符合格式
  return imageRegex.test(str);
}

// --------------
// 亂數（1~x）的隨機整數
function getRandom(x) {
  return Math.floor(Math.random() * x) + 1;
}

// --------------
// 各種游標事件
rangeWrapper.addEventListener('mousedown', mouseDown);
rangeWrapper.addEventListener('touchstart', mouseDown);

rangeWrapper.addEventListener('mousemove', mouseMove);
rangeWrapper.addEventListener('touchmove', mouseMove);

rangeWrapper.addEventListener('mouseup', mouseUp);
rangeWrapper.addEventListener('mouseleave', mouseUp);
rangeWrapper.addEventListener('touchend', mouseUp);
// --------------
