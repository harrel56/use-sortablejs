import {useState} from 'react'
import {useSortable} from 'use-sortablejs'
import CodeSnippet from '@examples/CodeSnippet'

const SwapList = () => {
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
  const options = {
    animation: 150,
    group: 'swap',
    swap: true,
    swapClass: 'swap'
  }
  const {getRootProps, getItemProps} = useSortable({setItems, options})
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable({setItems: setItems2, options})
  return (
    <div className='example-container'>
      <h2>Swap list</h2>
      <div className='example'>
        <div id='swap-list1' {...getRootProps()}>
          {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
        </div>
        <div id='swap-list2' {...getRootProps2()}>
          {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
        </div>
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default SwapList

const snippet =
`const SwapList = () => {
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
  const options = {
    animation: 150,
    group: 'swap',
    swap: true,
    swapClass: 'swap'
  }
  const {getRootProps, getItemProps} = useSortable({setItems, options})
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable({setItems: setItems2, options})
  return (
    <div className='example'>
      <div id='swap-list1' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <div id='swap-list2' {...getRootProps2()}>
        {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
      </div>
    </div>
  )
}
`