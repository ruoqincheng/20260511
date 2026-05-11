let capture;
let poseNet;
let poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  try {
    capture = createCapture(VIDEO);
    capture.size(windowWidth * 0.5, windowHeight * 0.5);
    capture.hide();

    // 初始化 PoseNet 模型
    poseNet = ml5.poseNet(capture, modelReady);
    // 當偵測到人體動作時，更新 poses 變數
    poseNet.on('pose', function(results) {
      poses = results;
    });
  } catch (error) {
    console.error("無法存取攝影機，請檢查攝影機是否連接或權限設定。", error);
    // 如果無法存取攝影機，可以考慮在這裡顯示一個錯誤訊息或替代內容
  }
}

function modelReady() {
  console.log('模型已準備就緒！');
}

function draw() {
  background('#e7c6ff');

  let vw = windowWidth * 0.5;
  let vh = windowHeight * 0.5;
  let vx = (width - vw) / 2;
  let vy = (height - vh) / 2;

  push();
  // 移動座標軸並進行水平翻轉 (左右顛倒)
  translate(vx + vw, vy);
  scale(-1, 1);

  // 繪製影像
  image(capture, 0, 0, vw, vh);

  // 繪製耳垂部分的黃色圓圈
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    fill(255, 255, 0); // 黃色
    noStroke();
    // 偵測左耳 (PoseNet 關鍵點，稍微增加 Y 偏移以對準耳垂)
    if (pose.leftEar && pose.leftEar.confidence > 0.2) {
      circle(pose.leftEar.x, pose.leftEar.y + 10, 20);
    }
    // 偵測右耳
    if (pose.rightEar && pose.rightEar.confidence > 0.2) {
      circle(pose.rightEar.x, pose.rightEar.y + 10, 20);
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth * 0.5, windowHeight * 0.5);
}
