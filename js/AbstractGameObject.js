/** @abstract */
class AbstractGameObject {
  constructor({ height, width, direction, speed, x, y, angle = 0 }) {
    this.direction = direction;
    this.height = height;
    this.speed = speed;
    this.width = width;
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.state = ObjectState.ACTIVE;
    this.sprite = null;
    this.type = null;
  }

  _checkDirection(direction) {
    return this.direction & direction;
  }

  _setDirection(newDirection) {
    if (newDirection === MovementDirection.EMPTY) {
      this.direction = newDirection;
      return;
    }

    const directionAntagonistCodes = { 1: 2, 2: 1, 4: 8, 8: 4 };

    this.direction = this.direction & ~directionAntagonistCodes[newDirection];
    this.direction = this.direction | newDirection;
  }

  /** @abstract */
  behave(gameState, timeFrame) {
    throw new Error("Method is not implemented");
  }
}
