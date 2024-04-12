import {Context, createContext, PropsWithChildren, useRef} from 'react';
import {jsx} from "react/jsx-runtime";
import {BiDiMap} from './utils';

interface ContextContent {
  registerSortable: (sortable: HTMLElement, items: BiDiMap<HTMLElement, any>) => void
  unregisterSortable: (sortable: HTMLElement) => void
  findItem: <T, >(sortable: HTMLElement, item: HTMLElement) => T
}

export const SortableContext = createContext(null) as Context<ContextContent | null>

export const SortableProvider = (({children}: PropsWithChildren) => {

  const sortables = useRef(new Map<HTMLElement, BiDiMap<HTMLElement, any>>())

  const registerSortable = (sortable: HTMLElement, items: BiDiMap<HTMLElement, any>) => {
    sortables.current.set(sortable, items)
  }

  const unregisterSortable = (sortable: HTMLElement) => {
    sortables.current.delete(sortable)
  }

  const findItem = <T, >(sortable: HTMLElement, item: HTMLElement) => {
    return sortables.current.get(sortable)!.getValue(item) as T
  }

  return jsx(SortableContext.Provider, {
    value: { registerSortable, unregisterSortable, findItem },
    children
  })
})
