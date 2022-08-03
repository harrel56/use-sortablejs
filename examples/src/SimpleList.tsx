import {useState} from 'react';
import {useSortable} from 'use-sortablejs2';
import CodeSnippet from '@examples/CodeSnippet';

const SimpleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const {getRootProps, getItemProps} = useSortable(setItems, {animation: 150})
  return (
    <div className='example-container'>
      <h2>Simple list</h2>
      <div id='simple-list' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default SimpleList

const snippet =
`const SimpleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const {getRootProps, getItemProps} = useSortable(setItems, {animation: 150})
  return (
    <div id='simple-list' {...getRootProps()}>
      {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
    </div>
  )
}
`