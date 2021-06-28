"use strict";

window.GAME = (() => {
  const onLevelInitialized = (gameState) => {
    const playerObj = new PlayerObject({
      direction: MovementDirection.RIGHT,
      height: GameConst.Player.getHeight(GameConst.Player.width),
      speed: GameConst.Player.speed,
      width: GameConst.Player.width,
      x: GameConst.Player.getX(GameFrame.WIDTH),
      y: GameConst.Player.getY(GameFrame.HEIGHT),
    });

    const enemyObj = new EnemyObject({
      direction: MovementDirection.RIGHT,
      height: GameConst.Enemy.height,
      speed: GameConst.Enemy.speed,
      width: GameConst.Enemy.width,
      x: GameConst.Enemy.getX(GameFrame.WIDTH),
      y: GameConst.Enemy.getY(GameFrame.HEIGHT),
    });

    gameState.objects.push(playerObj);
    gameState.objects.push(enemyObj);
  };

  const game = new Game(
    document.querySelector("#game-area"),
    GAME_RULES,
    onLevelInitialized
  );

  window.restartGame = () => {
    game.initializeLevelAndStart();
    game.setGameStatus(GameStatus.INTRO);
  };

  window.restartGame();

  return game;
})();
