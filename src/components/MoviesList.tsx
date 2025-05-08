import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNowPlayingMovies, getTopRatedMovies, searchMovies } from '../api/movieApi';
import Header from './Header';

const NowPlayingMovies = () => {
  interface Movie {
    id: number;
    title: string;
    overview: string;
    fullPosterPath: string;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<'current' | 'topRated' | 'search'>('current');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let data: Movie[];

        if (isSearching) {
          data = await searchMovies(searchQuery, currentPage, selectedGenres);
        } else {
          data = category === 'current'
            ? await getNowPlayingMovies(currentPage)
            : await getTopRatedMovies(currentPage);
        }

        setMovies((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, category, isSearching, searchQuery, selectedGenres]); 

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!loading && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleCategoryChange = (newCategory: 'current' | 'topRated') => {
    setCategory(newCategory);
    setIsSearching(false);
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleSearchResults = (query: string, genres: number[]) => {
    setCategory('search');
    setSearchQuery(query);
    setSelectedGenres(genres); // Update selectedGenres
    setIsSearching(true);
    setMovies([]); // Clear previous movies
    setCurrentPage(1); // Reset currentPage
    setHasMore(true); // Reset hasMore
  };

  return (
    <div className="container mt-4">
      <Header onSearchResults={handleSearchResults} />

      <h2 className="text-center mb-4">
        {isSearching ? 'Search Results' : category === 'current' ? 'Now Playing' : 'Top Rated'} Movies
      </h2>

      {/* Category Switcher */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn btn-primary me-2 ${category === 'current' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('current')}
        >
          Current Movies
        </button>
        <button
          className={`btn btn-primary ${category === 'topRated' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('topRated')}
        >
          Top Rated Movies
        </button>
      </div>

      {/* Movies Grid */}
      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-4 mb-4" key={movie.id}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-100">
                <img src={movie.fullPosterPath} className="card-img-top" alt={movie.title} />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">{movie.overview}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* No More Movies Message */}
      {!hasMore && !loading && (
        <p className="text-center mt-4">No more movies to load.</p>
      )}
    </div>
  );
};

export default NowPlayingMovies;