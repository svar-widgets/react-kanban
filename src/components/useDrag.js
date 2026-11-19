export class DndState {
  constructor() {
    this.active = false;
    this.cardId = null;
    this.sourceColumn = null;
    this.width = 0;
    this.height = 0;
    this.pointer = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.target = null;
    /** Target of the external `cardProjection`; never touched by internal drag. */
    this.external = null;
    this._notify = null;
  }

  /** Placeholder target: an active internal drag wins even without a target. */
  get preview() {
    return this.active ? this.target : this.external;
  }

  reset() {
    this.active = false;
    this.cardId = null;
    this.sourceColumn = null;
    this.target = null;
    this._notify?.();
  }
}
