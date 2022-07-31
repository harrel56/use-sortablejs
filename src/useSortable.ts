import {Dispatch, RefCallback, SetStateAction, useCallback, useContext, useRef} from 'react';
import Sortable, {SortableEvent, SortableOptions} from 'sortablejs';
import {
  ItemProps,
  MoveEventExtended,
  MultiDragUtils,
  Options,
  RootProps,
  SortableEventExtended
} from '@react-sortablejs/types';
import {SortableContext} from '@react-sortablejs/SortableProvider';
import {BiDirectionalMap} from 'bi-directional-map/dist';
import {insert, moveItem, moveItems, remove, removeAll, shallowClone, swap} from '@react-sortablejs/utils';

const isClone = (e: SortableEvent): boolean => e.pullMode === 'clone'
const isSwap = (e: SortableEvent): boolean => !!e.swapItem
const isMultiDrag = (e: SortableEvent): boolean => e.newIndicies.length > 0

const useSortable = <T>(
  setItems: Dispatch<SetStateAction<T[]>>,
  options: Options<T> = {},
  cloneItem: (item: T) => T = shallowClone) => {

  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, findItem} = sortableCtx

  const sortableRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef(new BiDirectionalMap<HTMLElement, T>)

  const extendSortableEvent = (e: SortableEvent) => {
    const extended = e as SortableEventExtended<T>
    extended.stateItem = findItem(e.from, e.item)
    extended.stateItems = e.newIndicies.map(el => findItem(e.from, el.multiDragElement))
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
        console.log(event, extended)
        // @ts-ignore
        opts?.[event]?.(extended)
      }
    }

    extendedOpts.onAdd = e => {
      const extended = extendSortableEvent(e)
      if (isClone(extended)) {
        extended.stateItem = cloneItem(extended.stateItem)
      }
      console.log('onAdd', extended)
      options?.onAdd?.(extended)
      if (isClone(extended)) {
        extended.clone.parentElement!.insertBefore(extended.item, extended.clone.nextSibling)
        extended.clone.remove()
        setItems(state => insert(state, extended.newDraggableIndex!, extended.stateItem))
      } else if (isMultiDrag(extended)) {
        extended.newIndicies.forEach(el => el.multiDragElement.remove())
        setItems(state => insert(state, extended.newDraggableIndex!, ...extended.stateItems))
      } else {
        extended.item.remove()
        setItems(state => insert(state, extended.newDraggableIndex!, extended.stateItem))
      }
    }

    let multiDragUpdate: (() => void) | null = null
    let swapping = false
    extendedOpts.onUpdate = e => {
      const extended = extendSortableEvent(e)
      console.log('onUpdate', extended)
      options?.onUpdate?.(extended)
      if (isSwap(extended)) {
        if (extendedOpts.animation) {
          swapping = true
          setTimeout(() => {
            setItems(state => swap(state, extended.oldDraggableIndex!, extended.newDraggableIndex!))
            swapping = false
          }, options.animation)
        } else {
          setItems(state => swap(state, extended.oldDraggableIndex!, extended.newDraggableIndex!))
        }
      } else if (isMultiDrag(extended)) {
        console.log('newIdxs', ...extended.newIndicies)

        multiDragUpdate = () => setItems(state => moveItems(state, extended.oldIndicies.map(i => i.index), extended.newIndicies[0].index))
      } else {
        setItems(state => moveItem(state, extended.oldDraggableIndex!, extended.newDraggableIndex!))
      }
    }

    extendedOpts.onRemove = e => {
      const extended = extendSortableEvent(e)
      console.log('onRemove', extended)
      options?.onRemove?.(extended)
      if (isMultiDrag(extended)) {
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
      console.log('onMove', e)
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
      console.log('onEnd', extended)
      opts?.onEnd?.(extended)
      if (multiDragUpdate) {
        multiDragUpdate()
        multiDragUpdate = null
      }
    }

    return extendedOpts
  }

  const refCallback = useCallback((node) => {
    sortableRef.current = node
    if (!node) {
      return
    }
    registerSortable(node, itemRefs.current)
    Sortable.create(node, extendOptions(node, options as SortableOptions))
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

export default useSortable