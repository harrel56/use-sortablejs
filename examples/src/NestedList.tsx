import {useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

const List = () => {
  const [items, setItems] = useState([
    {msg: crypto.randomUUID(), data: crypto.randomUUID()},
    {msg: crypto.randomUUID(), data: crypto.randomUUID()},
    {msg: crypto.randomUUID(), data: crypto.randomUUID()}
  ])
  return (
    <Sortable items={items}
              itemToView={nestedToView}
              options={{
                 animation: 150,
                 group: 'nested',
                 onItemsChange: setItems
               }}
    />
  )
}

const nestedToView = (nested: any) => {
  if (nested.container) {
    return (
      <div className='nested' key={nested.data}>
        <h3>{nested.msg}</h3>
        <List/>
      </div>
    )
  } else {
    return (
      <p key={nested.data}>{nested.msg}</p>
    )
  }
}

const NestedList = () => {
  const [nesteds, setNesteds] = useState([
    {msg: 'list 1', data: 1, container: true},
    {msg: 'list 2', data: 2, container: true},
    {msg: 'list 3', data: 3, container: true}
  ])

  return (
    <SortableProvider>
      <div className="example">
        <Sortable items={nesteds}
                  itemToView={nestedToView}
                  options={{
                     animation: 150,
                     group: 'nested',
                     onItemsChange: setNesteds
                   }}
        />
      </div>
    </SortableProvider>
  );
}

export default NestedList;
