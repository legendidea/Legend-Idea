
import React, { useState } from 'react';
import { Idea, User } from '../types';
import { ArrowLeftIcon } from './icons';

interface IdeaFormProps {
  onSubmit: (idea: Idea) => void;
  onCancel: () => void;
  currentUser: User;
}

const CATEGORIES = ['Technology', 'Business', 'Art', 'Sustainability', 'Education'];

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, onCancel, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      // Check if the URL ends with a common image extension
      return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrl && !isValidUrl(imageUrl)) {
        setImageUrlError('Please enter a valid image URL (e.g., ending in .png, .jpg)');
        return;
    }
    setImageUrlError('');


    if (!title || !description || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    const newIdea: Idea = {
      id: `i${Date.now()}`,
      title,
      description,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl: imageUrl || `https://picsum.photos/seed/${title.replace(/\s+/g, '-')}/800/600`,
      author: currentUser, // Use the current user as the author
      upvotes: 0,
      rating: 0,
      comments: [],
      // FIX: Add missing 'analytics' property for new ideas.
      analytics: {
        views: 0,
        geo: {},
      },
    };

    onSubmit(newIdea);
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (imageUrlError) {
        setImageUrlError('');
    }
  };


  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <button onClick={onCancel} className="flex items-center gap-2 text-brand-primary font-semibold mb-6 hover:underline">
            <ArrowLeftIcon className="w-5 h-5"/>
            Back
        </button>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Submit Your Idea</h1>
            <p className="text-brand-gray mb-8">Fill out the details below to share your concept with the community.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="e.g., AI-Powered Personal Gardener"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Describe your idea in detail. What problem does it solve? Who is it for?"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            <option value="" disabled>Select a category...</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="e.g., AI, Sustainability, Mobile App"
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary ${imageUrlError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="https://example.com/image.png"
                    />
                    {imageUrlError && <p className="mt-1 text-sm text-red-600">{imageUrlError}</p>}
                </div>

                <div className="flex justify-end pt-4">
                     <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300 mr-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Submit Idea
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default IdeaForm;
