import ReactDOM from 'react-dom/client';
import DoubleList from '@examples/DoubleList';
import NestedList from '@examples/NestedList';

function App() {
  return (
    <div className="app">
      <DoubleList/>
      <NestedList/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <App />
);
