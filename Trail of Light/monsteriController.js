import monster from "./monster.js";
import Monster from "./monster.js";

export default class monsteriController {
  MONSTER_INTERVAL_MIN = 500;
  MONSTER_INTERVAL_MAX = 2000;

  nextMonsterInterval = null;
  monsteri = [];

  constructor(ctx, monsteriImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.monsteriImages = monsteriImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextMonsterTime();
  }

  setNextMonsterTime() {
    const num = this.getRandomNumber(
      this.MONSTER_INTERVAL_MIN,
      this.MONSTER_INTERVAL_MAX
    );

    this.nextMonsterInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createMonster() {
    const index = this.getRandomNumber(0, this.monsteriImages.length - 1); // Correct usage of monsteriImages
    const monsterImage = this.monsteriImages[index];
    
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - monsterImage.height;
  
    const monster = new Monster(
      this.ctx,
      x,
      y,
      monsterImage.width,
      monsterImage.height,
      monsterImage.image // Correct spelling here
    );
  
    this.monsteri.push(monster);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextMonsterInterval <= 0) {
      this.createMonster();
      this.setNextMonsterTime();
    }
    this.nextMonsterInterval -= frameTimeDelta;

    this.monsteri.forEach((monster) => {
      monster.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.monsteri = this.monsteri.filter((monster) => monster.x > -monster.width);
  }

  draw() {
    this.monsteri.forEach((monster) => monster.draw());
  }

  collideWith(sprite) {
    return this.monsteri.some((monster) => monster.collideWith(sprite));
  }

  reset() {
    this.monsteri = [];
  }
}