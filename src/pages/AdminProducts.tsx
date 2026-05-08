import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Package, DollarSign, Image as ImageIcon, Star, MessageSquare, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminProducts: React.FC = () => {
  const { products, fetchProducts, addProduct, isLoading, error, user } = useStore();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: 'Roses',
    image: '',
    badge: '',
    rating: '5',
    reviews: '0',
    description: '',
    icon: '🌹'
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addProduct({
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      rating: parseInt(formData.rating),
      reviews: parseInt(formData.reviews)
    });
    
    if (success) {
      setShowForm(false);
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        category: 'Roses',
        image: '',
        badge: '',
        rating: '5',
        reviews: '0',
        description: '',
        icon: '🌹'
      });
    }
  };

  return (
    <div className="admin-products" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>Product Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Create New Bouquet</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }}>
                <option value="Roses">Roses</option>
                <option value="Mixed">Mixed</option>
                <option value="Peonies">Peonies</option>
                <option value="Wildflowers">Wildflowers</option>
                <option value="Dried">Dried</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Old Price ($) - Optional</label>
              <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} required placeholder="https://unsplash.com/..." style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Badge (e.g., Sale, New)</label>
              <input type="text" name="badge" value={formData.badge} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Icon (Emoji)</label>
              <input type="text" name="icon" value={formData.icon} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #ddd' }}></textarea>
            </div>
            <button type="submit" disabled={isLoading} style={{ gridColumn: 'span 2', padding: '1rem', background: '#38a169', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      <div className="products-list" style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Badge</th>
              <th style={{ padding: '1rem' }}>Stats</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={product.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.3rem' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.6rem', background: '#ebf8ff', color: '#2b6cb0', borderRadius: '1rem', fontSize: '0.8rem' }}>{product.category}</span></td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>${Number(product.price).toFixed(2)}</div>
                  {product.oldPrice && <div style={{ fontSize: '0.8rem', color: '#a0aec0', textDecoration: 'line-through' }}>${Number(product.oldPrice).toFixed(2)}</div>}
                </td>
                <td style={{ padding: '1rem' }}>{product.badge || '-'}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}><Star size={12} fill="#ecc94b" color="#ecc94b" /> {product.rating}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}><MessageSquare size={12} color="#a0aec0" /> {product.reviews}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
