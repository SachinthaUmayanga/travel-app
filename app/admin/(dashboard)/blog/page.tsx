"use client";

import React, { useState, useEffect } from 'react';

type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      image: post.image,
      author: post.author,
    });
    setMessage({ text: '', type: '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const url = isEditing ? `/api/blog/${currentPostId}` : '/api/blog';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ text: `Post ${isEditing ? 'updated' : 'created'} successfully!`, type: 'success' });
        fetchPosts();
        if (!isEditing) {
          setFormData({ title: '', content: '', image: '', author: '' });
        }
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Failed to save post', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentPostId(null);
    setFormData({ title: '', content: '', image: '', author: '' });
    setMessage({ text: '', type: '' });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Blog Posts</h1>
      
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Post' : 'Add New Post'}</h2>
        
        {message.text && (
          <div className={`p-4 mb-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Author</label>
              <input 
                type="text" 
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Image URL</label>
            <input 
              type="text" 
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Content (HTML supported)</label>
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 h-40"
              required
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Existing Posts</h2>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No blog posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded font-semibold transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
