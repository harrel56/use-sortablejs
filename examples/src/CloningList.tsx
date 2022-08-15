import {useRef, useState} from 'react'
import {useSortable} from 'use-sortablejs'
import CodeSnippet from '@examples/CodeSnippet'

const CloningList = () => {
  const idx = useRef(0)
  const [items, setItems] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])
  const [items2, setItems2] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])
  const cloneItem = (item: typeof items[0]) => ({...item, id: ++idx.current})

  const {getRootProps, getItemProps} = useSortable({
    setItems, cloneItem, options: {
      animation: 150,
      group: {
        name: 'cloning',
        pull: 'clone'
      }
    }
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable({
    setItems: setItems2, cloneItem, options: {
      animation: 150,
      group: {
        name: 'cloning',
        pull: 'clone'
      }
    }
  })

  return (
    <div className='example-container'>
      <h2>Cloning</h2>
      <div className='example'>
        <div id='clone-list1' {...getRootProps()}>
          {items.map(item => <div className='item' key={item.id} {...getItemProps(item)}>{item.name}</div>)}
        </div>
        <div id='clone-list2' {...getRootProps2()}>
          {items2.map(item => <div className='item' key={item.id} {...getItemProps2(item)}>{item.name}</div>)}
        </div>
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default CloningList

const snippet =
`const CloningList = () => {
  const idx = useRef(0)
  const [items, setItems] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])
  const [items2, setItems2] = useState([
    {name: 'Item 1', id: ++idx.current},
    {name: 'Item 2', id: ++idx.current},
    {name: 'Item 3', id: ++idx.current},
    {name: 'Item 4', id: ++idx.current}
  ])
  const cloneItem = (item: typeof items[0]) => ({...item, id: ++idx.current})

  const {getRootProps, getItemProps} = useSortable({
    setItems, cloneItem, options: {
      animation: 150,
      group: {
        name: 'cloning',
        pull: 'clone'
      }
    }
  })
  const {getRootProps: getRootProps2, getItemProps: getItemProps2} = useSortable({
    setItems: setItems2, cloneItem, options: {
      animation: 150,
      group: {
        name: 'cloning',
        pull: 'clone'
      }
    }
  })

  return (
    <div className='example'>
      <div id='clone-list1' {...getRootProps()}>
        {items.map(item => <div className='item' key={item.id} {...getItemProps(item)}>{item.name}</div>)}
      </div>
      <div id='clone-list2' {...getRootProps2()}>
        {items2.map(item => <div className='item' key={item.id} {...getItemProps2(item)}>{item.name}</div>)}
      </div>
    </div>
  );
}
`
