import { useState } from 'react';
import './App.css';
import MovieDetails from './MovieDetails.jsx';

function App() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovieDetails, setSelectedMovieDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setMovies([]);
        setSelectedMovieId(null);
        setSelectedMovieDetails({});

        try {
            const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
            const data = await res.json();

            if (data.Response === 'True') {
                setMovies(data.Search);
            } else {
                setError(data.Error);
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = async (id) => {
        // If already selected, collapse the details
        if (selectedMovieId === id) {
            setSelectedMovieId(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Only fetch details if not already loaded
            if (!selectedMovieDetails[id]) {
                const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
                const data = await res.json();
                setSelectedMovieDetails(prev => ({ ...prev, [id]: data }));
            }
            setSelectedMovieId(id);
        } catch (err) {
            setError('Error fetching movie details');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission to trigger the search
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page refresh)
        handleSearch();
    };

    return (
        <div className="App">
            <h1>Movie Search 🎬</h1>
            {/* Wrap input and button in a form with onSubmit */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div className="results">
                {movies.map((movie) => (
                    <div
                        key={movie.imdbID}
                        className={`movie-card ${selectedMovieId === movie.imdbID ? 'expanded' : ''}`}
                        onClick={() => handleMovieClick(movie.imdbID)}
                    >
                        <img src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'} alt={movie.Title} />
                        <h3>{movie.Title}</h3>
                        <p>{movie.Year}</p>
                        {selectedMovieId === movie.imdbID && selectedMovieDetails[movie.imdbID] && (
                            <MovieDetails movie={selectedMovieDetails[movie.imdbID]} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
