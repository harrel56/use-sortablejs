import {RefCallback, useCallback, useContext, useEffect, useRef} from 'react';
import Sortable, {SortableEvent, SortableOptions} from 'sortablejs';
import {ItemProps, MoveEventExtended, Options, RootProps, SortableEventExtended} from '@react-sortablejs/types';
import {SortableContext} from '@react-sortablejs/SortableProvider';
import {SmartArray} from '@react-sortablejs/utils';
import {BiDirectionalMap} from 'bi-directional-map/dist';

const DISABLED_ATTR = '__sortable-disabled'

const createDraggableSelector = (options: Options<any>) => {
  if (options.handle) { // do nothing if 'handle' is provided
    return
  }

  const internalSelector = `:not([${DISABLED_ATTR}])`
  if (!options.draggable) {
    return internalSelector
  }
  return options.draggable.split(',')
    .map(part => part.trim())
    .filter(part => part !== '')
    .map(part => part + internalSelector)
    .join(',')
}

const shallowClone = (item: any) => {
  if (typeof item === 'object') {
    return {...item}
  } else {
    return item
  }
}

const useSortable = <T>(
  items: T[],
  setItems: (items: T[]) => void,
  options: Options<T> = {},
  cloneItem: (item: T) => T = shallowClone) => {

  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, findItem} = sortableCtx

  const sortableRef = useRef<HTMLElement | null>(null)
  const itemsDataRef = useRef(new SmartArray(items))
  const itemRefs = useRef(new BiDirectionalMap<HTMLElement, T>)

  const extendSortableEvent = (e: SortableEvent) => {
    const extended = e as SortableEventExtended<T>
    extended.stateItem = findItem(e.from, e.item)
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
    const simpleEvents: (keyof SortableOptions)[] = ['onStart', 'onEnd', 'onClone', 'onChoose', 'onUnchoose', 'onSort', 'onFilter', 'onChange']
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
      if (extended.pullMode === 'clone') {
        extended.stateItem = cloneItem(extended.stateItem)
      }
      console.log('onAdd', extended)
      options?.onAdd?.(extended)
      if (extended.pullMode === 'clone') {
        extended.clone.parentElement!.insertBefore(extended.item, extended.clone.nextSibling)
        extended.clone.remove()
      } else {
        extended.item.remove()
      }
      setItems(itemsDataRef.current.add(extended.stateItem, extended.newDraggableIndex!))
    }

    let swapping = false
    extendedOpts.onUpdate = e => {
      const extended = extendSortableEvent(e)
      console.log('onUpdate', extended)
      options?.onUpdate?.(extended)
      if (extended.swapItem) {
        if (extendedOpts.animation) {
          swapping = true
          setTimeout(() => {
            setItems(itemsDataRef.current.swap(extended.oldDraggableIndex!, extended.newDraggableIndex!))
            swapping = false
          }, options.animation)
        } else {
          setItems(itemsDataRef.current.swap(extended.oldDraggableIndex!, extended.newDraggableIndex!))
        }
      } else {
        setItems(itemsDataRef.current.moveItem(extended.oldDraggableIndex!, extended.newDraggableIndex!))
      }
    }

    extendedOpts.onRemove = e => {
      const extended = extendSortableEvent(e)
      console.log('onRemove', extended)
      options?.onRemove?.(extended)
      if (extended.pullMode !== 'clone') {
        node.insertBefore(extended.item, null)
        setItems(itemsDataRef.current.remove(extended.oldDraggableIndex!))
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

    const draggableSelector = createDraggableSelector(options);
    if (draggableSelector) {
      extendedOpts.draggable = draggableSelector
    }
    return extendedOpts
  }

  useEffect(() => {
    itemsDataRef.current = new SmartArray(items)
  }, [items])

  useEffect(() => {
    if (sortableRef.current === null) {
      return
    }
    for (const child of sortableRef.current.children) {
      child.toggleAttribute(DISABLED_ATTR, !itemRefs.current.hasKey(child as HTMLElement))
    }
  }, [sortableRef.current, items])

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