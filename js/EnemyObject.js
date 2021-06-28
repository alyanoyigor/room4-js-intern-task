class EnemyObject extends FireballsThrowerObject {
  constructor(args) {
    super(args);
    this.type = GameObjectType.ENEMY;
    this.sprite = GameSpritesData[GameObjectType.ENEMY];
  }

  /**
   * @param {Object} gameState
   * @param {number} timeframe
   */

  behave(gameState, timeframe) {
    // TODO [TASK 3.1]
    this.x += this.speed * timeframe * 2;
    if (this.x + this.width > GameFrame.WIDTH) {
      this.speed = -this.speed;
      this._setDirection(MovementDirection.LEFT);
    }
    if (this.x < 0) {
      this.speed = -this.speed;
      this._setDirection(MovementDirection.RIGHT);
    }
    // TODO [TASK 3.2]
    let rand = Math.floor(Math.random() * 100 + 1);
    if (rand === 1) {
      this._throwFireball(gameState);
    }
    // TODO [TASK 5.2]
    const fireballObj = gameState.objects[2];
    let enemyAndFireballDist = Math.hypot(
      fireballObj?.x - this.x,
      fireballObj?.y - this.y
    );
    if (enemyAndFireballDist - fireballObj?.width < 1) {
      this.state = ObjectState.DISPOSED;
    }
  }
}
