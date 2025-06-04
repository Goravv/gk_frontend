import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MRP from './components/MRP/MRP';
import OrderItem from './components/orderItem/OrderItem';
import Asstimate from './components/asstimate/asstimate';
import Packing from './components/packing/packing';
import StartPacking from './components/packing/StartPacking';
import StockForm from './components/packing/StockForm';
import StockList from './components/packing/StockList';
import PackingForm from './components/packing/PackingFrom';
import PackingList from './components/packing/PackingList';
import DisplayPackingList from './components/packing/DIsplayPacking';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/mrp_list" element={<MRP />} />
        <Route path="/orderitem" element={<OrderItem />} />
        <Route path="/asstimate" element={<Asstimate />} />
        <Route path="/packing" element={<Packing />} />
        <Route path="/startpacking" element={<StartPacking />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/add-stock" element={<StockForm />} />
        <Route path="/add-packing" element={<PackingForm />} />
        <Route path="/row-packing-list" element={<PackingList />} />
        <Route path="/stock-list" element={<StockList />} />
        <Route path="/packing-list" element={<DisplayPackingList />} />

      </Routes>
    </Router>
    // <div>
    //   <MRP/>
    // </div>
  );
}

export default App;
