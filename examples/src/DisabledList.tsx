import {useRef, useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';

const DisabledList = () => {
  const idx = useRef(0)
  const [items, setItems] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])

  const [items2, setItems2] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])
  const cloneItem = (item: typeof items[0]) => ({...item, id: ++idx.current})

  const {getRootProps, getItemProps} = useSortable(items, setItems, {
    animation: 150,
    sort: false,
    group: {
      name: 'disabled',
      pull: 'clone',
      put: false
    },
  }, cloneItem)
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(items2, setItems2, {
    animation: 150,
    group: 'disabled'
  }, cloneItem)

  return (
    <div className="example-container">
      <h2>Disabling sorting</h2>
      <div className="example">
        <div {...getRootProps()}>
          {items.map(item => <div className="item" key={item.id} {...getItemProps(item)}>{item.name}</div>)}
        </div>
        <div {...getRootProps2()}>
          {items2.map(item => <div className="item" key={item.id} {...getItemProps2(item)}>{item.name}</div>)}
        </div>
      </div>
    </div>
  );
}

export default DisabledList;
