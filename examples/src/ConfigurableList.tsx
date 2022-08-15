import {useState} from 'react';
import {ExtendedOptions, useSortable} from 'use-sortablejs';
import CodeSnippet from '@examples/CodeSnippet';

const ConfigurableList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const [options, setOptions] = useState<ExtendedOptions<string>>({
    animation: 150
  })
  const [optionsString, setOptionsString] = useState(JSON.stringify(options, null, 2))
  const {getRootProps, getItemProps} = useSortable(setItems, options)
  return (
    <div className='example-container'>
      <h2>Configurable list</h2>
      <textarea value={optionsString} onChange={(e) => setOptionsString(e.target.value)}/>
      <button className='button-small' onClick={() => setOptions(JSON.parse(optionsString))}>Apply options</button>
      <div id='configurable-list' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
      <CodeSnippet code={snippet}/>
    </div>
  )
}

export default ConfigurableList

const snippet =
`const ConfigurableList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const [options, setOptions] = useState<ExtendedOptions<string>>({
    animation: 150
  })
  const [optionsString, setOptionsString] = useState(JSON.stringify(options, null, 2))
  const {getRootProps, getItemProps} = useSortable(setItems, options)
  return (
    <div className='example-container'>
      <h2>Configurable list</h2>
      <textarea value={optionsString} onChange={(e) => setOptionsString(e.target.value)}/>
      <button className='button-small' onClick={() => setOptions(JSON.parse(optionsString))}>Apply options</button>
      <div id='configurable-list' {...getRootProps()}>
        {items.map(item => <div className='item' key={item} {...getItemProps(item)}>{item}</div>)}
      </div>
    </div>
  )
}
`
