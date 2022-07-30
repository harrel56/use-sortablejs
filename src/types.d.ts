import {RefCallback} from 'react';
import Sortable, {MoveEvent, SortableEvent} from 'sortablejs';

export interface RootProps {
  ref: RefCallback<HTMLElement>
}

export interface ItemProps {
  ref: RefCallback<HTMLElement>
}

export interface MultiDragUtils extends Sortable.Utils {
  deselect: (e: HTMLElement) => void
}

export interface Options<T> extends Sortable.Options {
  /**
   * Element dragging started
   */
  onStart?: (event: SortableEventExtended<T>) => void
  /**
   * Element dragging ended
   */
  onEnd?: (event: SortableEventExtended<T>) => void
  /**
   * Element is dropped into the list from another list
   */
  onAdd?: (event: SortableEventExtended<T>) => void
  /**
   * Created a clone of an element
   */
  onClone?: (event: SortableEventExtended<T>) => void
  /**
   * Element is chosen
   */
  onChoose?: (event: SortableEventExtended<T>) => void
  /**
   * Element is unchosen
   */
  onUnchoose?: (event: SortableEventExtended<T>) => void
  /**
   * Changed sorting within list
   */
  onUpdate?: (event: SortableEventExtended<T>) => void
  /**
   * Called by any change to the list (add / update / remove)
   */
  onSort?: (event: SortableEventExtended<T>) => void
  /**
   * Element is removed from the list into another list
   */
  onRemove?: (event: SortableEventExtended<T>) => void
  /**
   * Attempt to drag a filtered element
   */
  onFilter?: (event: SortableEventExtended<T>) => void
  /**
   * Event when you move an item in the list or between lists
   */
  onMove?: (evt: MoveEventExtended<T>, originalEvent: Event) => boolean | -1 | 1 | void
  /**
   * Called when dragging element changes position
   */
  onChange?: (evt: SortableEventExtended<T>) => void
}

export interface SortableEventExtended<T> extends SortableEvent {
  stateItem: T
  stateItems: T[] // only if multidrag, otherwise empty
}

export interface MoveEventExtended<T> extends MoveEvent {
  stateItem: T
  stateItems: T[] // only if multidrag, otherwise empty
}