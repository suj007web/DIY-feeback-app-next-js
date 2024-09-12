"use client"
import { useState, FormEvent } from 'react';
import axios from 'axios';

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', { name, feedback });
      alert('Feedback submitted successfully!');
      setName('');
      setFeedback('');
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-300">Feedback</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        ></textarea>
      </div>
      <button type="submit" className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition duration-300">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;