import {ReactElement} from 'react';
import Sortable, {MoveEvent, SortableEvent} from 'sortablejs';

export interface Props<T> {
  items: T[]
  itemToView: (item: T) => ReactElement
  options?: Options<T>
}

export interface Options<T> extends Sortable.Options {
  /**
   * Additional event when items state changed and should be updated
   */
  onItemsChange?: ((items: T[]) => void) | undefined;
  /**
   * Element dragging started
   */
  onStart?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Element dragging ended
   */
  onEnd?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Element is dropped into the list from another list
   */
  onAdd?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Created a clone of an element
   */
  onClone?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Element is chosen
   */
  onChoose?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Element is unchosen
   */
  onUnchoose?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Changed sorting within list
   */
  onUpdate?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Called by any change to the list (add / update / remove)
   */
  onSort?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Element is removed from the list into another list
   */
  onRemove?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Attempt to drag a filtered element
   */
  onFilter?: ((event: SortableEventExtended<T>) => void) | undefined;
  /**
   * Event when you move an item in the list or between lists
   */
  onMove?: ((evt: MoveEvent, originalEvent: Event) => boolean | -1 | 1 | void) | undefined;
  /**
   * Called when dragging element changes position
   */
  onChange?: ((evt: SortableEventExtended<T>) => void) | undefined;
}

export interface SortableEventExtended<T> extends SortableEvent {
  stateItem: T
}