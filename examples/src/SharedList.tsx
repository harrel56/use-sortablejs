import {useState} from 'react';
import {useSortable} from 'use-sortablejs2';
import CodeSnippet from '@examples/CodeSnippet';

const SharedList = () => {
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
    group: 'shared'
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(setItems2, {
    animation: 150,
    group: 'shared'
  })

  return (
    <div className='example-container'>
      <h2>Shared lists</h2>
      <div className='example'>
        <div id='shared-list1' {...getRootProps()}>
          {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
        </div>
        <div id='shared-list2' {...getRootProps2()}>
          {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
        </div>
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  );
}

export default SharedList;

const snippet =
`const SharedList = () => {
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
    group: 'shared'
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable(setItems2, {
    animation: 150,
    group: 'shared'
  })

  return (
    <div className='example'>
      <div id='shared-list1' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <div id='shared-list2' {...getRootProps2()}>
        {items2.map(item => <div className='item' key={item} {...getItemProps2(item)}>{item}</div>)}
      </div>
    </div>
  );
}
`