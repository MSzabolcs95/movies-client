import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllGenres } from '../api/movieApi';

interface HeaderProps {
  onSearchResults: (query: string, genreIds: number[]) => void; 
}

const Header: React.FC<HeaderProps> = ({ onSearchResults }) => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (genreId: number) => {
    if (!selectedGenreIds.includes(genreId)) {
      setSelectedGenreIds((prev) => [...prev, genreId]);
    }
    setShowDropdown(false); 
  };

  const handleRemoveGenre = (genreId: number) => {
    setSelectedGenreIds((prev) => prev.filter((id) => id !== genreId));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchResults(searchQuery, selectedGenreIds); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header-container p-3 bg-light">
      <form onSubmit={handleSearch} className="row g-3 align-items-center">
        {/* Search Bar */}
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Genre Dropdown */}
        <div className="col-md-6 position-relative" ref={dropdownRef}>
          <div
            className="form-control d-flex align-items-center flex-wrap"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowDropdown((prev) => !prev)} 
          >
            {selectedGenreIds.map((genreId) => {
              const genre = genres.find((g) => g.id === genreId);
              return (
                <span key={genreId} className="badge bg-primary me-2 mb-1">
                  {genre?.name}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    aria-label="Remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGenre(genreId);
                    }}
                  ></button>
                </span>
              );
            })}
            {selectedGenreIds.length === 0 && <span className="text-muted">Select genres</span>}
          </div>
          {showDropdown && (
            <ul
              className="dropdown-menu show w-100"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1050,
              }}
            >
              {genres.map((genre) => (
                <li
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className="dropdown-item"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Header;