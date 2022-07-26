import {useRef, useState} from 'react';
import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';

const CloningList = () => {
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
  const cloneCount = useRef(0)

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Cloning</h2>
        <div className="example">
          <Sortable items={items}
                    setItems={setItems}
                    itemToView={
                      item => <div className='item' key={item}>{item}</div>
                    }
                    cloneItem={item => `${item} (cloned ${++cloneCount.current})`}
                    options={{
                      animation: 150,
                      group: {
                        name: 'cloning',
                        pull: 'clone'
                      }
                    }}
          />
          <Sortable items={items2}
                    setItems={setItems2}
                    itemToView={
                      item => <div className='item' key={item}>{item}</div>
                    }
                    cloneItem={item => `${item} (cloned ${++cloneCount.current})`}
                    options={{
                      animation: 150,
                      group: {
                        name: 'cloning',
                        pull: 'clone'
                      }
                    }}
          />
        </div>
      </div>
    </SortableProvider>
  );
}

export default CloningList;
