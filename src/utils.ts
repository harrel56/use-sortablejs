
export const shallowClone = (item: any) => {
  if (typeof item === 'object') {
    return {...item}
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