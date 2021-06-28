/** @abstract */
class FireballsThrowerObject extends AbstractGameObject {
  _throwFireball(gameState) {
    const fireballWidth = GameConst.Fireball.size * 2;
    const fireballHeight = GameConst.Fireball.size;

    const fireballX = this._checkDirection(MovementDirection.RIGHT)
      ? this.x + this.width - fireballWidth / 2
      : this.x - GameConst.Fireball.size - fireballWidth / 2;

    const fireballY = this.y + this.height / 2;

    const fireballObj = new FireballObject({
      direction: this.direction,
      speed: GameConst.Fireball.getSpeed(
        this._checkDirection(MovementDirection.LEFT)
      ),
      width: fireballWidth,
      height: fireballHeight,
      x: fireballX,
      y: fireballY,
      angle: -20,
    });

    gameState.objects.push(fireballObj);
  }
}
