import {useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

interface Item {
  title: string
  children: Item[]
}

interface ListProps {
  itemsState: Item[]
}

const itemToView = (item: Item) => {
  return (
    <div className="item" key={item.title}>
      {item.title}
      <List itemsState={item.children} />
    </div>
  )
}

const List = ({itemsState}: ListProps) => {
  const [items, setItems] = useState(itemsState)
  const setItemsInternal = (newItems: Item[]) => {
    itemsState.splice(0, items.length)
    itemsState.push(...newItems)
    setItems(newItems)
  }
  return (
    <Sortable items={items}
              setItems={setItemsInternal}
              itemToView={itemToView}
              options={{
                animation: 150,
                group: 'nested'
              }}
    />
  )
}

const NestedList = () => {
  const [items, setItems] = useState([
    {
      title: 'Item 1',
      children: [
        {title: 'Item 1.1', children: []},
        {
          title: 'Item 1.2',
          children: [
            {title: 'Item 1.2.1', children: []},
            {title: 'Item 1.2.2', children: []},
            {title: 'Item 1.2.3', children: []},
            {title: 'Item 1.2.4', children: []}
          ]
        },
        {title: 'Item 1.3', children: []},
        {title: 'Item 1.4', children: []},
      ]
    },
    {title: 'Item 2', children: []},
    {title: 'Item 3', children: []},
    {
      title: 'Item 4',
      children: [
        {title: 'Item 4.1', children: []},
        {title: 'Item 4.2', children: []},
        {title: 'Item 4.3', children: []},
        {title: 'Item 4.4', children: []}
      ]
    },
    {title: 'Item 5', children: []},
  ])

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Nested lists</h2>
        <Sortable items={items}
                  setItems={setItems}
                  itemToView={itemToView}
                  options={{
                    animation: 150,
                    group: 'nested'
                  }}
        />
      </div>
    </SortableProvider>
  );
}

export default NestedList;
