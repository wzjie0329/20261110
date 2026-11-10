let characterSheet; // 儲存角色 1 的待機精靈圖。
let walkSheet; // 儲存角色 1 的走路精靈圖。
let magicSheet; // 儲存角色 1 的施法精靈圖。
let magicEffectSheet; // 儲存施法後飛行特效的精靈圖。
let characterCenterX; // 儲存角色中心點在畫布上的水平位置。
let facingDirection = 1; // 記錄角色朝向，1 為右方，-1 為左方。
let magicFacingDirection = 1; // 記錄施法開始時角色面向的方向。
let isCastingMagic = false; // 記錄角色是否正在播放施法動畫。
let magicStartFrame = 0; // 記錄施法動畫開始時的畫面影格。
let isEffectActive = false; // 記錄施法特效是否正在畫面中飛行。
let effectCenterX = 0; // 記錄飛行特效中心點的水平位置。
let effectDirection = 1; // 記錄飛行特效移動的方向。
let effectStartFrame = 0; // 記錄飛行特效開始時的畫面影格。
let spaceKeyHeld = false; // 防止長按空白鍵重複觸發施法。
const spriteFrameCount = 9; // 設定每張精靈圖內的動畫影格數量。
const magicFrameCount = 4; // 設定施法精靈圖內的動畫影格數量。
const effectFrameCount = 5; // 設定飛行特效精靈圖內的動畫影格數量。
const framesPerImage = 8; // 設定每張影格顯示的繪圖次數。
const moveSpeedRatio = 0.006; // 設定角色每格相對於畫布寬度的移動速度。
const effectSpeedRatio = 0.015; // 設定特效每格相對於畫布寬度的移動速度。
function preload() { // 在畫布啟動前載入角色圖片。
  characterSheet = loadImage("1/stop/stop.png"); // 載入角色 1 的待機精靈圖。
  walkSheet = loadImage("1/walk/walk.png"); // 載入角色 1 的走路精靈圖。
  magicSheet = loadImage("1/magic/magic.png"); // 載入角色 1 的施法精靈圖。
  magicEffectSheet = loadImage("1/magic_effect/magic_effect.png"); // 載入施法後飛行的特效精靈圖。
} // 結束圖片載入函式。
function setup() { // 建立並初始化全螢幕畫布。
  createCanvas(windowWidth, windowHeight); // 讓畫布尺寸符合目前瀏覽器視窗。
  imageMode(CORNER); // 使用圖片左上角作為繪製座標。
  frameRate(60); // 設定畫布更新頻率以維持動畫流暢。
  characterCenterX = width * 2 / 3; // 將角色初始位置設在畫布寬度的三分之二處。
} // 結束畫布初始化函式。
function draw() { // 每個畫面更新時繪製背景、角色與飛行特效。
  background(135, 206, 235); // 使用天空藍作為畫布背景。
  const rightPressed = keyIsDown(RIGHT_ARROW); // 檢查目前是否按住鍵盤右方向鍵。
  const leftPressed = keyIsDown(LEFT_ARROW); // 檢查目前是否按住鍵盤左方向鍵。
  const isWalking = rightPressed || leftPressed; // 按住任一方向鍵時播放走路動畫。
  if (rightPressed) { // 按住右鍵時將角色朝向右方並向右移動。
    facingDirection = 1; // 設定角色面向右方。
    characterCenterX += max(1, width * moveSpeedRatio); // 依畫布寬度向右移動角色。
  } else if (leftPressed) { // 按住左鍵時將角色朝向左方並向左移動。
    facingDirection = -1; // 設定角色面向左方。
    characterCenterX -= max(1, width * moveSpeedRatio); // 依畫布寬度向左移動角色。
  } // 結束方向鍵移動判斷。
  const baseFrameWidth = characterSheet.width / spriteFrameCount; // 計算待機角色單張影格的來源寬度。
  const baseFrameHeight = characterSheet.height; // 取得待機角色單張影格的來源高度。
  const scaleFactor = min(width * 0.28 / baseFrameWidth, height * 0.5 / baseFrameHeight); // 依畫布寬高等比例計算角色縮放比例。
  const characterHeight = baseFrameHeight * scaleFactor; // 計算角色動畫共用的顯示高度。
  if (isCastingMagic && floor((frameCount - magicStartFrame) / framesPerImage) >= magicFrameCount) { // 判斷四格施法動畫是否已播放完畢。
    isCastingMagic = false; // 結束一次性的施法動畫。
    isEffectActive = true; // 開始播放施法後的飛行特效。
    effectDirection = magicFacingDirection; // 讓飛行特效沿施法開始時的面向移動。
    effectCenterX = characterCenterX + effectDirection * baseFrameWidth * scaleFactor / 2; // 將特效放在角色面向一側。
    effectStartFrame = frameCount; // 記錄飛行特效的起始影格。
  } // 結束施法動畫完成處理。
  const activeSheet = isCastingMagic ? magicSheet : isWalking ? walkSheet : characterSheet; // 依施法、移動或待機狀態選擇角色圖片。
  const activeFrameCount = isCastingMagic ? magicFrameCount : spriteFrameCount; // 取得目前角色動畫的影格數量。
  const sourceFrameWidth = activeSheet.width / activeFrameCount; // 計算目前精靈圖中單張影格的來源寬度。
  const sourceFrameHeight = activeSheet.height; // 取得目前精靈圖單張影格的來源高度。
  const activeScaleFactor = characterHeight / sourceFrameHeight; // 讓不同角色動畫維持相同顯示高度。
  const characterWidth = sourceFrameWidth * activeScaleFactor; // 依動畫影格比例計算角色顯示寬度。
  characterCenterX = constrain(characterCenterX, characterWidth / 2, width - characterWidth / 2); // 限制角色位置並讓動畫影格完整留在畫布內。
  const characterY = height - characterHeight; // 將角色畫面底端對齊畫布底端。
  const frameIndex = isCastingMagic ? floor((frameCount - magicStartFrame) / framesPerImage) : floor(frameCount / framesPerImage) % activeFrameCount; // 施法影格只播放一次，其餘動作循環播放。
  const renderDirection = isCastingMagic ? magicFacingDirection : facingDirection; // 施法期間維持開始施法時的角色朝向。
  push(); // 暫存畫布狀態以便只翻轉角色圖片。
  translate(characterCenterX, 0); // 將座標原點移到角色中心以進行水平翻轉。
  scale(renderDirection, 1); // 角色或施法朝左時水平翻轉精靈圖。
  image(activeSheet, -characterWidth / 2, characterY, characterWidth, characterHeight, frameIndex * sourceFrameWidth, 0, sourceFrameWidth, sourceFrameHeight); // 繪製目前方向與動作的精靈圖影格。
  pop(); // 還原畫布狀態，避免翻轉影響背景或其他繪圖。
  if (isEffectActive) { // 有飛行特效時繪製並更新其位置。
    const effectFrameWidth = magicEffectSheet.width / effectFrameCount; // 計算特效精靈圖中單張影格的來源寬度。
    const effectFrameHeight = magicEffectSheet.height; // 取得特效精靈圖單張影格的來源高度。
    const effectHeight = characterHeight * 0.18; // 依角色高度計算特效顯示高度。
    const effectWidth = effectFrameWidth * effectHeight / effectFrameHeight; // 依精靈圖比例計算特效顯示寬度。
    const effectY = characterY + characterHeight * 0.42 - effectHeight / 2; // 將特效放在角色身體前方的高度。
    const effectAtEdge = effectDirection === 1 ? effectCenterX + effectWidth / 2 >= width : effectCenterX - effectWidth / 2 <= 0; // 判斷特效是否已抵達畫布左右邊緣。
    if (effectAtEdge) { // 特效抵達畫布邊緣時移除特效。
      isEffectActive = false; // 停止繪製已抵達畫布邊緣的特效。
    } else { // 特效尚未抵達邊緣時繼續播放動畫並移動。
      const effectFrameIndex = floor((frameCount - effectStartFrame) / 4) % effectFrameCount; // 循環播放五格特效動畫。
      push(); // 暫存畫布狀態以便依飛行方向翻轉特效。
      translate(effectCenterX, 0); // 將座標原點移到特效中心。
      scale(effectDirection, 1); // 特效往左移動時水平翻轉圖片。
      image(magicEffectSheet, -effectWidth / 2, effectY, effectWidth, effectHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight); // 繪製目前的特效影格。
      pop(); // 還原畫布狀態。
      effectCenterX += effectDirection * max(4, width * effectSpeedRatio); // 讓特效朝指定方向持續移動。
    } // 結束飛行特效邊緣判斷。
  } // 結束飛行特效繪製處理。
} // 結束每格畫面繪製函式。
function keyPressed() { // 按下空白鍵施法，並阻止方向鍵造成頁面捲動。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 確認按下的是左右方向鍵。
    return false; // 阻止瀏覽器執行方向鍵的預設捲動行為。
  } // 結束方向鍵預設行為處理。
  if (key === " ") { // 確認按下空白鍵。
    if (!spaceKeyHeld) { // 忽略長按空白鍵產生的重複按鍵事件。
      spaceKeyHeld = true; // 記錄空白鍵已經按住。
      if (!isCastingMagic && !isEffectActive) { // 僅在沒有施法或飛行特效時開始新施法。
        isCastingMagic = true; // 啟動施法動畫。
        magicStartFrame = frameCount; // 記錄施法動畫的起始影格。
        magicFacingDirection = facingDirection; // 記錄施法開始時角色面對的方向。
      } // 結束施法啟動判斷。
    } // 結束空白鍵首次按下判斷。
    return false; // 阻止瀏覽器執行空白鍵的預設捲動行為。
  } // 結束空白鍵處理。
} // 結束按鍵事件函式。
function keyReleased() { // 方向鍵或空白鍵放開時更新按鍵狀態。
  if (key === " ") { // 確認放開的是空白鍵。
    spaceKeyHeld = false; // 允許下次按空白鍵時再次施法。
    return false; // 阻止瀏覽器執行空白鍵放開的預設行為。
  } // 結束空白鍵放開處理。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 確認放開的是左右方向鍵。
    return false; // 阻止瀏覽器執行方向鍵放開的預設捲動行為。
  } // 結束方向鍵放開處理。
} // 結束按鍵放開事件函式。
function windowResized() { // 瀏覽器視窗尺寸改變時更新畫布。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗。
  characterCenterX = constrain(characterCenterX, 0, width); // 視窗縮放後將角色位置限制在新的畫布範圍。
} // 結束視窗尺寸變更處理函式。
