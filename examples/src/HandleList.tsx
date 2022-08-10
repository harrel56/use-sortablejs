import {useState} from 'react';
import {useSortable} from 'use-sortablejs';
import CodeSnippet from '@examples/CodeSnippet';

const HandleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])

  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    handle: '.handle'
  })
  return (
    <div className='example-container'>
      <h2>Handle</h2>
      <div id='handle-list' {...getRootProps()}>
        {items.map(item =>
          <div className='item' key={item} {...getItemProps(item)}>
            <span className='handle'/>{item}
          </div>)}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default HandleList

const snippet =
`const HandleList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])

  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    handle: '.handle'
  })
  return (
    <div id='handle-list' {...getRootProps()}>
      {items.map(item =>
        <div className='item' key={item} {...getItemProps(item)}>
          <span className='handle'/>{item}
        </div>)}
    </div>
  )
}
`