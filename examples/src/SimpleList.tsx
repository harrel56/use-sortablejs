import {useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';

const SimpleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const {getRootProps, getItemProps} = useSortable(items, setItems, {animation: 150})
  return (
    <div className="example-container">
      <h2>Simple list</h2>
      <div {...getRootProps()}>
        {items.map(item => <div className="item" key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
    </div>
  )
}

export default SimpleList