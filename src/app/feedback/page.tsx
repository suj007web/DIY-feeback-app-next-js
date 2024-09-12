'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { IFeedback } from '@/models/Feedback';

const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get<IFeedback[]>('/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{feedback.name}</h2>
            <p className="mt-2">{feedback.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;