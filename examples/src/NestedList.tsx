import {Dispatch, SetStateAction, useState} from 'react';
import useSortable from '@react-sortablejs/useSortable';
import {ItemProps} from '@react-sortablejs/types';
import CodeSnippet from '@examples/CodeSnippet';

interface Item {
  title: string
  children: Item[]
}

interface ListProps {
  itemsState: Item[]
}

const itemToView = <T extends Item, >(item: T, getItemProps: (item: T) => ItemProps) => {
  return (
    <div className='item' key={item.title} {...getItemProps(item)}>
      {item.title}
      <List itemsState={item.children}/>
    </div>
  )
}

const List = ({itemsState}: ListProps) => {
  const [items, setItems] = useState(itemsState)
  const setItemsInternal = ((setFun: (prev: Item[]) => Item[]) => {
    const newItems = setFun(items)
    itemsState.splice(0, items.length)
    itemsState.push(...newItems)
    setItems(newItems)
    return newItems
  }) as Dispatch<SetStateAction<Item[]>>
  const {getRootProps, getItemProps} = useSortable(setItemsInternal, {
    animation: 150,
    group: 'shared'
  })
  return (
    <div {...getRootProps()}>
      {items.map(item => itemToView(item, getItemProps))}
    </div>
  )
}

const NestedList = () => {
  const [items, setItems] = useState([
    {
      title: 'Item 1',
      children: [
        {title: 'Item 1.1', children: []},
        {
          title: 'Item 1.2',
          children: [
            {title: 'Item 1.2.1', children: []},
            {title: 'Item 1.2.2', children: []},
            {title: 'Item 1.2.3', children: []},
            {title: 'Item 1.2.4', children: []}
          ]
        },
        {title: 'Item 1.3', children: []},
        {title: 'Item 1.4', children: []}
      ]
    },
    {title: 'Item 2', children: []},
    {title: 'Item 3', children: []},
    {
      title: 'Item 4',
      children: [
        {title: 'Item 4.1', children: []},
        {title: 'Item 4.2', children: []},
        {title: 'Item 4.3', children: []},
        {title: 'Item 4.4', children: []}
      ]
    },
    {title: 'Item 5', children: []}
  ])
  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    group: 'shared'
  })

  return (
    <div className='example-container'>
      <h2>Nested list</h2>
      <div {...getRootProps()}>
        {items.map(item => itemToView(item, getItemProps))}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  );
}

export default NestedList;

const snippet =
`interface Item {
  title: string
  children: Item[]
}

interface ListProps {
  itemsState: Item[]
}

const itemToView = <T extends Item, >(item: T, getItemProps: (item: T) => ItemProps) => {
  return (
    <div className='item' key={item.title} {...getItemProps(item)}>
      {item.title}
      <List itemsState={item.children}/>
    </div>
  )
}

const List = ({itemsState}: ListProps) => {
  const [items, setItems] = useState(itemsState)
  const setItemsInternal = ((setFun: (prev: Item[]) => Item[]) => {
    const newItems = setFun(items)
    itemsState.splice(0, items.length)
    itemsState.push(...newItems)
    setItems(newItems)
    return newItems
  }) as Dispatch<SetStateAction<Item[]>>
  const {getRootProps, getItemProps} = useSortable(setItemsInternal, {
    animation: 150,
    group: 'shared'
  })
  return (
    <div {...getRootProps()}>
      {items.map(item => itemToView(item, getItemProps))}
    </div>
  )
}

const NestedList = () => {
  const [items, setItems] = useState([
    {
      title: 'Item 1',
      children: [
        {title: 'Item 1.1', children: []},
        {
          title: 'Item 1.2',
          children: [
            {title: 'Item 1.2.1', children: []},
            {title: 'Item 1.2.2', children: []},
            {title: 'Item 1.2.3', children: []},
            {title: 'Item 1.2.4', children: []}
          ]
        },
        {title: 'Item 1.3', children: []},
        {title: 'Item 1.4', children: []}
      ]
    },
    {title: 'Item 2', children: []},
    {title: 'Item 3', children: []},
    {
      title: 'Item 4',
      children: [
        {title: 'Item 4.1', children: []},
        {title: 'Item 4.2', children: []},
        {title: 'Item 4.3', children: []},
        {title: 'Item 4.4', children: []}
      ]
    },
    {title: 'Item 5', children: []}
  ])
  const {getRootProps, getItemProps} = useSortable(setItems, {
    animation: 150,
    group: 'shared'
  })

  return (
    <div {...getRootProps()}>
      {items.map(item => itemToView(item, getItemProps))}
    </div>
  );
}
`
