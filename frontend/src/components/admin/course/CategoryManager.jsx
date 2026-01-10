import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaFolder } from 'react-icons/fa';
import courseService from '../../../services/courseService';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', parent_id: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await courseService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await courseService.updateCategory(editingId, formData);
            } else {
                await courseService.createCategory(formData);
            }
            setFormData({ name: '', description: '', parent_id: '' });
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            alert('Failed to save category');
        }
    };

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, description: cat.description || '', parent_id: cat.parent_id || '' });
        setEditingId(cat.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await courseService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Quản lý Danh mục</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Form */}
                <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', height: 'fit-content' }}>
                    <h4 style={{ marginBottom: '15px' }}>{editingId ? 'Sửa Danh mục' : 'Thêm Danh mục mới'}</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Tên danh mục"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={styles.input}
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={styles.input}
                        />
                        <select
                            value={formData.parent_id}
                            onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                            style={styles.input}
                        >
                            <option value="">Không có danh mục cha</option>
                            {categories.filter(c => c.id !== editingId).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={styles.btnPrimary}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '', parent_id: '' }); }} style={styles.btnSecondary}>
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div>
                    {loading ? <p>Loading...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={styles.th}>Tên</th>
                                    <th style={styles.th}>Slug</th>
                                    <th style={styles.th}>Cha</th>
                                    <th style={styles.th}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={styles.td}><FaFolder style={{ color: '#fbbf24', marginRight: '8px' }} /> {cat.name}</td>
                                        <td style={styles.td}>{cat.slug}</td>
                                        <td style={styles.td}>{cat.parent ? cat.parent.name : '-'}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => handleEdit(cat)} style={styles.actionBtn}><FaEdit /></button>
                                            <button onClick={() => handleDelete(cat.id)} style={{ ...styles.actionBtn, color: '#ef4444' }}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' },
    btnPrimary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' },
    btnSecondary: { padding: '10px 20px', borderRadius: '6px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', cursor: 'pointer' },
    th: { textAlign: 'left', padding: '10px', color: '#64748b', fontSize: '0.9rem' },
    td: { padding: '10px', color: '#334155' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#64748b' }
};

export default CategoryManager;
