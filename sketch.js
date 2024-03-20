//set the variables
let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let LeyeX = 0;
let LeyeY = 0;
let ReyeX = 0;
let ReyeY= 0;
let LwristX = 0;
let LwristY = 0;
let RwristX = 0;
let RwristY = 0;
let LshoulderX = 0
let LshoulderY = 0;
let RshoulderX = 0;
let RshoulderY = 0;
let counter = 0;
let blurAmount = 3;
let dayColor = 0;
let steer = 0;
let bgLayer;
let waveOp = 0;

//setup the ml5, video
function setup(){
  createCanvas(1280,960);
  video=createCapture(VIDEO);
  video.size(width,height);
  poseNet=ml5.poseNet(video, modelLoaded);
  poseNet.on('pose',gotPoses);
  video.hide();
  bgLayer=createGraphics(width,height); //set the second layer
}

function modelLoaded(){
  //console.log('model is ready to go!');
}

//get the variables from the poseNet
function gotPoses(poses){
  //console.log(poses);
  if(poses.length>0){
  noseX=poses[0].pose.keypoints[0].position.x;
  noseY=poses[0].pose.keypoints[0].position.y;
  LeyeX=poses[0].pose.keypoints[1].position.x;
  LeyeY=poses[0].pose.keypoints[1].position.y;
  ReyeX=poses[0].pose.keypoints[2].position.x;
  ReyeY=poses[0].pose.keypoints[2].position.y;
  newLwristX=poses[0].pose.keypoints[9].position.x;
  newLwristY=poses[0].pose.keypoints[9].position.y;
  newRwristX=poses[0].pose.keypoints[10].position.x;
  newRwristY=poses[0].pose.keypoints[10].position.y;
  LwristX=lerp(LwristX,newLwristX,0.5); // to make it smoother
  LwristY=lerp(LwristY,newLwristY,0.5);
  RwristX=lerp(RwristX,newRwristX,0.5);
  RwristY=lerp(RwristY,newRwristY,0.5);
  LshoulderX=poses[0].pose.keypoints[5].position.x;
  LshoulderY=poses[0].pose.keypoints[5].position.y;
  RshoulderX=poses[0].pose.keypoints[6].position.x;
  RshoulderY=poses[0].pose.keypoints[6].position.y;
  }
}

//main draw section
function draw() {
    background(220);
    translate(video.width, 0);
    scale(-1, 1);  //reverse the video
    image(video, 0, 0); 
    
    let time = new Date();       // clocks
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let currentTime = nf(hours, 2) + ':' + nf(minutes, 2) + ':' + nf(seconds, 2);  // only get 2 digits
    let fillHeight = map(seconds, 0, 60, 0, height); // Draw the wave (water effect)
    randomSeed(minutes);

    let waveColor = color(random(100, 255),random(100, 255),random(100, 255), waveOp);
    bgLayer.background(dayColor); //get the color of the second layer
    bgLayer.fill(waveColor); // wave color
    bgLayer.noStroke();
    // This rectangle starts from the bottom and grows upwards
    bgLayer.rect(0, height - fillHeight, width, fillHeight);
    // wave image
    image(bgLayer, 0, 0);
    push(); // Save current drawing style settings and transformations
    scale(-1, 1); // Apply mirroring scale again, which negates the earlier mirroring for this scope
    textSize(width / 4);
    textAlign(LEFT, TOP); // Adjust based on your text placement needs
    fill(230);
    text(currentTime, -width, height/3);
    // Draw the text at the correct position, negating the translation as well
    pop(); // Restores previous drawing style settings and transformations

  if(noseY > LwristY && noseY <= RwristY) { //left wrist checker
    bgLayer.scale(-1,1);
    bgLayer.erase(); //maksing effect
    bgLayer.ellipse(noseX+steer,noseY,width*4/5);
    bgLayer.noErase();


    fill(255);
    filter(BLUR, blurAmount); //getting blur when it holded long
    counter++; // count the 0.3 sec
    steer++; // moving the circle
  } 
  
  else if(noseY>RwristY && noseY<= LwristY){ //right wrist checker
    bgLayer.scale(-1,1);
    bgLayer.erase();
    bgLayer.ellipse(noseX+steer,noseY,width*4/5);
    bgLayer.noErase();
    fill(255);
    filter(BLUR, blurAmount);
    counter++;
    steer--;  // moving the circle other way
  } 
  
  else if (noseY>RwristY && noseY > LwristY){ // if both are raised then doesnt work
    push(); //reverse the text again
    scale(-1, 1); 
    textSize(32); 
    textAlign(CENTER, CENTER); 
    fill(255); 
    text("Try again with only one hand", -width / 2, height / 2 - 50);
    pop();
  }
  
  else { // set to origin
    counter = 0;
    blurAmount = 3;
  }

  if (counter > 20) { //blur effect for 0.3 sec
    counter = 0;
    blurAmount--;
  }


  if(hours >= 18 || hours < 6){ //night time checker
    dayColor = color(14,12,50, 60);
    waveOp=80;
    
  } else {
    dayColor = color(252,209,77, 60); //day color
    waveOp=50;
  }

 
}