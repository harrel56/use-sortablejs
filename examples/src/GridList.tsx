import {useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';
import CodeSnippet from '@examples/CodeSnippet';

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
  const {getRootProps, getItemProps} = useSortable(setItems, {animation: 150})

  return (
    <div className='example-container'>
      <h2>Grid</h2>
      <div id='grid-list' className='grid' {...getRootProps()}>
        {items.map(item => <div className='grid-item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default GridList

const snippet =
`const GridList = () => {
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
  const {getRootProps, getItemProps} = useSortable(setItems, {animation: 150})

  return (
    <div id='grid-list' className='grid' {...getRootProps()}>
      {items.map(item => <div className='grid-item' key={item} {...getItemProps(item)}>{item}</div>)}
    </div>
  )
}
`