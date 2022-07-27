import Sortable from '@react-sortablejs/Sortable';
import SortableProvider from '@react-sortablejs/SortableProvider';
import {useState} from 'react';

const FilterList = () => {
  const [items, setItems] = useState([
    {name: 'Item 1'},
    {name: 'Item 2'},
    {name: 'Item 3'},
    {name: 'Item 4'},
    {name: 'Filtered', filtered: true},
    {name: 'Item 5'},
    {name: 'Item 6'}
  ])

  return (
    <SortableProvider>
      <div className="example-container">
        <h2>Simple list</h2>
        <Sortable items={items}
                  setItems={setItems}
                  itemToView={
                    item => <div className={item.filtered ? 'item filtered' : 'item'} key={item.name}>{item.name}</div>
                  }
                  options={{
                    animation: 150,
                    filter: '.filtered'
                  }}
        />
      </div>
    </SortableProvider>
  )
}

export default FilterList