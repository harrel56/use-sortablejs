import ReactDOM from 'react-dom/client';
import SharedList from '@examples/SharedList';
import NestedList from '@examples/NestedList';
import SimpleList from '@examples/SimpleList';
import CloningList from '@examples/CloningList';
import GridList from '@examples/GridList';
import DisabledList from '@examples/DisabledList';
import HandleList from '@examples/HandleList';
import FilterList from '@examples/FilterList';
import SortableProvider from '@react-sortablejs/SortableProvider';

function App() {
  return (
    <SortableProvider>
      <div className="container">
        <SimpleList/>
        <SharedList/>
        <CloningList/>
        <DisabledList/>
        <HandleList/>
        <FilterList/>
        <GridList/>
        <NestedList/>
      </div>
    </SortableProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <App/>
);
