import {useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

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

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Shared lists</h2>
        <div className="example">
          <Sortable items={items}
                    setItems={setItems}
                    itemToView={
                      item => <div className='item' key={item}>{item}</div>
                    }
                    options={{
                      animation: 150,
                      group: 'test'
                    }}
          />
          <Sortable items={items2}
                    setItems={setItems2}
                    itemToView={
                      item => <div className='item' key={item}>{item}</div>
                    }
                    options={{
                      animation: 150,
                      group: 'test'
                    }}
          />
        </div>
      </div>
    </SortableProvider>
  );
}

export default SharedList;
