import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../features/products/productSlice';
import { logout } from '../features/auth/authslice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const handleOpenCreate = () => {
    setEditId(null); setTitle(''); setCategory(''); setPrice(''); setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id); setTitle(item.title); setCategory(item.category); setPrice(item.price); setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateProduct({ id: editId, title, category, price: Number(price) }));
    } else {
      dispatch(addProduct({ id: Date.now(), title, category, price: Number(price) }));
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2>Welcome, {user?.firstName || 'User'}! 👋</h2>
          <p>Total Records Found: <strong>{items.length}</strong></p>
        </div>
        <button onClick={() => dispatch(logout())} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>Logout</button>
      </div>

      <button onClick={handleOpenCreate} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', marginBottom: '20px' }}>+ Add Product</button>

      {loading && <p>Loading data table...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.category}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${item.price}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleOpenEdit(item)} style={{ marginRight: '5px', padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none' }}>Edit</button>
                  <button onClick={() => dispatch(deleteProduct(item.id))} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleSave} style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '300px' }}>
            <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} required />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '6px' }} required />
            <button type="submit" style={{ padding: '8px', background: '#28a745', color: '#fff', border: 'none', marginRight: '10px' }}>Save</button>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px', background: '#ccc', border: 'none' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;