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
import SwapList from '@examples/SwapList';
import Sortable, {Swap} from 'sortablejs';

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
        <SwapList/>
      </div>
    </SortableProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
Sortable.mount(new Swap())

root.render(
  <App/>
);
