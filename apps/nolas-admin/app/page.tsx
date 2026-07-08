'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Types
interface HeroSection {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OurCustomer {
  id: number;
  title: string;
  description: string;
  points: string[];
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AboutUs {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Benefit {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'hero';

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<OurCustomer[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUs[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  // Form states (Editing vs Adding)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // For Customers
  const [points, setPoints] = useState<string[]>(['']);

  // Auto-clear messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setEditingId(null);
    setIsAdding(false);
    resetForm();

    try {
      let endpoint = '';
      if (activeTab === 'hero') endpoint = '/api/hero';
      else if (activeTab === 'services') endpoint = '/api/services';
      else if (activeTab === 'customers') endpoint = '/api/customers';
      else if (activeTab === 'about-us') endpoint = '/api/about-us';
      else if (activeTab === 'benefits') endpoint = '/api/benefits';

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (activeTab === 'hero') setHeroes(data);
      else if (activeTab === 'services') setServices(data);
      else if (activeTab === 'customers') setCustomers(data);
      else if (activeTab === 'about-us') setAboutUs(data);
      else if (activeTab === 'benefits') setBenefits(data);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to load ${activeTab} data. Make sure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Reset form inputs
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setPoints(['']);
    setEditingId(null);
    setIsAdding(false);
  };

  // Set form for Editing
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.imageUrl || '');
    if (activeTab === 'customers') {
      setPoints(item.points || ['']);
    }
  };

  // Set form for Adding
  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  // Points Helpers for Customers
  const handlePointChange = (index: number, val: string) => {
    const updated = [...points];
    updated[index] = val;
    setPoints(updated);
  };

  const addPointField = () => {
    setPoints([...points, '']);
  };

  const removePointField = (index: number) => {
    if (points.length <= 1) return;
    const updated = points.filter((_, i) => i !== index);
    setPoints(updated);
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: any = { title, description };
    if (activeTab !== 'hero') {
      payload.imageUrl = imageUrl || null;
    }
    if (activeTab === 'customers') {
      payload.points = points.filter(p => p.trim() !== '');
    }

    const isEdit = editingId !== null;
    // Hero tab only supports PUT (no POST — creation not allowed)
    if (activeTab === 'hero' && !isEdit) {
      setError('Creating new hero sections is not allowed. Please edit an existing one.');
      setLoading(false);
      return;
    }
    const url = isEdit
      ? `/api/${activeTab}/${editingId}`
      : `/api/${activeTab}`;

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Request failed');
      }

      setSuccessMsg(isEdit ? 'Item updated successfully!' : 'Item created successfully!');
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      setSuccessMsg('Item deleted successfully!');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Delete operation failed.');
      setLoading(false);
    }
  };

  // Render helpers
  const getTabTitle = () => {
    if (activeTab === 'hero') return 'Hero Section Management';
    if (activeTab === 'services') return 'Services Management';
    if (activeTab === 'customers') return 'Our Customers Management';
    if (activeTab === 'about-us') return 'About Us Management';
    if (activeTab === 'benefits') return 'Benefits Management';
    return 'Dashboard';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{getTabTitle()}</h1>
          <p className="page-desc">View, edit, create and remove database records for the landing page.</p>
        </div>
        {!isAdding && editingId === null && activeTab !== 'hero' && (
          <button className="btn btn-primary" onClick={startAdd}>
            + Add New Record
          </button>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="alert alert-success">
          <span>✔️ {successMsg}</span>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setSuccessMsg(null)}>✕</button>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Form (Add or Edit Mode) */}
      {(isAdding || editingId !== null) && (
        <div className="glass-card">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            {editingId !== null ? `Edit Record (ID: ${editingId})` : 'Create New Record'}
          </h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title copy..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description copy..."
                required
              />
            </div>

            {activeTab !== 'hero' && (
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg (Optional)"
                />
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="form-group">
                <label className="form-label">Points (Bullets)</label>
                <div className="points-list">
                  {points.map((point, index) => (
                    <div key={index} className="point-item">
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={point}
                        onChange={(e) => handlePointChange(index, e.target.value)}
                        placeholder={`Point ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.8rem', color: 'var(--accent-danger)' }}
                        onClick={() => removePointField(index)}
                        disabled={points.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: 'fit-content', marginTop: '0.25rem' }}
                    onClick={addPointField}
                  >
                    + Add Point Bullet
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Record'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main List Section */}
      {loading && !isAdding && editingId === null ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="status-dot" style={{ display: 'inline-block', marginRight: '0.5rem' }}></div> Loading database entries...
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem 1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            Current Records
          </h2>

          {/* Hero Section List */}
          {activeTab === 'hero' && (
            <div className="data-table-container">
              {heroes.length === 0 ? (
                <div className="empty-state">
                  <h3>No Hero entries found</h3>
                  <p>The hero section will be auto-seeded on first API call.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '300px' }}>Title</th>
                      <th>Description</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroes.map((hero) => (
                      <tr key={hero.id}>
                        <td>#{hero.id}</td>
                        <td style={{ fontWeight: '600' }}>{hero.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{hero.description}</td>
                        <td className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => startEdit(hero)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(hero.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Services List */}
          {activeTab === 'services' && (
            <div className="data-table-container">
              {services.length === 0 ? (
                <div className="empty-state">
                  <h3>No Services found</h3>
                  <p>Click "Add New Record" to create one.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '100px' }}>Image</th>
                      <th style={{ width: '250px' }}>Title</th>
                      <th>Description</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>#{service.id}</td>
                        <td>
                          {service.imageUrl ? (
                            <img className="cell-thumbnail" src={service.imageUrl} alt={service.title} />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{service.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{service.description}</td>
                        <td className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => startEdit(service)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(service.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Customers List */}
          {activeTab === 'customers' && (
            <div className="data-table-container">
              {customers.length === 0 ? (
                <div className="empty-state">
                  <h3>No Customer entries found</h3>
                  <p>Click "Add New Record" to create one.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '100px' }}>Image</th>
                      <th style={{ width: '220px' }}>Title</th>
                      <th>Description & Points</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust) => (
                      <tr key={cust.id}>
                        <td>#{cust.id}</td>
                        <td>
                          {cust.imageUrl ? (
                            <img className="cell-thumbnail" src={cust.imageUrl} alt={cust.title} />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{cust.title}</td>
                        <td>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{cust.description}</p>
                          {cust.points && cust.points.length > 0 && (
                            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--primary)' }}>
                              {cust.points.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => startEdit(cust)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cust.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* About Us List */}
          {activeTab === 'about-us' && (
            <div className="data-table-container">
              {aboutUs.length === 0 ? (
                <div className="empty-state">
                  <h3>No About Us entries found</h3>
                  <p>Click "Add New Record" to create one.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '100px' }}>Image</th>
                      <th style={{ width: '250px' }}>Title</th>
                      <th>Description</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aboutUs.map((entry) => (
                      <tr key={entry.id}>
                        <td>#{entry.id}</td>
                        <td>
                          {entry.imageUrl ? (
                            <img className="cell-thumbnail" src={entry.imageUrl} alt={entry.title} />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{entry.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{entry.description}</td>
                        <td className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => startEdit(entry)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Benefits List */}
          {activeTab === 'benefits' && (
            <div className="data-table-container">
              {benefits.length === 0 ? (
                <div className="empty-state">
                  <h3>No Benefits found</h3>
                  <p>Click "Add New Record" to create one.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '100px' }}>Image</th>
                      <th style={{ width: '250px' }}>Title</th>
                      <th>Description</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benefits.map((benefit) => (
                      <tr key={benefit.id}>
                        <td>#{benefit.id}</td>
                        <td>
                          {benefit.imageUrl ? (
                            <img className="cell-thumbnail" src={benefit.imageUrl} alt={benefit.title} />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{benefit.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{benefit.description}</td>
                        <td className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => startEdit(benefit)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(benefit.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
