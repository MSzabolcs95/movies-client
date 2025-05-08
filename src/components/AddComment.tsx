import React, { useState } from 'react';
import { addComment } from '../api/commentApi';

interface AddCommentProps {
  movieId: string;
  onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({ movieId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const newComment = {
      content,
      movieId,
    };

    try {
      await addComment(newComment); 
      setSuccess(true);
      setContent('');
      onCommentAdded(); 
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
        className="form-control mb-2"
        rows={3}
        required
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      {error && <p className="text-danger mt-2">{error}</p>}
      {success && <p className="text-success mt-2">Comment added successfully!</p>}
    </form>
  );
};

export default AddComment;