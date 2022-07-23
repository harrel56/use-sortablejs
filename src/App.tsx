import Container from './Container';
import {useState} from 'react';

function App() {
  const [items, setItems] = useState([
    {msg: 'item 1', data: 1},
    {msg: 'item 2', data: 2},
    {msg: 'item 3', data: 3}
  ])

  const [items2, setItems2] = useState([
    {msg: 'item 1', data: 1},
    {msg: 'item 2', data: 2},
    {msg: 'item 3', data: 3}
  ])

  console.log('state', ...items)
  console.log('state2', ...items2)

  return (
    <div className="app">
      <Container items={items}
                 itemToView={
                   i => <p key={i.data}>{i.msg}</p>
                 }
                 options={{
                   animation: 150,
                   group: 'test',
                   onItemsChange: setItems
                 }}
      />
      <Container items={items2}
                 itemToView={
                   i => <p key={i.msg}>{i.msg}</p>
                 }
                 options={{
                   animation: 150,
                   group: 'test',
                   onItemsChange: setItems2
                 }}
      />
    </div>
  );
}

export default App;
