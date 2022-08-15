import {useState} from 'react'
import {useSortable} from 'use-sortablejs'
import CodeSnippet from '@examples/CodeSnippet'

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
  const {getRootProps, getItemProps} = useSortable({
    setItems, options: {
      animation: 150,
      filter: '.filtered'
    }
  })
  return (
    <div className='example-container'>
      <h2>Filter</h2>
      <div id='filter-list' {...getRootProps()}>
        {items.map(item =>
          <div className={item.filtered ? 'item filtered' : 'item'} key={item.name} {...getItemProps(item)}>
            {item.name}
          </div>)}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default FilterList

const snippet =
`const FilterList = () => {
  const [items, setItems] = useState([
    {name: 'Item 1'},
    {name: 'Item 2'},
    {name: 'Item 3'},
    {name: 'Item 4'},
    {name: 'Filtered', filtered: true},
    {name: 'Item 5'},
    {name: 'Item 6'}
  ])
  const {getRootProps, getItemProps} = useSortable({
    setItems, options: {
      animation: 150,
      filter: '.filtered'
    }
  })
  return (
    <div id='filter-list' {...getRootProps()}>
      {items.map(item =>
        <div className={item.filtered ? 'item filtered' : 'item'} key={item.name} {...getItemProps(item)}>
          {item.name}
        </div>)}
    </div>
  )
}
`