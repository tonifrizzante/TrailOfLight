export default class Score {
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.scaleRatio = scaleRatio;

    // We'll measure time in milliseconds
    this.currentTime = 0;
    this.bestTime = Infinity;
  }

  reset() {
    this.currentTime = 0;
  }

  setBestTimeIfAllCoinsCollected(collectedCoins, totalCoinsNeeded) {
    if (collectedCoins >= totalCoinsNeeded) {
      if (this.currentTime < this.bestTime) {
        this.bestTime = this.currentTime;
      }
    }
  }

  update(deltaTime) {
    this.currentTime += deltaTime;
  }

  draw() {
    // Convert times to seconds
    const currentSeconds = (this.currentTime / 1000).toFixed(2);
    let bestTimeText = "N/A";
    if (this.bestTime < Infinity) {
      bestTimeText = (this.bestTime / 1000).toFixed(2);
    }

    // Smaller scoreboard styling
    const padding = 10 * this.scaleRatio;
    const boxWidth = 160 * this.scaleRatio;
    const boxHeight = 50 * this.scaleRatio;

    // Position the box in top-right corner
    const x = this.ctx.canvas.width - boxWidth - padding;
    const y = padding;

    // Draw semi-transparent background box
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(x, y, boxWidth, boxHeight);

    // Set smaller font and right-aligned text
    const fontSize = 14 * this.scaleRatio;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "right";

    // We want our text to line up along the right side inside the box
    // We'll draw each line at the right edge (x + boxWidth - padding)
    const textX = x + boxWidth - padding;
    let textY = y + fontSize + padding / 2;

    // Current time
    this.ctx.fillText(`Time: ${currentSeconds}s`, textX, textY);

    // Best time (next line)
    textY += fontSize + 2;
    this.ctx.fillText(`Best: ${bestTimeText}s`, textX, textY);

    // Restore default alignment if needed for other drawings
    this.ctx.textAlign = "start";
  }
}