const KeyCodes = {
  ESCAPE: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

const GameFrame = {
  WIDTH: 500,
  HEIGHT: 250,
};

const GameObjectType = {
  PLAYER: 0,
  FIREBALL: 1,
  ENEMY: 2,
};

const ObjectState = {
  ACTIVE: 0,
  DISPOSED: 1,
};

const MovementDirection = {
  EMPTY: 0,
  LEFT: 1,
  RIGHT: 2,
  UP: 4,
  DOWN: 8,
};

const GameStatus = {
  CONTINUE: 0,
  WIN: 1,
  FAIL: 2,
  PAUSE: 3,
  INTRO: 4,
};

const GameConst = {
  Fireball: {
    size: 30,
    getSpeed: (isLeftDirection) =>
      isLeftDirection
        ? Math.floor(3 + Math.random() * 6)
        : Math.floor(2 + Math.random() * 4), // TODO [TASK 2.1]
  },
  Player: {
    speed: 2,
    width: 150,
    getHeight: (width) => width,
    getX: (width) => width / 3,
    getY: (height) => height - 140,
  },
  Enemy: {
    speed: 1,
    width: 100,
    height: 82,
    getX: (width) => (width * 2) / 3,
    getY: (height) => height - 82,
  },
};

const FLIPPED = "-reversed";

const GameSpritesData = {
  [GameObjectType.PLAYER]: {
    width: 150,
    height: 150,
    url: "https://interns.room4.team/test-task-v1/player.png",
  },
  [GameObjectType.PLAYER + FLIPPED]: {
    width: 120,
    height: 120,
    url: "https://interns.room4.team/test-task-v1/player-reversed.png",
  },
  [GameObjectType.FIREBALL]: {
    width: 28,
    height: 14,
    url: "https://interns.room4.team/test-task-v1/comet.png",
  },
  [GameObjectType.ENEMY]: {
    width: 78,
    height: 82,
    url: "https://interns.room4.team/test-task-v1/enemy.png",
  },
  [GameObjectType.ENEMY + FLIPPED]: {
    width: 78,
    height: 82,
    url: "https://interns.room4.team/test-task-v1/enemy-reversed.png",
  },
};

const GAME_MESSAGES = {
  [GameStatus.WIN]: "You win!\nYeah!",
  [GameStatus.FAIL]: "You loose!",
  [GameStatus.PAUSE]: "Game paused!\nPress Space to continue",
  [GameStatus.INTRO]: "Welcome!\nPress Space to start the game",
};
