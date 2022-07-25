import {Context, createContext, PropsWithChildren, useRef} from 'react';
import {BiDirectionalMap} from 'bi-directional-map/dist';

interface ContextContent {
  registerSortable: (sortable: HTMLElement, items: BiDirectionalMap<HTMLElement, any>) => void
  findItem: <T, >(sortable: HTMLElement, item: HTMLElement) => T
}

export const SortableContext = createContext(null) as Context<ContextContent | null>

const SortableProvider = (({children}: PropsWithChildren) => {

  const sortables = useRef(new Map<HTMLElement, BiDirectionalMap<HTMLElement, any>>())

  const registerSortable = (sortable: HTMLElement, items: BiDirectionalMap<HTMLElement, any>) => {
    sortables.current.set(sortable, items)
  }

  const findItem = <T, >(sortable: HTMLElement, item: HTMLElement) => {
    return sortables.current.get(sortable)!.getValue(item) as T
  }

  return (
    <SortableContext.Provider value={{registerSortable, findItem}}>
      {children}
    </SortableContext.Provider>
  )
})

export default SortableProvider