import React, { useState, useEffect } from 'react';
import { FaTag, FaTrash, FaPlus } from 'react-icons/fa';
import courseService from '../../../services/courseService';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tagName, setTagName] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const data = await courseService.getTags();
            setTags(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tagName.trim()) return;
        try {
            await courseService.createTag({ name: tagName });
            setTagName('');
            fetchTags();
        } catch (error) {
            alert('Failed to create tag');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this tag?')) {
            try {
                await courseService.deleteTag(id);
                fetchTags();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Quản lý Thẻ (Tags)</h3>

            <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', height: 'fit-content' }}>
                    <h4 style={{ marginBottom: '15px' }}>Thêm Thẻ Mới</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tên thẻ..."
                            value={tagName}
                            onChange={e => setTagName(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>
                            <FaPlus /> Thêm
                        </button>
                    </form>
                </div>

                <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {tags.map(tag => (
                            <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', backgroundColor: '#eff6ff', borderRadius: '20px', border: '1px solid #bfdbfe', color: '#2563eb' }}>
                                <FaTag size={12} />
                                <span style={{ fontWeight: '500' }}>{tag.name}</span>
                                <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagManager;
