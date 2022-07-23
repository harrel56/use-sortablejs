import {RefCallback, useCallback, useEffect, useMemo, useRef} from 'react';
import Sortable, {SortableEvent} from 'sortablejs'
import {MoveEventExtended, Props, SortableEventExtended} from './types';
import {BiDirectionalMap} from 'bi-directional-map/dist';


const moveInArray = <T, >(arr: T[], fromIndex: number, toIndex: number) => {
  const copy = [...arr]
  const element = copy[fromIndex]
  copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, element)
  return copy
}

const Container = <T, >({items, itemToView, options}: Props<T>) => {
  const itemsDataRef = useRef(items)
  const itemRefs = useRef<BiDirectionalMap<HTMLElement, T>>(new BiDirectionalMap())

  useEffect(() => {
    itemsDataRef.current = items
  }, [items])

  const getChildRefCallback = ((item) => {
    return node => {
      if (node) {
        itemRefs.current.set(node, item)
      } else {
        itemRefs.current.deleteValue(item)
      }
    }
  }) as (item: T) => RefCallback<HTMLElement>

  const extendSortableEvent = (e: SortableEvent) => {
    const extended = e as SortableEventExtended<T>
    extended.stateItem = itemRefs.current.getValue(e.item)!
    return extended
  }

  const itemsWithView = useMemo(() =>
      items.map(item => ({item: item, view: itemToView(item)})),
    [items, itemToView])

  const refCallback = useCallback((node) => {
    if (!node) {
      return
    }

    Sortable.create(node, {
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
        options?.onAdd?.(extendSortableEvent(e))
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
      },
      onSort: e => {
        console.log('onSort', e)
        options?.onItemsChange?.(moveInArray(itemsDataRef.current, e.oldIndex!, e.newIndex!))
      },
      onRemove: e => {
        console.log('onRemove', e)
        options?.onRemove?.(extendSortableEvent(e))
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

  return (
    <div ref={refCallback}>
      {itemsWithView.map(({item, view}) => (
        <view.type
          {...view.props}
          key={view.key}
          ref={getChildRefCallback(item)}
        />
      ))}
    </div>
  )
}

export default Container