import {useState} from 'react';
import {useSortable} from 'use-sortablejs';
import CodeSnippet from '@examples/CodeSnippet';

const MultiDragList = () => {
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
  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    group: 'multidrag',
    multiDrag: true,
    selectedClass: 'multi-drag',
    fallbackTolerance: 3
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(setItems2, {
    animation: 150,
    group: 'multidrag',
    multiDrag: true,
    selectedClass: 'multi-drag',
    fallbackTolerance: 3
  })
  return (
    <div className='example-container'>
      <h2>Multi drag list</h2>
      <div className='example'>
        <div id='multi-drag-list1' {...getRootProps()}>
          {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
        </div>
        <div id='multi-drag-list2' {...getRootProps2()}>
          {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
        </div>
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default MultiDragList

const snippet =
`const MultiDragList = () => {
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
  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    group: 'multidrag',
    multiDrag: true,
    selectedClass: 'multi-drag',
    fallbackTolerance: 3
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(setItems2, {
    animation: 150,
    group: 'multidrag',
    multiDrag: true,
    selectedClass: 'multi-drag',
    fallbackTolerance: 3
  })
  return (
    <div className='example'>
      <div id='multi-drag-list1' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <div id='multi-drag-list2' {...getRootProps2()}>
        {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
      </div>
    </div>
  )
}
`