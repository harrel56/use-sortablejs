import {useState} from 'react'
import {ExtendedOptions, useSortable} from 'use-sortablejs'
import CodeSnippet from '@examples/CodeSnippet'

const ConfigurableList = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const [options, setOptions] = useState<ExtendedOptions<string>>({
    group: 'configurable',  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    sort: true,  // sorting inside list
    delay: 0, // time in milliseconds to define when the sorting should start
    delayOnTouchOnly: false, // only delay if user is using touch
    touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
    disabled: false, // Disables the sortable if set to true.
    animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
    easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
    preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
    draggable: '.item',  // Specifies which items inside the element should be draggable
    dataIdAttr: 'data-id', // HTML attribute that is used by the `toArray()` method
    ghostClass: 'item--ghost',  // Class name for the drop placeholder
    chosenClass: 'item--chosen',  // Class name for the chosen item
    dragClass: 'item--drag',  // Class name for the dragging item
    swapThreshold: 1, // Threshold of the swap zone
    invertSwap: false, // Will always use inverted swap zone if set to true
    invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
    direction: 'vertical', // Direction of Sortable (will be detected automatically if not given)
    forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
    fallbackClass: 'item--fallback',  // Class name for the cloned DOM Element when using forceFallback
    fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
    fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
    dragoverBubble: false,
    removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
    emptyInsertThreshold: 5 // px, distance mouse must be from empty sortable to insert drag element into it
  })
  const [optionsString, setOptionsString] = useState(JSON.stringify(options, null, 2))
  const {getRootProps, getItemProps} = useSortable({setItems, options})
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
    group: "configurable",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    sort: true,  // sorting inside list
    delay: 0, // time in milliseconds to define when the sorting should start
    delayOnTouchOnly: false, // only delay if user is using touch
    touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
    disabled: false, // Disables the sortable if set to true.
    animation: 150,  // ms, animation speed moving items when sorting, \`0\` — without animation
    easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
    preventOnFilter: true, // Call \`event.preventDefault()\` when triggered \`filter\`
    draggable: ".item",  // Specifies which items inside the element should be draggable
    dataIdAttr: 'data-id', // HTML attribute that is used by the \`toArray()\` method
    ghostClass: "item--ghost",  // Class name for the drop placeholder
    chosenClass: "item--chosen",  // Class name for the chosen item
    dragClass: "item--drag",  // Class name for the dragging item
    swapThreshold: 1, // Threshold of the swap zone
    invertSwap: false, // Will always use inverted swap zone if set to true
    invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
    direction: 'vertical', // Direction of Sortable (will be detected automatically if not given)
    forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
    fallbackClass: "item--fallback",  // Class name for the cloned DOM Element when using forceFallback
    fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
    fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
    dragoverBubble: false,
    removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
    emptyInsertThreshold: 5 // px, distance mouse must be from empty sortable to insert drag element into it
  })
  const [optionsString, setOptionsString] = useState(JSON.stringify(options, null, 2))
  const {getRootProps, getItemProps} = useSortable({setItems, options})
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
