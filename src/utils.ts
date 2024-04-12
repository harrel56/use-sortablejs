export const shallowClone = (item: any) => {
  if (typeof item === 'object') {
    return {...item}
  } else if (Array.isArray(item)) {
    return [...item]
  } else {
    return item
  }
}

export const swap = <T>(arr: T[], idx1: number, idx2: number) => {
  const copy = [...arr]
  const tmp = copy[idx1]
  copy[idx1] = copy[idx2]
  copy[idx2] = tmp
  return copy
}

export const moveItem = <T>(arr: T[], from: number, to: number) => {
  const copy = [...arr]
  const item = copy.splice(from, 1)[0]
  copy.splice(to, 0, item)
  return copy
}

export const moveItems = <T>(arr: T[], from: number[], to: number) => {
  let copy = [...arr]
  const items = copy.filter((_, idx) => from.includes(idx))
  copy = copy.filter((_, idx) => !from.includes(idx))
  copy.splice(to, 0, ...items)
  return copy
}

export const insert = <T>(arr: T[], idx: number, ...items: T[]) => {
  const copy = [...arr]
  copy.splice(idx, 0, ...items)
  return copy
}

export const remove = <T>(arr: T[], idx: number) => {
  const copy = [...arr]
  copy.splice(idx, 1)
  return copy
}

export const removeAll = <T>(arr: T[], toRemove: number[]) => {
  return arr.filter((_, idx) => !toRemove.includes(idx))
}

export const replace = <T>(arr: T[], idx: number, item: T) => {
  const copy = [...arr]
  copy[idx] = item
  return copy
}

export class BiDiMap<K, V> {
  #map = new Map<K, V>()
  #reversed = new Map<V, K>()

  set(key: K, value: V) {
    this.#map.delete(this.#reversed.get(value)!);
    this.#reversed.delete(this.#map.get(key)!);
    this.#map.set(key, value)
    this.#reversed.set(value, key)
    return this
  }

  getValue(key: K) {
    return this.#map.get(key)
  }

  deleteValue(value: V) {
    this.#map.delete(this.#reversed.get(value)!)
    return this.#reversed.delete(value)
  }
}