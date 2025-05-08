import React, { useEffect, useState, useContext } from 'react';
import { getAllCommentsForMovie } from '../api/commentApi';
import AddComment from './AddComment';
import { AuthContext } from '../context/AuthContext';

interface MovieCommentsProps {
  movieId: string;
}

const MovieComments = ({ movieId }: MovieCommentsProps) => {
  interface Comment {
    id: string;
    content: string;
    username: string; 
    createdAt: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useContext(AuthContext); 

  const refreshComments = async () => {
    const data = await getAllCommentsForMovie(movieId);
    setComments(data);
  };

  useEffect(() => {
    refreshComments();
  }, [movieId]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold">Comments</h2>
      <ul className="list-unstyled">
        {comments.map((comment) => (
          <li key={comment.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                >
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="text-dark">{comment.username}</strong>
                  <br />
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
              <p className="mb-0 text-secondary">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
      {user && <AddComment movieId={movieId} onCommentAdded={refreshComments} />}
    </div>
  );
};

export default MovieComments;