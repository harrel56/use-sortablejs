import {RefCallback, useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import SortableJS, {SortableEvent} from 'sortablejs'
import {MoveEventExtended, Props, SortableEventExtended} from './types';
import {BiDirectionalMap} from 'bi-directional-map/dist';
import {SmartArray} from '@react-sortablejs/utils';
import {SortableContext} from '@react-sortablejs/SortableProvider';

const shallowClone = (item: any) => {
  if (typeof item === 'object') {
    return {...item}
  } else {
    return item
  }
}

const Sortable = <T, >({items, setItems, itemToView, cloneItem = shallowClone, options}: Props<T>) => {
  const sortableCtx = useContext(SortableContext)
  if (!sortableCtx) {
    throw new Error('Missing Sortable context')
  }
  const {registerSortable, findItem} = sortableCtx

  const itemsDataRef = useRef(new SmartArray(items))
  const itemRefs = useRef(new BiDirectionalMap<HTMLElement, T>)

  useEffect(() => {
    itemsDataRef.current = new SmartArray(items)
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
    extended.stateItem = findItem(e.from, e.item)
    if (e.pullMode === 'clone') {
      extended.stateItem = cloneItem(extended.stateItem)
    }
    return extended
  }

  const itemsWithView = useMemo(() =>
      items.map(item => ({item: item, view: itemToView(item)})),
    [items, itemToView])

  const refCallback = useCallback((node) => {
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

  return (
    <>
      {/*<button onClick={() => setItems(itemsDataRef.current.get())}>setItems</button>*/}
      <div ref={refCallback}>
        {itemsWithView.map(({item, view}) => (
          <view.type
            {...view.props}
            key={view.key}
            ref={getChildRefCallback(item)}
          />
        ))}
      </div>
    </>
  )
}

export default Sortable