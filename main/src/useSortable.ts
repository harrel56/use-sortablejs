import {Dispatch, RefCallback, SetStateAction, useCallback, useContext, useEffect, useRef} from 'react';
import Sortable, {MoveEvent, SortableEvent, SortableOptions} from 'sortablejs';
import {ExtendedOptions, ItemProps, MoveEventExtended, MultiDragUtils, RootProps, SortableEventExtended} from './types';
import {SortableContext} from './SortableProvider';
import {BiDiMap, insert, moveItem, moveItems, remove, removeAll, replace, shallowClone, swap} from './utils';

const isClone = (e: SortableEvent): boolean => e.pullMode === 'clone'
const isSwap = (e: SortableEvent): boolean => !!e.swapItem
const isMultiDrag = (e: SortableEvent): boolean => e.newIndicies.length > 0

const simpleEvents: (keyof ExtendedOptions<any>)[] = ['onStart', 'onClone', 'onChoose', 'onUnchoose', 'onSort', 'onFilter', 'onChange']
const allEvents: Set<string> = new Set([...simpleEvents, 'onAdd', 'onRemove', 'onUpdate', 'onMove', 'onEnd'] as (keyof ExtendedOptions<any>)[])
const jsonReplacer = (k: string, v: any) => allEvents.has(k) ? undefined : v
const getEvents = (options: any) => {
  const res = [] as (Function | undefined)[]
  allEvents.forEach(event => res.push(options[event]))
  return res
}

export const useSortable = <T>(
  setItems: Dispatch<SetStateAction<T[]>>,
  options: ExtendedOptions<T> = {},
  cloneItem: (item: T) => T = shallowClone) => {

  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, unregisterSortable, findItem} = sortableCtx

  const defaultOptions = useRef<SortableOptions>({})
  const sortableRef = useRef<Sortable | null>(null)
  const itemRefs = useRef(new BiDiMap<HTMLElement, T>())

  useEffect(() => {
    if (!sortableRef.current) {
      return
    }
    sortableRef.current.options = {...defaultOptions.current}
    Object.entries(options).forEach(el => sortableRef.current!.option(el[0] as keyof ExtendedOptions<any>, el[1]))
    extendEvents(sortableRef.current, options as SortableOptions)
  }, [sortableRef.current, JSON.stringify(options, jsonReplacer), ...getEvents(options)])

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

  const extendEvents = (sortable: Sortable, opts: SortableOptions) => {
    const onAdd = (e: SortableEvent) => {
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
        const delay = opts.animation ? Math.max(opts.animation, 0) : 0
        swapping = true
        setTimeout(() => {
          sortable.el.insertBefore(extended.swapItem!, null)
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
    const onUpdate = (e: SortableEvent) => {
      const extended = extendSortableEvent(e)
      options?.onUpdate?.(extended)
      if (isSwap(extended)) {
        const delay = opts.animation ? Math.max(opts.animation, 0) : 0
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

    const onRemove = (e: SortableEvent) => {
      const extended = extendSortableEvent(e)
      options?.onRemove?.(extended)
      if (isSwap(extended)) {
        const delay = opts.animation ? Math.max(opts.animation, 0) : 0
        swapping = true
        setTimeout(() => {
          sortable.el.insertBefore(extended.item, null)
          setItems(state => replace(state, extended.oldDraggableIndex!, extended.swapStateItem))
          swapping = false
        }, delay)
      } else if (isMultiDrag(extended)) {
        multiDragUpdate = null
        extended.oldIndicies.forEach(el => sortable.el.insertBefore(el.multiDragElement, null))
        extended.oldIndicies.forEach(el => (Sortable.utils as MultiDragUtils).deselect(el.multiDragElement))
        setItems(state => removeAll(state, extended.oldIndicies.map(el => el.index)))
      } else if (!isClone(extended)) {
        sortable.el.insertBefore(extended.item, null)
        setItems(state => remove(state, extended.oldDraggableIndex!))
      }
    }

    const onMove = (e: MoveEvent, originalEvent: Event) => {
      const extended = e as MoveEventExtended<T>
      const currentItem = itemRefs.current.getValue(e.dragged)
      if (!currentItem || swapping) {
        return false
      }

      extended.stateItem = currentItem
      return options?.onMove?.(extended, originalEvent)
    }

    const onEnd = (e: SortableEvent) => {
      const extended = extendSortableEvent(e)
      opts?.onEnd?.(extended)
      if (multiDragUpdate) {
        multiDragUpdate()
        multiDragUpdate = null
      }
    }

    for (let event of simpleEvents) {
      // @ts-ignore
      sortable.option(event, (e: SortableEvent) => opts?.[event]?.(extendSortableEvent(e)))
    }
    sortable.option('onAdd', onAdd)
    sortable.option('onRemove', onRemove)
    sortable.option('onUpdate', onUpdate)
    sortable.option('onMove', onMove)
    sortable.option('onEnd', onEnd)
  }

  const refCallback = useCallback((node) => {
    if (node) {
      registerSortable(node, itemRefs.current)
      sortableRef.current = Sortable.create(node)
      defaultOptions.current = {...sortableRef.current.options}
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
