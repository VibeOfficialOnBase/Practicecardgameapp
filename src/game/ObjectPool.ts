// Small object pool for frequently spawned entities.
// Assumes pooled objects expose reset(...) when reused.
// Usage:
//   const pool = new ObjectPool(() => new MyEnemy(), 30);
//   const enemy = pool.get(); enemy.reset(...); ...
//   pool.release(enemy);

export class ObjectPool<T> {
  private createFn: () => T;
  private pool: T[] = [];
  private maxSize: number;

  constructor(createFn: () => T, initialSize = 10, maxSize = 100) {
    this.createFn = createFn;
    this.maxSize = maxSize;
    for (let i = 0; i < initialSize; i++) this.pool.push(this.createFn());
  }

  get(): T {
    return this.pool.pop() ?? this.createFn();
  }

  release(obj: T) {
    if (this.pool.length < this.maxSize) this.pool.push(obj);
    // otherwise let GC collect
  }

  size() { return this.pool.length; }
}
