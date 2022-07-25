import {useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

const DoubleList = () => {
  const [items, setItems] = useState([
    {msg: 'item 1', data: 1},
    {msg: 'item 2', data: 2},
    {msg: 'item 3', data: 3}
  ])

  const [items2, setItems2] = useState([
    {msg: 'item 1', data: 4},
    {msg: 'item 2', data: 5},
    {msg: 'item 3', data: 6}
  ])

  console.log('state', ...items)
  console.log('state2', ...items2)

  return (
    <SortableProvider>
      <div className="example">
        <Sortable items={items}
                  itemToView={
                     i => <p key={i.data}>{i.msg}</p>
                   }
                  options={{
                     animation: 150,
                     group: 'test',
                     onItemsChange: setItems
                   }}
        />
        <Sortable items={items2}
                  itemToView={
                     i => <p key={i.data}>{i.msg}</p>
                   }
                  options={{
                     animation: 150,
                     group: 'test',
                     onItemsChange: setItems2
                   }}
        />
      </div>
    </SortableProvider>
  );
}

export default DoubleList;
