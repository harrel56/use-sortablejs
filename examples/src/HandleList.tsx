import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';
import {useState} from 'react';

const HandleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
  ])

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Simple list</h2>
        <Sortable items={items}
                  setItems={setItems}
                  itemToView={
                    item => <div className='item' key={item}><span className='handle'></span>{item}</div>
                  }
                  options={{
                    animation: 150,
                    handle: '.handle'
                  }}
        />
      </div>
    </SortableProvider>
  )
}

export default HandleList