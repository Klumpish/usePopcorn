import { useState, useEffect } from 'react';
export function useMovies(query, callback) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// will only be called if it exists
		callback?.();

		// abort controller || how to handle fetch
		const controller = new AbortController();

		async function fetchMovies() {
			try {
				setisLoading(true);
				setError('');
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API}&s=${query}`,
					// here we add our controller
					{
						signal: controller.signal,
					}
				);
				if (!res.ok)
					throw new Error('Something went wrong with fetching movies');

				const data = await res.json();
				if (data.Response === 'False') throw new Error('Movie not found');

				setMovies(data.Search);
				setError('');
			} catch (err) {
				// how to deal with abortError coming from controller.abort()
				if (err.name !== 'AbortError') {
					console.log(err.message);
					setError(err.message);
				}
			} finally {
				setisLoading(false);
			}
		}

		if (query.length < 3) {
			setMovies([]);
			setError('');
			return;
		}

		// handleCloseMovie();
		fetchMovies();

		return () => {
			controller.abort();
		};
	}, [query]);

	// here we return what we need back to later destructor it to use it.
	return { movies, isLoading, error };
}
