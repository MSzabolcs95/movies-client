import React, { useState, useContext } from 'react';
import { addComment } from '../api/commentApi';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get the user

interface AddCommentProps {
  movieId: string;
  onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({ movieId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { user } = useContext(AuthContext); // Access the user from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user || !user.id) {
      setError('User not authenticated.');
      return;
    }

    const newComment = {
      content,
      movieId,
    };

    try {
      await addComment(newComment, user.id);
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