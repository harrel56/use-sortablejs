import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';
import {useState} from 'react';

const GridList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15',
    'Item 16',
    'Item 17',
    'Item 18',
    'Item 19',
    'Item 20'
  ])

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Grid</h2>
        <Sortable items={items}
                  setItems={setItems}
                  itemToView={
                    item => <div className="grid-item" key={item}>{item}</div>
                  }
                  componentProps={{className: 'grid'}}
                  options={{
                    animation: 150
                  }}
        />
      </div>
    </SortableProvider>
  )
}

export default GridList