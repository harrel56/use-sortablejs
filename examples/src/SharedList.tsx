import {useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';

const SharedList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4'
  ])
  const [items2, setItems2] = useState([
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8'
  ])

  const {getRootProps, getItemProps} = useSortable(items, setItems, {
    animation: 150,
    group: 'shared'
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(items2, setItems2, {
    animation: 150,
    group: 'shared'
  })

  return (
    <div className="example-container">
      <h2>Shared lists</h2>
      <div className="example">
        <div {...getRootProps()}>
          {items.map(item => <div className="item" key={item} {...getItemProps(item)}>{item}</div>)}
        </div>
        <div {...getRootProps2()}>
          {items2.map(item => <div className="item" key={item} {...getItemProps2(item)}>{item}</div>)}
        </div>
      </div>
    </div>
  );
}

export default SharedList;
