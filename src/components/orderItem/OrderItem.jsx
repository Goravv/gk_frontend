import React, { useState, useEffect } from 'react';
import ExcelUpload from './ExcelUpload';
import ItemsTable from './ItemsTable';
import SearchBar from './SearchBar';
import API from '../../api';

export default function OrderItem() {
  const [items, setItems] = useState([]);
  const [searchPartNo, setSearchPartNo] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await API.get('/api/orderitem/items/');
      setItems(res.data);
    } catch (error) {
      alert('Error fetching items: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const lowerSearch = searchPartNo.toLowerCase();
    setFilteredItems(
      items.filter((item) =>
        item.part_no.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchPartNo, items]);

  const handleDeleteItem = async (part_no) => {
    if (!window.confirm(`Are you sure to delete Part No: ${part_no}?`)) return;
    try {
      await API.delete(`/api/orderitem/items/${part_no}/`);
      alert('Item deleted');
      fetchItems();
    } catch (error) {
      alert('Error deleting item: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure to delete ALL items?')) return;
    try {
      await API.delete('/api/orderitem/items/delete-all/');
      alert('All items deleted');
      fetchItems();
    } catch (error) {
      alert('Error deleting all items: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Excel Upload & Inventory</h1>

      <ExcelUpload onUploadSuccess={fetchItems} />

      {items.length > 0 && (
        <>
          <SearchBar
            value={searchPartNo}
            onChange={setSearchPartNo}
            onDeleteAll={handleDeleteAll}
          />
          <ItemsTable items={filteredItems} onDeleteItem={handleDeleteItem} />
        </>
      )}
    </div>
  );
}
