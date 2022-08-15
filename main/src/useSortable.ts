import {MutableRefObject, RefCallback, useCallback, useContext, useEffect, useRef, useState} from 'react'
import Sortable, {MoveEvent, SortableEvent, SortableOptions} from 'sortablejs';
import {
  ExtendedOptions,
  ItemProps,
  MoveEventExtended,
  MultiDragUtils,
  RootProps,
  SortableEventExtended,
  UseSortableProps
} from './types';
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

export const useSortable = <T>({
                                 setItems,
                                 options = {},
                                 cloneItem = shallowClone,
                                 sortableRef: userSortableRef
                               }: UseSortableProps<T>) => {

  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, unregisterSortable, findItem} = sortableCtx
  const [sortable, setSortable] = useState<Sortable | null>(null)

  const defaultOptions = useRef<SortableOptions>({})
  const sortableRef = useRef<Sortable | null>(null)
  const itemRefs = useRef(new BiDiMap<HTMLElement, T>())

  useEffect(() => {
    sortableRef.current = sortable
    if (!sortable) {
      return
    }
    Object.entries(defaultOptions.current)
      .filter(el => !options.hasOwnProperty(el[0]))
      .forEach(el => sortable.option(el[0] as keyof ExtendedOptions<any>, el[1]))
    Object.entries(options).forEach(el => sortable.option(el[0] as keyof ExtendedOptions<any>, el[1]))
    extendEvents(sortable, options as SortableOptions)
    setUserSortableRef(sortable)
  }, [sortable, JSON.stringify(options, jsonReplacer), ...getEvents(options)])

  const setUserSortableRef = (newSortable: Sortable | null) => {
    if (userSortableRef) {
      if (typeof userSortableRef === 'function') {
        userSortableRef(newSortable)
      } else {
        (userSortableRef as MutableRefObject<Sortable | null>).current = newSortable
      }
    }
  }

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

  const extendEvents = (newSortable: Sortable, opts: SortableOptions) => {
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
          newSortable.el.insertBefore(extended.swapItem!, null)
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
          newSortable.el.insertBefore(extended.item, null)
          setItems(state => replace(state, extended.oldDraggableIndex!, extended.swapStateItem))
          swapping = false
        }, delay)
      } else if (isMultiDrag(extended)) {
        multiDragUpdate = null
        extended.oldIndicies.forEach(el => newSortable.el.insertBefore(el.multiDragElement, null))
        extended.oldIndicies.forEach(el => (Sortable.utils as MultiDragUtils).deselect(el.multiDragElement))
        setItems(state => removeAll(state, extended.oldIndicies.map(el => el.index)))
      } else if (!isClone(extended)) {
        newSortable.el.insertBefore(extended.item, null)
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
      newSortable.option(event, (e: SortableEvent) => opts?.[event]?.(extendSortableEvent(e)))
    }
    newSortable.option('onAdd', onAdd)
    newSortable.option('onRemove', onRemove)
    newSortable.option('onUpdate', onUpdate)
    newSortable.option('onMove', onMove)
    newSortable.option('onEnd', onEnd)
  }

  const refCallback = useCallback((node) => {
    if (node) {
      registerSortable(node, itemRefs.current)
      // @ts-ignore - multiDragKey is initialized to null but can be replaced with empty string
      const newSortable = Sortable.create(node, {multiDragKey: ''})
      defaultOptions.current = {...newSortable.options}
      setSortable(newSortable)
    } else {
      unregisterSortable(sortableRef.current!.el)
      sortableRef.current!.destroy()
      setSortable(null)
      setUserSortableRef(null)
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
