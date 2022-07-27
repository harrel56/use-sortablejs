import {useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';

const UseSortableTest = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const [items2, setItems2] = useState([
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8'
  ])

  const {getRootProps: getProps1} = useSortable({items, setItems, options: {animation: 150, group: 'hook'}})
  const {getRootProps: getProps2} = useSortable({items: items2, setItems: setItems2, options: {animation: 150, group: 'hook'}})

  console.log('items', items)

  return (
    <div className="example-container">
      <h2>Simple list</h2>
      <div className="example">
        <div {...getProps1()}>
          {items.map(item => <div className="item" key={item}>{item}</div>)}
        </div>
        <div {...getProps2()}>
          {items2.map(item => <div className="item" key={item}>{item}</div>)}
        </div>
      </div>
    </div>
  )
}

export default UseSortableTest