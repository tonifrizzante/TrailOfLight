# Development Diary - Trail of Light

## **Day 1: Brainstorming and Initial Setup**
Today, I started conceptualizing *Trail of Light*, a side-scrolling platformer where the player controls Minka, a glowing cat, collecting light fragments while avoiding dark monsters. I set up the project structure, creating the necessary files: `index.html`, `style.css`, and `index.js`. My main focus was setting up the game canvas and ensuring the background and game elements could be displayed properly.

## **Day 2: Player Mechanics and Movement**
I focused on implementing **player movement** today. Using `player.js`, I coded the jump mechanics, making sure Minka responds well to input and lands naturally using gravity logic. I also worked on **animations**, switching sprites for running and jumping actions. After multiple tweaks, movement felt fluid and natural.

## **Day 3: Implementing Coins and Collectibles**
The next major addition was the **coin system**, handled through `coin.js` and `coinController.js`. Coins now spawn randomly on the screen and move toward the player. I added a **progress bar** to track how many coins the player has collected. Once Minka collects 10 coins, the game is won.

## **Day 4: Enemy Spawning & Collision Detection**
Today, I focused on adding **monsters** using `monster.js` and `monsteriController.js`. They spawn at random intervals and move toward the player. I spent time tweaking **collision detection**, ensuring the game ends when Minka collides with a monster. After several tests, the hitbox detection felt fair and balanced.

## **Day 5: Game Loop, UI & Polish**
I refined the **main game loop** in `index.js`, ensuring all game elements update, draw, and interact correctly. I also worked on the **start and end screens** in `index.html`, improving UI transitions when the player wins or loses. The progress bar was polished to make it visually clear.

## **Day 6: Final Testing and Debugging**
Unfortunately, I wasn’t feeling well today, but I still managed to finish testing and debugging. I fixed minor **gameplay bugs**, adjusted difficulty balancing, and refined the **best time tracking system** in `score.js`. Even though I wasn’t at 100%, I pushed through and completed the game. It’s been a great experience, and I’m really proud of what I created!

## **Final Thoughts**
*Trail of Light* turned out better than expected. It’s simple but fun, and I learned a lot throughout the process. If I had more time, I’d add **sound effects, and a slashing function**. Overall, I’m happy with how it all came together!



