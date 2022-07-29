import {useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';

const SwapList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const {getRootProps, getItemProps} = useSortable(items, setItems, {
    animation: 150,
    swap: true,
    swapClass: 'swap'
  })
  return (
    <div className="example-container">
      <h2>Swap list</h2>
      <div {...getRootProps()}>
        {items.map(item => <div className="item" key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
    </div>
  )
}

export default SwapList