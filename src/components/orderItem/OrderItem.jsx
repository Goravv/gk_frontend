import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar2 from '../Navbar2';
import ExcelUpload from './ExcelUpload';
import ItemsTable from './ItemsTable';
import SearchBar from './SearchBar';
import API from '../../api';
import { setNextCaseNumber } from '../../app/Slices/packingSlice';

export default function OrderItem() {
  const dispatch = useDispatch();
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const client_name = selectedClient?.client_name;
  const marka = selectedClient?.marka;

  const [items, setItems] = useState([]);
  const [searchPartNo, setSearchPartNo] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Fetch order items
  const fetchItems = async () => {
    if (!client_name || !marka) return;
    try {
      const { data } = await API.get(`/api/orderitem/items/?client_name=${client_name}&marka=${marka}`);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert(`Error fetching items: ${error.response?.data?.error || error.message}`);
    }
  };



  useEffect(() => {
    fetchItems();
  }, [client_name, marka]);

  useEffect(() => {
    const query = searchPartNo.toLowerCase();
    const filtered = items.filter((item) =>
      item.part_no.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  }, [searchPartNo, items]);

  const handleDeleteItem = async (part_no) => {
    if (!window.confirm(`Are you sure you want to delete Part No: ${part_no}?`)) return;

    try {
      await API.delete(`/api/orderitem/items/${part_no}/?client_name=${client_name}&marka=${marka}`);
      alert('Item deleted successfully.');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error deleting item: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL items?')) return;

    try {
      await API.delete(`/api/orderitem/items/delete-all/?client_name=${client_name}&marka=${marka}`);
      alert('All items deleted successfully.');
      fetchItems();
    } catch (error) {
      console.error('Error deleting all items:', error);
      alert(`Error deleting all items: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Navbar2 />

      <h1 className="text-3xl font-bold mb-6 text-center">Excel Upload & Inventory</h1>

      <ExcelUpload
        onUploadSuccess={fetchItems}
        client_name={client_name}
        marka={marka}
      />

      {items.length > 0 && (
        <>
          <SearchBar
            value={searchPartNo}
            onChange={setSearchPartNo}
            onDeleteAll={handleDeleteAll}
          />
          <ItemsTable
            items={filteredItems}
            onDeleteItem={handleDeleteItem}
          />
        </>
      )}
    </div>
  );
}
