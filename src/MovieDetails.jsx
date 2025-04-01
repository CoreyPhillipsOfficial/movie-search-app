function MovieDetails({ movie }) {
    return (
        <div className="movie-details">
            {/* <h2>{movie.Title}</h2> */}
            {/* <img src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'} alt={movie.Title} /> */}
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
        </div>
    );
}

export default MovieDetails;