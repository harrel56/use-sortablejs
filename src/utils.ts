
export const swap = <T>(arr: T[], idx1: number, idx2: number) => {
  const copy = [...arr]
  const tmp = copy[idx1]
  copy[idx1] = copy[idx2]
  copy[idx2] = tmp
  return copy
}

export const moveItem = <T>(arr: T[], from: number, to: number) => {
  const copy = [...arr]
  const item = copy[from]
  copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export const insert = <T>(arr: T[], item: T, idx: number) => {
  const copy = [...arr]
  copy.splice(idx, 0, item)
  return copy
}

export const remove = <T>(arr: T[], idx: number) => {
  const copy = [...arr]
  copy.splice(idx, 1)
  return copy
}