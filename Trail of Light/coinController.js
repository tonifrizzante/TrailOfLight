import Coin from "./coin.js";

export default class CoinController {
  COIN_INTERVAL_MIN = 800;
  COIN_INTERVAL_MAX = 1500;

  nextCoinInterval = null;
  coins = [];
  collectedCoins = 0;
  totalCoinsNeeded = 10; // Number of coins required to finish the game

  constructor(ctx, coinImage, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.coinImage = coinImage;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCoinTime();
  }

  setNextCoinTime() {
    const num = this.getRandomNumber(
      this.COIN_INTERVAL_MIN,
      this.COIN_INTERVAL_MAX
    );
    this.nextCoinInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCoin() {
    const x = this.canvas.width * 1.5; // Spawn off-screen
    const y = Math.random() * (this.canvas.height - 50 * this.scaleRatio); // Random height
    const coin = new Coin(
      this.ctx,
      x,
      y,
      30 * this.scaleRatio, // Coin width
      30 * this.scaleRatio, // Coin height
      this.coinImage
    );

    this.coins.push(coin);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCoinInterval <= 0) {
      this.createCoin();
      this.setNextCoinTime();
    }
    this.nextCoinInterval -= frameTimeDelta;

    this.coins.forEach((coin) => {
      coin.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    // Remove off-screen coins
    this.coins = this.coins.filter((coin) => coin.x > -coin.width);
  }

  draw() {
    this.coins.forEach((coin) => coin.draw());

    // Draw progress bar
    this.drawProgressBar();
  }

  drawProgressBar() {
    const barWidth = 150 * this.scaleRatio;
    const barHeight = 20 * this.scaleRatio;
    const barX = 10 * this.scaleRatio;
    const barY = 10 * this.scaleRatio;

    // Background bar
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(barX, barY, barWidth, barHeight);

    // Filled bar
    const filledWidth =
      (this.collectedCoins / this.totalCoinsNeeded) * barWidth;
    this.ctx.fillStyle = "gold";
    this.ctx.fillRect(barX, barY, filledWidth, barHeight);

    // Text
    this.ctx.fillStyle = "black";
    this.ctx.font = `${12 * this.scaleRatio}px Arial`;
    this.ctx.fillText(
      `${this.collectedCoins}/${this.totalCoinsNeeded}`,
      barX + 5,
      barY + barHeight - 5
    );
  }

  collideWith(sprite) {
    this.coins.forEach((coin, index) => {
      if (coin.collideWith(sprite)) {
        this.collectedCoins++;
        this.coins.splice(index, 1); // Remove collected coin

        if (this.collectedCoins >= this.totalCoinsNeeded) {
          this.finishGame();
        }
      }
    });
  }

  finishGame() {
    console.log("Game Finished! You collected all the coins!");
    // Add any additional logic for ending the game here
  }

  reset() {
    this.coins = [];
    this.collectedCoins = 0;
  }
}