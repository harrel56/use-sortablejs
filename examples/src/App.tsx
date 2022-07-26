import ReactDOM from 'react-dom/client';
import SharedList from '@examples/SharedList';
import NestedList from '@examples/NestedList';
import SimpleList from '@examples/SimpleList';
import CloningList from '@examples/CloningList';

function App() {
  return (
    <div className="container">
      <SimpleList/>
      <SharedList/>
      <CloningList/>
      <NestedList/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <App />
);
