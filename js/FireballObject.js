class FireballObject extends AbstractGameObject {
  constructor(args) {
    super(args);
    this.type = GameObjectType.FIREBALL;
    this.sprite = GameSpritesData[GameObjectType.FIREBALL];
  }

  /**
   * TODO [TASK 2.2]
   * @param {Object} gameState
   * @param {number} timeframe
   */
  behave(gameState, timeframe) {
    if (this.y > GameFrame.HEIGHT - this.height / 2) {
      this.state = ObjectState.DISPOSED;
    }
    if (this._checkDirection(MovementDirection.UP)) {
      this.y -= (this.speed / 10) * timeframe;
    } else {
      this.y += (this.speed / 10) * timeframe;
    }

    if (this._checkDirection(MovementDirection.LEFT)) {
      this.x -= this.speed * timeframe;
    }

    if (this._checkDirection(MovementDirection.RIGHT)) {
      this.x += this.speed * timeframe;
    }

    if (this.x < 0 || this.x > GameFrame.WIDTH - this.width) {
      this.state = ObjectState.DISPOSED;
    }
  }
}
