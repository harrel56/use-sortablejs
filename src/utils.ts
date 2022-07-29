
export class SmartArray<T> {
  readonly #arr: T[]

  constructor(arr: T[]) {
    this.#arr = [...arr];
  }

  get() {
    return [...this.#arr]
  }

  swap(idx1: number, idx2: number) {
    const tmp = this.#arr[idx1]
    this.#arr[idx1] = this.#arr[idx2]
    this.#arr[idx2] = tmp
    return [...this.#arr]
  }

  moveItem(from: number, to: number) {
    const item = this.#arr[from]
    this.#arr.splice(from, 1)
    this.#arr.splice(to, 0, item)
    return [...this.#arr]
  }

  add(item: T, idx: number) {
    this.#arr.splice(idx, 0, item)
    return [...this.#arr]
  }

  remove(idx: number) {
    this.#arr.splice(idx, 1)
    return [...this.#arr]
  }
}