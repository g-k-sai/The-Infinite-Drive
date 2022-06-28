const PLAY = 1, END = 0;

const grass_bg_color = "#5CED73", sand_bg_color = "#EACE6A";

var gameState, score, bg_color, ga_var;

var road, car, left_boundary, right_boundary, bottom_boundary, top_boundary, obstacle_group, tree_group, gameOver, restart;

var road_img, car_anim, obstacle_img_1, obstacle_img_2, obstacle_img_3, obstacle_img_4, obstacle_img_5, obstacle_img_6, tree_img, explosion_img, gameOver_img, restart_img;

var fwdMovingSound, sideMovingSound, explodeSound, endSoundValue;


function preload(){
  road_img = loadImage("road.png");
  car_anim = loadAnimation("car_1.png", "car_2.png");
  
  obstacle_img_1 = loadImage("obstacle_1.png");
  obstacle_img_2 = loadImage("obstacle_2.png");
  obstacle_img_3 = loadImage("obstacle_3.png");
  obstacle_img_4 = loadImage("obstacle_4.png");
  obstacle_img_5 = loadImage("obstacle_5.png");
  obstacle_img_6 = loadImage("obstacle_6.png");
  
  tree_img = loadImage("tree.png");
  
  explosion_img = loadImage("explosion.png");
  
  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
  
  fwdMovingSound = loadSound("moving_sound.mp3");
  sideMovingSound = loadSound("side_moving_sound.mp3");
  explodeSound = loadSound("explosion_sound.wav");
}

function setup(){
  createCanvas(600, 300);
  
  gameState = PLAY;
  score = 0;
  bg_color = grass_bg_color;
  ga_var = 100;
  endSoundValue = false;
  
  road = createSprite(300, 150);
  road.addImage(road_img);
  road.scale = 0.5;
  road.y = 0;
  road.velocityY = 10;
  
  car = createSprite(300, 250);
  car.addAnimation("moving", car_anim);
  car.addImage("explode", explosion_img);
  car.scale = 0.125;
  car.setCollider("rectangle", 0, 0, 250, 550);
  
  left_boundary = createSprite(80, 300, 1, 600);
  left_boundary.visible = false;
  
  right_boundary = createSprite(520, 300, 1, 600);
  right_boundary.visible = false;
  
  bottom_boundary = createSprite(300, 300, 440, 3);
  bottom_boundary.visible = false;
  
  top_boundary = createSprite(300, 0, 440, 3);
  top_boundary.visible = false;
  
  obstacle_group = new Group();
  tree_group = new Group();
  
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.25;
  gameOver.visible = false;
  
  restart = createSprite(300, 160);
  restart.addImage(restart_img);
  restart.scale = 0.025;
  restart.visible = false;
}

function draw(){
  background(bg_color);
  fill("white");
  text("Score", 0, 10);
  text(score, 570, 10);
  
  if(gameState === PLAY){
      car.collide(left_boundary);
      car.collide(right_boundary);
      car.collide(bottom_boundary);
      car.collide(top_boundary);

      if(obstacle_group.isTouching(car)){
        gameState = END;
      }

      if(keyDown("a")){
        car.x -= 5;
        sideMovingSound.play();
      }

      if(keyDown("d")){
        car.x += 5;
        sideMovingSound.play();
      }

      if(keyDown("w")){
        car.y -= 5;
      }

      if(keyDown("s")){
        car.y += 5;
      }

      if(road.y > 400){
        road.y = 0;
      }
    
      if(score > 0){
        if(score % 100 === 0){
          if(bg_color === grass_bg_color){
            bg_color = sand_bg_color;
          }
          else{
            bg_color = grass_bg_color;
          }
        }
        if(ga_var > 50 && score % 120 === 0){
          ga_var -= 20;
        }
      }
      
      if(frameCount % 5 === 0){
        score += 1;
      }
      
      fwdMovingSound.play();
    
      spawnTrees();
      spawnObstacles();
  }
  else{
      gameOver.visible = true;
      gameOver.depth = car.depth+1;
      
      restart.visible = true;
      restart.depth = gameOver.depth;
    
      fwdMovingSound.stop();
      sideMovingSound.stop();
    
      if(!endSoundValue) explodeSound.play();
      endSoundValue = true;
      
      car.changeImage("explode");
      car.scale = 0.5;
      road.velocityY = 0;
      
      tree_group.setVelocityYEach(0);
      tree_group.setLifetimeEach(-1);
      
      obstacle_group.setVelocityYEach(0);
      obstacle_group.setLifetimeEach(-1);
  }
  
  if(gameState === END && mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  explodeSound.stop();
  
  tree_group.destroyEach();
  obstacle_group.destroyEach();
  
  road.velocityY = 10;
  car.changeAnimation("moving");
  car.scale = 0.125;
  car.x = 300;
  car.y = 250;
  car.depth = 2;
  
  frameCount = 0;
  score = 0;
  endSoundValue = false;
}


function spawnTrees(){
  if(frameCount % 30 === 0){
    let tree, randNum = round(random(1, 2));
    
    switch(randNum){
      case 1:
        tree = createSprite(40, 50);
        break;
      case 2:
        tree = createSprite(560, 50);
        break;
    }
    tree.addImage(tree_img);
    tree.scale = 0.3;
    tree.lifetime = 40;
    tree.velocityY = 10;
    
    tree_group.add(tree);
  }
}


function spawnObstacles(){
  if(frameCount % ga_var === 0){
    let obstacle = createSprite(round(random(120, 480)), -20), num = round(random(1,6));
    
    switch(num){
      case 1:
        obstacle.addImage(obstacle_img_1);
        obstacle.scale = 0.25;
        obstacle.setCollider("rectangle", 0, 0, 200, 400);
        break;
      case 2:
        obstacle.addImage(obstacle_img_2);
        obstacle.scale = 0.25;
        obstacle.setCollider("rectangle", 0, 0, 110, 300);
        break;
      case 3:
        obstacle.addImage(obstacle_img_3);
        obstacle.scale = 0.3;
        obstacle.setCollider("rectangle", 0, 0, 150, 300);
        break;
      case 4:
        obstacle.addImage(obstacle_img_4);
        obstacle.scale = 0.3;
        obstacle.setCollider("rectangle", 0, 0, 220, 450);
        break;
      case 5:
        obstacle.addImage(obstacle_img_5);
        obstacle.scale = 0.2;
        obstacle.setCollider("rectangle", 0, 0, 200, 500);
        break;
      case 6:
        obstacle.addImage(obstacle_img_6);
        obstacle.scale = 0.35;
        obstacle.setCollider("rectangle", 0, 0, 110, 390);
        break;
    }
    obstacle.lifetime = 100;
    obstacle.velocityY = 10;
    obstacle.depth = car.depth;
    car.depth += 1;
    
    obstacle_group.add(obstacle);
  }
}
