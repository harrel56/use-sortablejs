# use-sortablejs

[SortableJS](https://github.com/SortableJS/Sortable) ported to React hooks.

Demo: https://harrel56.github.io/use-sortablejs

[![build actions status](https://github.com/harrel56/use-sortablejs/actions/workflows/build.yml/badge.svg)](https://github.com/harrel56/use-sortablejs/actions/workflows/build.yml)

[![npm](https://badgen.net/npm/v/use-sortablejs)](https://www.npmjs.com/package/use-sortablejs)
[![license](https://badgen.net/npm/license/use-sortablejs)](https://github.com/harrel56/use-sortablejs/blob/master/LICENSE)
[![types](https://badgen.net/npm/types/use-sortablejs)](https://www.npmjs.com/package/use-sortablejs)
[![minified size](https://badgen.net/bundlephobia/min/use-sortablejs)](https://bundlephobia.com/package/use-sortablejs)
[![minzip size](https://badgen.net/bundlephobia/minzip/use-sortablejs)](https://bundlephobia.com/package/use-sortablejs)

Created to serve as a refreshed alternative to [react-sortablejs](https://github.com/SortableJS/react-sortablejs),
with hook design inspired by [@mui/base](https://www.npmjs.com/package/@mui/base).

## Installation

Currently, package is only available as ES module.

```sh
npm i use-sortablejs
```

Contains no external dependencies, only peer dependencies:

+ `react`: `^17.0.0 || ^18.0.0`
+ `sortablejs`: `^1.0.0`
+ `@types/react`: `^17.0.0 || ^18.0.0`
+ `@types/sortablejs`: `^1.0.0`

Package exports:

+ `SortableProvider`: sortable context provider,
+ `useSortable`: main hook which requires access to sortable context
+ and typescript definitions.

Supports:

+ all basic functionalities from `SortableJS`,
+ swap plugin (you have to mount it yourself)
+ and multidrag plugin (you have to mount it yourself).

## Usage

Before using `useSortable` hook, it's required to wrap your application with `SortableProvider`.
Preferably, there should be only one `SortableProvider` per whole application, but it's not mandatory.
Nevertheless, interactions between two sortables in separate contexts have undefined behaviour.

Example:

```tsx
// App.tsx
import {SortableProvider} from 'use-sortablejs'
import List from './List'

const App = () => {
  return (
    <SortableProvider>
      <List/>
    </SortableProvider>
  )
}
```

```tsx
// List.tsx
import {useState} from 'react'
import {useSortable} from 'use-sortablejs'

const List = () => {
  const [items, setItems] = useState([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ])
  const {getRootProps, getItemProps} = useSortable({setItems, options: {animation: 150}})
  return (
    <div {...getRootProps()}>
      {items.map(item => <div key={item} {...getItemProps(item)}>{item}</div>)}
    </div>
  )
}
```
Where item type can be possibly anything (primitive, object of any shape, function).

## Details

All types definitions can be found in this [file](https://github.com/harrel56/use-sortablejs/blob/master/main/src/types.ts).

`useSortable` takes `UseSortableProps` parameter, which is an object containing:
1. `setItems`: `Dispatch<SetStateAction<T[]>>`, where `T` is your item type. In most cases this should be a `setState` function returned from React `useState` hook.
2. `options`: `ExtendedOptions<T>`, options object which you would normally pass to `Sortable.create()`.
3. *(optional)* `cloneItem`: `(item: T) => T`, clone function to perform when item is being cloned. Defaults to internal shallow clone function.
4. *(optional)* `sortableRef`: `Ref<Sortable>`, ref object or ref callback, which will be set/called with created `Sortable` object - set to `null` on dismount.

Additionally, all event functions that you pass to `options` object will have access to extended event object (`SortableEventExtended<T>`),
which contains additional field `stateItem`, which corresponds to dragged item state and is directly mapped from `item` field.

## Constraints

1. Each direct child of node with `getRootProps()` should have set props from `getItemProps(item)`.
2. Each direct child of node with `getRootProps()` should contain unique `key` prop (**NOT** list index).
3. `setItems` function should cause rerender of sortable list to reflect items state.

Behaviour is undefined if any of these constraints is not met.
