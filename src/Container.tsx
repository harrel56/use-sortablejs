import React, {RefCallback, useCallback, useEffect, useMemo, useRef} from 'react';
import Sortable, {SortableEvent} from 'sortablejs'
import {Props, SortableEventExtended} from './types';


const moveInArray = <T, >(arr: T[], fromIndex: number, toIndex: number) => {
  const copy = [...arr]
  const element = copy[fromIndex]
  copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, element)
  return copy
}

const Container = <T, >({items, itemToView, options}: Props<T>) => {
  const itemsDataRef = useRef(items)
  const itemRefs = useRef<Map<HTMLElement, T>>(new Map())

  useEffect(() => {
    itemsDataRef.current = items
  }, [items])

  const extendSortableEvent = (e: SortableEvent) => {
    const extended = e as SortableEventExtended<T>
    extended.stateItem = itemRefs.current.get(e.item)
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
        options.onStart?.(extendSortableEvent(e))
      },
      onSort: e => {
        console.log('onSort', e)
        options.onItemsChange?.(moveInArray(itemsDataRef.current, e.oldIndex, e.newIndex))
      }
    })
  }, []) as RefCallback<HTMLElement>

  return (
    <div ref={refCallback}>
      {itemsWithView.map(({item, view}) => (
        <view.type
          {...view.props}
          key={view.key}
          ref={node => itemRefs.current.set(node, item)}
        />
      ))}
    </div>
  )
}

export default Container