import {RefCallback, useCallback, useContext, useEffect, useRef} from 'react';
import SortableJS, {SortableEvent} from 'sortablejs';
import {MoveEventExtended, SortableEventExtended, UseSortableOptions} from '@react-sortablejs/types';
import {SortableContext} from '@react-sortablejs/SortableProvider';
import {SmartArray} from '@react-sortablejs/utils';
import {BiDirectionalMap} from 'bi-directional-map/dist';

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
      extended.stateItem = cloneItem(extended.stateItem)
    }
    return extended
  }

  useEffect(() => {
    itemsDataRef.current = new SmartArray(items)
  }, [items])

  useEffect(() => {
    if (sortableRef.current === null) {
      return
    }
    itemRefs.current.clear()
    const children = sortableRef.current.children
    for (let i = 0; i < children.length; i++) {
      itemRefs.current.set(children[i] as HTMLElement, items[i])
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
      onStart: e => {
        console.log('onStart', e)
        options?.onStart?.(extendSortableEvent(e))
      },
      onEnd: e => {
        console.log('onEnd', e)
        options?.onEnd?.(extendSortableEvent(e))
      },
      onAdd: e => {
        console.log('onAdd', e)
        const extended = extendSortableEvent(e);
        options?.onAdd?.(extended)
        if (e.pullMode === 'clone') {
          e.clone.parentElement!.insertBefore(e.item, e.clone.nextSibling)
          e.clone.remove()
        } else {
          e.item.remove()
        }
        setItems(itemsDataRef.current.add(extended.stateItem, e.newIndex!))
      },
      onClone: e => {
        console.log('onClone', e)
        options?.onClone?.(extendSortableEvent(e))
      },
      onChoose: e => {
        console.log('onChoose', e)
        options?.onChoose?.(extendSortableEvent(e))
      },
      onUnchoose: e => {
        console.log('onUnchoose', e)
        options?.onUnchoose?.(extendSortableEvent(e))
      },
      onUpdate: e => {
        console.log('onUpdate', e)
        options?.onUpdate?.(extendSortableEvent(e))
        setItems(itemsDataRef.current.moveItem(e.oldIndex!, e.newIndex!))
      },
      onSort: e => {
        console.log('onSort', e)
        options?.onSort?.(extendSortableEvent(e))
      },
      onRemove: e => {
        console.log('onRemove', e)
        options?.onRemove?.(extendSortableEvent(e))
        if (e.pullMode !== 'clone') {
          node.insertBefore(e.item, null)
          setItems(itemsDataRef.current.remove(e.oldIndex!))
        }
      },
      onFilter: e => {
        console.log('onFilter', e)
        options?.onFilter?.(extendSortableEvent(e))
      },
      onMove: (e, originalEvent) => {
        console.log('onMove', e)
        const extended = e as MoveEventExtended<T>
        extended.stateItem = itemRefs.current.getValue(e.dragged)!
        options?.onMove?.(extended, originalEvent)
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
    })
  }
}

export default useSortable