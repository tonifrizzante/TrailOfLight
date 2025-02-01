import Player from "./player.js";
import Ground from "./ground.js";
import CoinController from "./coinController.js";
import MonsteriController from "./monsteriController.js";
import Score from "./score.js";

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  const gameHeader = document.getElementById("game-header");
  const gameContainer = document.getElementById("game-container");
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // ---- GAME CONSTANTS ----
  const GAME_SPEED_START = 1;
  const GAME_SPEED_INCREMENT = 0.00001;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 200;
  const PLAYER_WIDTH = 100 / 1.5;
  const PLAYER_HEIGHT = 100 / 1.5;
  const MAX_JUMP_HEIGHT = GAME_HEIGHT;
  const MIN_JUMP_HEIGHT = 150;
  const GROUND_WIDTH = 2400;
  const GROUND_HEIGHT = 24;
  const GROUND_AND_MONSTER_SPEED = 0.5;

  // We'll collect 10 coins to win
  const MONSTERI_CONFIG = [
    { width: 100, height: 100 / 1.5, image: "images/monster_1.png" },
    { width: 100, height: 100 / 1.5, image: "images/monster_2.png" },
    { width: 100, height: 70 / 1.5, image: "images/monster_3.png" },
  ];

  // ---- GAME STATE ----
  let scaleRatio = null;
  let player = null;
  let ground = null;
  let monsteriController = null;
  let coinController = null;
  let score = null;
  let previousTime = null;
  let gameSpeed = GAME_SPEED_START;
  let gameOver = false;
  let gameWon = false;
  let waitingToStart = true;
  let hasAddedEventListenersForRestart = false;

  // Background
  const backgroundImage = new Image();
  backgroundImage.src = "images/background.png";

  // ---- SHOW/HIDE SCREEN LOGIC ----

  // Hides the start screen, shows the game area
  function startGame() {
    startScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    gameHeader.classList.remove("hidden");
    gameContainer.classList.remove("hidden");
    waitingToStart = false;
    requestAnimationFrame(gameLoop);
  }

  // Hides the game area, shows the end screen
  function showEndScreen() {
    gameHeader.classList.add("hidden");
    gameContainer.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }

  // ---- EVENT LISTENER TO START THE GAME ----
  document.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.key === " ") && waitingToStart) {
      startGame();
    }
  });

  // Configure canvas and create all game objects
  function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
  }

  function getScaleRatio() {
    const screenHeight = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight
    );
    const screenWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
      return screenWidth / GAME_WIDTH;
    } else {
      return screenHeight / GAME_HEIGHT;
    }
  }

  // Instantiate game objects
  function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    player = new Player(
      ctx,
      playerWidthInGame,
      playerHeightInGame,
      minJumpHeightInGame,
      maxJumpHeightInGame,
      scaleRatio
    );

    ground = new Ground(
      ctx,
      GROUND_WIDTH * scaleRatio,
      GROUND_HEIGHT * scaleRatio,
      GROUND_AND_MONSTER_SPEED,
      scaleRatio
    );

    const monsteriImages = MONSTERI_CONFIG.map((monster) => {
      const image = new Image();
      image.src = monster.image;
      return {
        image,
        width: monster.width * scaleRatio,
        height: monster.height * scaleRatio,
      };
    });

    monsteriController = new MonsteriController(
      ctx,
      monsteriImages,
      scaleRatio,
      GROUND_AND_MONSTER_SPEED
    );

    const coinImage = new Image();
    coinImage.src = "images/coin.png";
    coinController = new CoinController(
      ctx,
      coinImage,
      scaleRatio,
      GROUND_AND_MONSTER_SPEED
    );

    score = new Score(ctx, scaleRatio);
  }

  // Clear or draw background each frame
  function clearScreen() {
    if (backgroundImage.complete) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Show game over text (on the canvas)
  function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width / 4.5, canvas.height / 2);
  }

  // ---- HANDLE RESET ----
  function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
      hasAddedEventListenersForRestart = true;
      setTimeout(() => {
        window.addEventListener("keyup", reset, { once: true });
        window.addEventListener("touchstart", reset, { once: true });
      }, 1000);
    }
  }

  function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    gameWon = false;
    waitingToStart = false;
    ground.reset();
    monsteriController.reset();
    coinController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;

    window.removeEventListener("keyup", reset);
    window.removeEventListener("touchstart", reset);

    // Hide the end screen
    endScreen.classList.add("hidden");
    // Show the game container again
    gameHeader.classList.remove("hidden");
    gameContainer.classList.remove("hidden");

    requestAnimationFrame(gameLoop);
  }

  // ---- MAIN GAME LOOP ----
  function gameLoop(currentTime) {
    if (previousTime === null) {
      previousTime = currentTime;
      requestAnimationFrame(gameLoop);
      return;
    }

    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    // Update entities if game is active
    if (!gameOver && !waitingToStart && !gameWon) {
      ground.update(gameSpeed, frameTimeDelta);
      monsteriController.update(gameSpeed, frameTimeDelta);
      coinController.update(gameSpeed, frameTimeDelta);
      player.update(gameSpeed, frameTimeDelta);
      score.update(frameTimeDelta);

      // Increase difficulty over time
      gameSpeed += GAME_SPEED_INCREMENT * frameTimeDelta;

      // Check if all coins are collected => player wins
      if (coinController.collectedCoins >= coinController.totalCoinsNeeded) {
        gameWon = true;
        score.setBestTimeIfAllCoinsCollected(
          coinController.collectedCoins,
          coinController.totalCoinsNeeded
        );
      }

      // Check collisions with monsters => game over
      if (monsteriController.collideWith(player)) {
        gameOver = true;
        setupGameReset();
      }

      // Check collisions with coins
      coinController.collideWith(player);
    }

    // Draw updated entities
    ground.draw();
    monsteriController.draw();
    coinController.draw();
    player.draw();
    score.draw();

    // Show game over text on canvas
    if (gameOver) {
      showGameOver();
    }

    // If the game is won, show the end screen and wait for reset
    if (gameWon) {
      showEndScreen();
      setupGameReset();
    }

    requestAnimationFrame(gameLoop);
  }

  // ---- INITIALIZE ----
  previousTime = null;
  setScreen();

  // Recalculate size on resize
  window.addEventListener("resize", () => setTimeout(setScreen, 500));
});