import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Client from './components/client/client';
import ClientForm from './components/client/clientForm';
import Home from './components/Home';
import About from './components/About';
import Contect from './components/contect';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><Contect /></PrivateRoute>} />
        <Route
          path="/mrp_list"
          element={
            <PrivateRoute>
              <MRP />
            </PrivateRoute>
          }
        />
        <Route
          path="/orderitem"
          element={
            <PrivateRoute>
              <OrderItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/estimate"
          element={
            <PrivateRoute>
              <Asstimate />
            </PrivateRoute>
          }
        />
        <Route
          path="/packing"
          element={
            <PrivateRoute>
              <Packing />
            </PrivateRoute>
          }
        />
        <Route
          path="/startpacking"
          element={
            <PrivateRoute>
              <StartPacking />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-stock"
          element={
            <PrivateRoute>
              <StockForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-packing"
          element={
            <PrivateRoute>
              <PackingForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/row-packing-list"
          element={
            <PrivateRoute>
              <PackingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/stock-list"
          element={
            <PrivateRoute>
              <StockList />
            </PrivateRoute>
          }
        />
        <Route
          path="/packing-list"
          element={
            <PrivateRoute>
              <DisplayPackingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/client"
          element={
            <PrivateRoute>
              <Client />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-client"
          element={
            <PrivateRoute>
              <ClientForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
