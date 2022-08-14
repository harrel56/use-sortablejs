import {Dispatch, RefCallback, SetStateAction, useCallback, useContext, useRef} from 'react';
import Sortable, {SortableEvent, SortableOptions} from 'sortablejs';
import {
  ItemProps,
  MoveEventExtended,
  MultiDragUtils,
  ExtendedOptions,
  RootProps,
  SortableEventExtended
} from './types';
import {SortableContext} from './SortableProvider';
import {BiDiMap, insert, moveItem, moveItems, remove, removeAll, replace, shallowClone, swap} from './utils';

const isClone = (e: SortableEvent): boolean => e.pullMode === 'clone'
const isSwap = (e: SortableEvent): boolean => !!e.swapItem
const isMultiDrag = (e: SortableEvent): boolean => e.newIndicies.length > 0

export const useSortable = <T>(
  setItems: Dispatch<SetStateAction<T[]>>,
  options: ExtendedOptions<T> = {},
  cloneItem: (item: T) => T = shallowClone) => {

  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, unregisterSortable,findItem} = sortableCtx

  const sortableRef = useRef<Sortable | null>(null)
  const itemRefs = useRef(new BiDiMap<HTMLElement, T>())

  const extendSortableEvent = (e: SortableEvent) => {
    const extended = e as SortableEventExtended<T>
    extended.stateItem = findItem(e.from, e.item)
    extended.stateItems = e.newIndicies.map(el => findItem(e.from, el.multiDragElement))
    if (isSwap(e)) {
      extended.swapStateItem = findItem(e.to, e.swapItem!)
    }
    return extended
  }

  const getChildRefCallback = ((item) => {
    return node => {
      if (node) {
        itemRefs.current.set(node, item)
      } else {
        itemRefs.current.deleteValue(item)
      }
    }
  }) as (item: T) => RefCallback<HTMLElement>

  const extendOptions = (node: HTMLElement, opts: SortableOptions) => {
    const extendedOpts = {...opts}
    const simpleEvents: (keyof SortableOptions)[] = ['onStart', 'onClone', 'onChoose', 'onUnchoose', 'onSort', 'onFilter', 'onChange']
    for (let event of simpleEvents) {
      // @ts-ignore
      extendedOpts[event] = (e: SortableEvent) => {
        const extended = extendSortableEvent(e)
        // @ts-ignore
        opts?.[event]?.(extended)
      }
    }

    extendedOpts.onAdd = e => {
      const extended = extendSortableEvent(e)
      if (isClone(extended)) {
        extended.stateItem = cloneItem(extended.stateItem)
      }
      options?.onAdd?.(extended)
      if (isClone(extended)) {
        extended.clone.parentElement!.insertBefore(extended.item, extended.clone.nextSibling)
        extended.clone.remove()
        setItems(state => insert(state, extended.newDraggableIndex!, extended.stateItem))
      } else if (isSwap(extended)) {
        const delay = extendedOpts.animation ? Math.max(extendedOpts.animation, 0) : 0
        swapping = true
        setTimeout(() => {
          node.insertBefore(extended.swapItem!, null)
          setItems(state => replace(state, extended.newDraggableIndex!, extended.stateItem))
          swapping = false
        }, delay)
      } else if (isMultiDrag(extended)) {
        extended.newIndicies.forEach(el => el.multiDragElement.remove())
        const minIdx = Math.min(...extended.newIndicies.map(el => el.index))
        setItems(state => insert(state, minIdx, ...extended.stateItems))
      } else {
        extended.item.remove()
        setItems(state => insert(state, extended.newDraggableIndex!, extended.stateItem))
      }
    }

    let multiDragUpdate: (() => void) | null = null
    let swapping = false
    extendedOpts.onUpdate = e => {
      const extended = extendSortableEvent(e)
      options?.onUpdate?.(extended)
      if (isSwap(extended)) {
        const delay = extendedOpts.animation ? Math.max(extendedOpts.animation, 0) : 0
        swapping = true
        setTimeout(() => {
          setItems(state => swap(state, extended.oldDraggableIndex!, extended.newDraggableIndex!))
          swapping = false
        }, delay)
      } else if (isMultiDrag(extended)) {
        multiDragUpdate = () => setItems(state => moveItems(state, extended.oldIndicies.map(i => i.index), extended.newIndicies[0].index))
      } else {
        setItems(state => moveItem(state, extended.oldDraggableIndex!, extended.newDraggableIndex!))
      }
    }

    extendedOpts.onRemove = e => {
      const extended = extendSortableEvent(e)
      options?.onRemove?.(extended)
      if (isSwap(extended)) {
        const delay = extendedOpts.animation ? Math.max(extendedOpts.animation, 0) : 0
        swapping = true
        setTimeout(() => {
          node.insertBefore(extended.item, null)
          setItems(state => replace(state, extended.oldDraggableIndex!, extended.swapStateItem))
          swapping = false
        }, delay)
      } else if (isMultiDrag(extended)) {
        multiDragUpdate = null
        extended.oldIndicies.forEach(el => node.insertBefore(el.multiDragElement, null))
        extended.oldIndicies.forEach(el => (Sortable.utils as MultiDragUtils).deselect(el.multiDragElement))
        setItems(state => removeAll(state, extended.oldIndicies.map(el => el.index)))
      } else if (!isClone(extended)) {
        node.insertBefore(extended.item, null)
        setItems(state => remove(state, extended.oldDraggableIndex!))
      }
    }

    extendedOpts.onMove = (e, originalEvent) => {
      const extended = e as MoveEventExtended<T>
      const currentItem = itemRefs.current.getValue(e.dragged)
      if (!currentItem || swapping) {
        return false
      }

      extended.stateItem = currentItem
      return options?.onMove?.(extended, originalEvent)
    }

    extendedOpts.onEnd = e => {
      const extended = extendSortableEvent(e)
      opts?.onEnd?.(extended)
      if (multiDragUpdate) {
        multiDragUpdate()
        multiDragUpdate = null
      }
    }

    return extendedOpts
  }

  const refCallback = useCallback((node) => {
    if (node) {
      registerSortable(node, itemRefs.current)
      sortableRef.current = Sortable.create(node, extendOptions(node, options as SortableOptions))
    } else {
      unregisterSortable(sortableRef.current!.el)
      sortableRef.current!.destroy()
      sortableRef.current = null;
    }
  }, []) as RefCallback<HTMLElement>

  return {
    getRootProps: () => ({
      ref: refCallback
    } as RootProps),
    getItemProps: (item: T) => ({
      ref: getChildRefCallback(item)
    } as ItemProps)
  }
}
