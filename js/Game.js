const GAME_RULES = [
  /**
   * Player dies - game over.
   * @param {Object} gameState
   * @return {GameStatus}
   */
  (gameState) => {
    const player = gameState.objects.filter(
      (object) => object.type === GameObjectType.PLAYER
    )[0];
    return player?.state === undefined ? GameStatus.FAIL : GameStatus.CONTINUE;
  },

  /**
   * Pressed ESC button can pause/resume the game
   * @param {Object} gameState
   * @return {GameStatus}
   */
  (gameState) => {
    return gameState.keysPressed.ESC ? GameStatus.PAUSE : GameStatus.CONTINUE;
  },

  /**
   * TODO [TASK 4.1]
   * Demo condition: game round considering as won if thrown fireball shoot the left side of game area
   * @param {Object} gameState
   * @return {GameStatus}
   */
  (gameState) => {
    const enemy = gameState.objects.filter(
      (object) => object.type === GameObjectType.ENEMY
    )[0];
    return enemy?.state === undefined ? GameStatus.WIN : GameStatus.CONTINUE;
  },
];

class Game {
  /**
   * @param {Element} container
   * @param {Function[]} rules
   * @param {Function | null} onLevelInitializedCallback
   * @constructor
   */
  constructor(container, rules, onLevelInitializedCallback = null) {
    this.container = container;
    this.rules = rules;
    this.onLevelInitialized = onLevelInitializedCallback;

    this._prepareRenderingContext();

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);

    this.setDeactivated(false);
  }

  _prepareRenderingContext() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
  }

  /** @param {boolean} deactivated */
  setDeactivated(deactivated) {
    if (this._deactivated === deactivated) {
      return;
    }

    this._deactivated = deactivated;

    if (deactivated) {
      this._removeGameListeners();
    } else {
      this._initializeGameListeners();
    }
  }

  /**
   * @return {Object}
   */
  getInitialState() {
    return {
      currentStatus: GameStatus.CONTINUE,
      objectsToDispose: [], // deleted objects since the last game tick
      lastUpdated: null,
      keysPressed: {
        ESC: false,
        SPACE: false,
        LEFT: false,
        RIGHT: false,
        UP: false,
        DOWN: false,
      },
      gameStartedAt: null,
      objects: [],
      startTime: null,
    };
  }

  /**
   * @param {boolean} restart
   */
  initializeLevelAndStart(restart = true) {
    if (restart || !this.state) {
      this._mediaIsPreloaded = false;
      this.state = this.getInitialState();

      if (this.onLevelInitialized) {
        this.onLevelInitialized(this.state);
      }
    } else {
      this.state.currentStatus = GameStatus.CONTINUE;
    }

    this.state.gameStartedAt = Date.now();
    if (!this.state.startTime) {
      this.state.startTime = this.state.gameStartedAt;
    }

    this._preloadImagesForLevel().then(() => {
      this.render();
      this._initializeGameListeners();
      this.processGameCycle();
    });
  }

  /**
   * @param {GameStatus=} verdict
   */
  pauseLevel(verdict) {
    if (verdict) {
      this.state.currentStatus = verdict;
    }

    this.state.keysPressed.ESC = false;
    this.state.lastUpdated = null;

    this._removeGameListeners();
    window.addEventListener("keydown", this._pauseListener);

    this._drawPauseScreen();
  }

  /**
   * @param {KeyboardEvent} evt
   * @private
   */
  _pauseListener(evt) {
    if (evt.keyCode === KeyCodes.SPACE && !this._deactivated) {
      evt.preventDefault();

      const isRestart = [GameStatus.WIN, GameStatus.FAIL].includes(
        this.state.currentStatus
      );
      this.initializeLevelAndStart(isRestart);

      window.removeEventListener("keydown", this._pauseListener);
    }
  }

  _drawPauseScreen() {
    this._drawMessage(GAME_MESSAGES[this.state.currentStatus]);
  }

  _drawMessage(message) {
    const ctx = this.ctx;

    const drawCloud = (x, y, width, heigth) => {
      const offset = 2;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + offset, y + heigth / 2);
      ctx.lineTo(x, y + heigth);
      ctx.lineTo(x + width / 2, y + heigth - offset);
      ctx.lineTo(x + width, y + heigth);
      ctx.lineTo(x + width - offset, y + heigth / 2);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width / 2, y + offset);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      ctx.fill();
    };

    ctx.fillStyle = "rgba(256, 256, 256, .3)";
    drawCloud(195, 85, 220, 100);

    ctx.fillStyle = "rgba(256, 256, 256, 0.8)";
    drawCloud(190, 80, 220, 100);

    ctx.fillStyle = "#000";
    ctx.font = "16px PT Mono";
    message
      .split("\n")
      .forEach((line, i) => ctx.fillText(line, 210, 130 + 20 * i));
  }

  /**
   * @param {Object} spriteObj
   * @return {Promise<void>}
   * @private
   */
  _loadSpriteObject(spriteObj) {
    return new Promise((resolve) => {
      const image = new Image(spriteObj.width, spriteObj.height);
      image.src = spriteObj.url;
      image.onload = () => {
        spriteObj.image = image;
        resolve();
      };
    });
  }

  /** @private */
  async _preloadImagesForLevel() {
    if (this._mediaIsPreloaded) {
      return;
    }

    const keys = Object.keys(GameSpritesData);
    await Promise.all(
      keys.map((GameSpritesDataKey) =>
        this._loadSpriteObject(GameSpritesData[GameSpritesDataKey])
      )
    );
    this._mediaIsPreloaded = true;
  }

  /**
   * @param {number} delta - time elapsed since the previous game tick
   */
  processGameObjects(delta) {
    this.state.objectsToDispose = [];
    this.state.objects.forEach((object) => object.behave(this.state, delta));
    this.state.objectsToDispose = this.state.objects.filter(
      (object) => object.state === ObjectState.DISPOSED
    );
    this.state.objects = this.state.objects.filter(
      (object) => !this.state.objectsToDispose.includes(object)
    );
  }

  checkStatus() {
    if (this.state.currentStatus !== GameStatus.CONTINUE) {
      return;
    }

    let currentCheck = GameStatus.CONTINUE;
    let ruleIdx = 0;

    while (
      ruleIdx < this.rules.length &&
      currentCheck === GameStatus.CONTINUE
    ) {
      currentCheck = this.rules[ruleIdx](this.state);
      ruleIdx++;
    }

    this.state.currentStatus = currentCheck;
  }

  /**
   * @param {GameStatus} status
   */
  setGameStatus(status) {
    if (this.state.currentStatus !== status) {
      this.state.currentStatus = status;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, GameFrame.WIDTH, GameFrame.HEIGHT);

    this.state.objects.forEach((object) => {
      if (!object.sprite) {
        return;
      }

      const isFlipped = object.direction & MovementDirection.LEFT;
      const sprite =
        GameSpritesData[object.type + (isFlipped ? FLIPPED : "")] ||
        GameSpritesData[object.type];

      this.ctx.save();
      this.ctx.translate(object.x, object.y);
      this.ctx.rotate((object.angle * Math.PI) / 180);
      this.ctx.drawImage(sprite.image, 0, 0, object.width, object.height);
      this.ctx.restore();
    });
  }

  processGameCycle() {
    const now = Date.now();

    if (!this.state.lastUpdated) {
      this.state.lastUpdated = now;
    }

    const delta = (now - this.state.lastUpdated) / 10;
    this.processGameObjects(delta);
    this.checkStatus();

    switch (this.state.currentStatus) {
      case GameStatus.CONTINUE:
        this.state.lastUpdated = now;
        this.render();
        requestAnimationFrame(() => this.processGameCycle());
        break;

      case GameStatus.WIN:
      case GameStatus.FAIL:
      case GameStatus.PAUSE:
      case GameStatus.INTRO:
        this.pauseLevel();
        break;
    }
  }

  /**
   * @param evt {KeyboardEvent} evt
   * @param stateModifierVal {boolean}
   * @private
   */
  _updateKeyState(evt, stateModifierVal) {
    const keysMap = {
      [KeyCodes.ARROW_LEFT]: "LEFT",
      [KeyCodes.ARROW_RIGHT]: "RIGHT",
      [KeyCodes.ARROW_UP]: "UP",
      [KeyCodes.ARROW_DOWN]: "DOWN",
      [KeyCodes.ESCAPE]: "ESC",
      [KeyCodes.SPACE]: "SPACE",
    };

    if (keysMap.hasOwnProperty(evt.keyCode)) {
      this.state.keysPressed[keysMap[evt.keyCode]] = stateModifierVal;
    }

    if (evt.shiftKey) {
      this.state.keysPressed.SHIFT = stateModifierVal;
    }
  }

  /**
   * @param {KeyboardEvent} evt
   * @private
   */
  _onKeyDown(evt) {
    this._updateKeyState(evt, true);
  }

  /**
   * @param {KeyboardEvent} evt
   * @private
   */
  _onKeyUp(evt) {
    this._updateKeyState(evt, false);
  }

  /** @private */
  _initializeGameListeners() {
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  /** @private */
  _removeGameListeners() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }
}
