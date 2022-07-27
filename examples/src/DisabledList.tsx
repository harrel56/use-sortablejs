import {useRef, useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

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

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Disabling sorting</h2>
        <div className="example">
          <Sortable items={items}
                    setItems={setItems}
                    itemToView={
                      item => <div className='item' key={item.id}>{item.name}</div>
                    }
                    options={{
                      animation: 150,
                      group: {
                        name: 'disabled',
                        pull: 'clone',
                        put: false
                      },
                    }}
          />
          <Sortable items={items2}
                    setItems={setItems2}
                    itemToView={
                      item => <div className='item' key={item.id}>{item.name}</div>
                    }
                    cloneItem={item => ({...item, id: ++idx.current})}
                    options={{
                      animation: 150,
                      group: 'disabled'
                    }}
          />
        </div>
      </div>
    </SortableProvider>
  );
}

export default DisabledList;
