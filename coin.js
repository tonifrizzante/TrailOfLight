export default class Coin {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.collected = false; // Tracks if the coin has been collected
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    if (!this.collected) {
      this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio; // Move the coin
    }
  }

  draw() {
    if (!this.collected) {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Draw the coin
    }
  }

  collideWith(sprite) {
    if (this.collected) return false; // Skip collision if already collected

    const adjustBy = 1.4;
    if (
      sprite.x < this.x + this.width / adjustBy &&
      sprite.x + sprite.width / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.y + sprite.height / adjustBy > this.y
    ) {
      this.collected = true; // Mark as collected
      return true;
    }
    return false;
  }
}