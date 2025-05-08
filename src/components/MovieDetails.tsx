import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/movieApi';
import MovieComments from './MovieComments';
import AuthProvider, { AuthContext } from '../context/AuthContext';

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { user } = useContext(AuthContext); 
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); 
  const [showAllImages, setShowAllImages] = useState(false); 
  const [showFullCast, setShowFullCast] = useState(false); 
  const [showFullCrew, setShowFullCrew] = useState(false); 

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (movieId) {
          const data = await getMovieDetails(movieId);
          setMovieDetails(data);
        }
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;

  const displayedImages = showAllImages
    ? movieDetails.images.backdrops
    : movieDetails.images.backdrops.slice(0, 5); 
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const showNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < movieDetails.images.backdrops.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const showPreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const displayedCast = showFullCast
  ? movieDetails.credits.cast
  : movieDetails.credits.cast.slice(0, 5);

const displayedCrew = showFullCrew
  ? movieDetails.credits.crew
  : movieDetails.credits.crew.slice(0, 5);

const toggleCastVisibility = () => {
  setShowFullCast((prev) => !prev);
};

const toggleCrewVisibility = () => {
  setShowFullCrew((prev) => !prev);
};

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Movie Poster */}
        <div className="col-md-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.posterPath}`}
            alt={movieDetails.title}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Movie Details */}
        <div className="col-md-8">
          <h1 className="mb-3">{movieDetails.title}</h1>
          <p className="text-muted">{movieDetails.overview}</p>
          <p>
            <strong>Release Date:</strong> {movieDetails.release_date}
          </p>
          <p>
          {/* Cast and Crew Section */}
            <strong>Genres:</strong> {movieDetails.genres.map((genre: any) => genre.name).join(', ')}
          </p>
          {/* Cast and Crew Section */}
      <div className="row mt-5">
        {/* Cast Section */}
        <div className="col-md-4">
          <h2>Cast</h2>
          <ul className="list-unstyled">
            {displayedCast.map((cast: any) => (
              <li key={cast.castId} className="mb-2">
                <strong>{cast.name}</strong> as {cast.character}
              </li>
            ))}
          </ul>
          {movieDetails.credits.cast.length > 5 && (
            <button
              className="btn btn-link p-0"
              onClick={toggleCastVisibility}
            >
              {showFullCast ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Crew Section */}
        <div className="col-md-4">
          <h2>Crew</h2>
          <ul className="list-unstyled">
            {displayedCrew.map((crew: any) => (
              <li key={crew.name} className="mb-2">
                <strong>{crew.name}</strong> - {crew.job}
              </li>
            ))}
          </ul>
          {movieDetails.credits.crew.length > 5 && (
            <button
              className="btn btn-link p-0"
              onClick={toggleCrewVisibility}
            >
              {showFullCrew ? 'See Less' : 'See More'}
            </button>
          )}
        </div>
      </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="mt-5">
        <h2>Images</h2>
        <div className="d-flex flex-wrap">
          {displayedImages.map((image: any, index: number) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/w500${image.filePath}`}
              alt="Backdrop"
              className="img-thumbnail m-2"
              style={{ width: '200px', cursor: 'pointer' }}
              onClick={() => openImageModal(index)} // Open modal on click
            />
          ))}
        </div>
        {movieDetails.images.backdrops.length > 5 && (
          <button
            className="btn btn-link p-0 mt-2"
            onClick={() => setShowAllImages((prev) => !prev)}
          >
            {showAllImages ? 'See Less' : 'See More'}
          </button>
        )}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={closeImageModal}
                ></button>
              </div>
              <div className="modal-body text-center position-relative">
                {/* Left Arrow */}
                {selectedImageIndex > 0 && (
                  <button
                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                    style={{ zIndex: 1050 }}
                    onClick={showPreviousImage}
                  >
                    <i className="bi bi-arrow-left-circle fs-4"></i>
                  </button>
                )}

                {/* Image */}
                <img
                  src={`https://image.tmdb.org/t/p/original${movieDetails.images.backdrops[selectedImageIndex].filePath}`}
                  alt="Selected"
                  className="img-fluid"
                  style={{ maxHeight: '80vh', maxWidth: '100%' }}
                />

                {/* Right Arrow */}
                {selectedImageIndex < movieDetails.images.backdrops.length - 1 && (
                  <button
                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                    style={{ zIndex: 1050 }}
                    onClick={showNextImage}
                  >
                    <i className="bi bi-arrow-right-circle fs-4"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-5">
        {movieId && (
          <AuthProvider> {/* Wrap MovieComments with AuthProvider */}
            {user && <MovieComments movieId={movieId} />}
          </AuthProvider>
        )}
      </div>
      </div>
  );
};

export default MovieDetails;