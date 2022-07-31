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
import Sortable, {MultiDrag, Swap} from 'sortablejs';
import MultiDragList from '@examples/MultiDragList';

function App() {
  return (
    <SortableProvider>
      <main className="container">
        <SimpleList/>
        <SharedList/>
        <CloningList/>
        <DisabledList/>
        <HandleList/>
        <FilterList/>
        <GridList/>
        <NestedList/>
        <SwapList/>
        <MultiDragList/>
        <footer className='footer'>
          <p>Source code on: <a href='https://gitlab.com/org.harrel/use-sortablejs'>GitLab</a></p>
        </footer>
      </main>
    </SortableProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
Sortable.mount(new Swap())
Sortable.mount(new MultiDrag())

root.render(
  <App/>
);
