import FeedbackForm from '@/components/FeedbackForm';

const PostFeedback: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post Your Feedback</h1>
      <FeedbackForm />
    </div>
  );
};

export default PostFeedback;