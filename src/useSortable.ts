import {RefCallback, useCallback, useContext, useEffect, useRef} from 'react';
import SortableJS, {SortableEvent} from 'sortablejs';
import {MoveEventExtended, SortableEventExtended, UseSortableOptions} from '@react-sortablejs/types';
import {SortableContext} from '@react-sortablejs/SortableProvider';
import {SmartArray} from '@react-sortablejs/utils';
import {BiDirectionalMap} from 'bi-directional-map/dist';

const DISABLED_ATTR = '__sortable-disabled'

const createDraggableSelector = (selector?: string) => {
  const internalSelector = `:not([${DISABLED_ATTR}])`
  if (!selector) {
    return internalSelector
  }
  return selector.split(',')
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

const useSortable = <T>({
                          items,
                          setItems,
                          cloneItem = shallowClone,
                          options = {}
                        }: UseSortableOptions<T>) => {

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
    if (e.pullMode === 'clone') {
      console.log('cloning item...')
      extended.stateItem = cloneItem(extended.stateItem)
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
    SortableJS.create(node, {
      ...options,
      draggable: createDraggableSelector(options.draggable),
      onStart: e => {
        const extended = extendSortableEvent(e)
        console.log('onStart', extended)
        options?.onStart?.(extended)
      },
      onEnd: e => {
        const extended = extendSortableEvent(e)
        console.log('onEnd', extended)
        options?.onEnd?.(extended)
      },
      onAdd: e => {
        const extended = extendSortableEvent(e)
        console.log('onAdd', extended)
        options?.onAdd?.(extended)
        if (extended.pullMode === 'clone') {
          extended.clone.parentElement!.insertBefore(extended.item, extended.clone.nextSibling)
          extended.clone.remove()
        } else {
          extended.item.remove()
        }
        setItems(itemsDataRef.current.add(extended.stateItem, extended.newDraggableIndex!))
      },
      onClone: e => {
        const extended = extendSortableEvent(e)
        console.log('onClone', extended)
        options?.onClone?.(extended)
      },
      onChoose: e => {
        const extended = extendSortableEvent(e)
        console.log('onChoose', extended)
        options?.onChoose?.(extended)
      },
      onUnchoose: e => {
        const extended = extendSortableEvent(e)
        console.log('onUnchoose', extended)
        options?.onUnchoose?.(extended)
      },
      onUpdate: e => {
        const extended = extendSortableEvent(e)
        console.log('onUpdate', extended)
        options?.onUpdate?.(extended)
        setItems(itemsDataRef.current.moveItem(extended.oldDraggableIndex!, extended.newDraggableIndex!))
      },
      onSort: e => {
        const extended = extendSortableEvent(e)
        console.log('onSort', extended)
        options?.onSort?.(extended)
      },
      onRemove: e => {
        const extended = extendSortableEvent(e)
        console.log('onRemove', extended)
        options?.onRemove?.(extended)
        if (extended.pullMode !== 'clone') {
          node.insertBefore(extended.item, null)
          setItems(itemsDataRef.current.remove(extended.oldDraggableIndex!))
        }
      },
      onFilter: e => {
        const extended = extendSortableEvent(e)
        console.log('onFilter', extended)
        options?.onFilter?.(extended)
      },
      onMove: (e, originalEvent) => {
        console.log('onMove', e)
        const extended = e as MoveEventExtended<T>
        const currentItem = itemRefs.current.getValue(e.dragged)
        if (!currentItem) {
          return false
        }

        extended.stateItem = currentItem
        return options?.onMove?.(extended, originalEvent)
      },
      onChange: e => {
        console.log('onChange', e)
        options?.onChange?.(extendSortableEvent(e))
      }
    })
  }, []) as RefCallback<HTMLElement>

  return {
    getRootProps: () => ({
      ref: refCallback
    }),
    getItemProps: (item: T) => ({
      ref: getChildRefCallback(item)
    })
  }
}

export default useSortable