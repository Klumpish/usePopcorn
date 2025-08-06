import { useEffect, useRef, useState } from 'react';
import StartRating from './components/StarRating';
// working

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// structural component
export default function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(null);
	// const [watched, setWatched] = useState([]);

	// localstorage getItem
	const [watched, setWatched] = useState(() => {
		const storedValue = localStorage.getItem('watched');
		return JSON.parse(storedValue);
	});

	const tempQuery = 'interstellar';

	// if the id is the same as slectedId we will put it back to null, to close it
	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}
	function handleCloseMovie() {
		setSelectedId(null);
	}
	function handleAddWatched(movie) {
		setWatched([...watched, movie]);
		// // first we pass in the name of the key, then the data
		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	}
	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdb !== id));
	}

	// local storage
	useEffect(() => {
		localStorage.setItem('watched', JSON.stringify(watched));
	}, [watched]);

	useEffect(() => {
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

		handleCloseMovie();
		fetchMovies();

		return () => {
			controller.abort();
		};
	}, [query]);

	return (
		<>
			<NavBar>
				<Search
					query={query}
					setQuery={setQuery}
				/>
				<Numresults movies={movies} />
			</NavBar>
			<Main>
				{/* we do this when we accept components as props in Box we use the name Element for our components
				<Box element={<MovieList movies={movies} />} />
				<Box
					element={
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList watched={watched} />
						</>
					}
				/> */}

				{/* we do this if we accept children in our Box */}
				<Box>
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							onSelectMovie={handleSelectMovie}
							movies={movies}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<SelectedMovie
							selectedId={selectedId}
							onCLoseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onDelete={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function Loader() {
	return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>🛑</span>
			{message}
		</p>
	);
}

// structural component
function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}
// presentational component
function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

// presentational component
function Numresults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

// stateful component
function Search({ query, setQuery }) {
	const inputEl = useRef(null);

	useEffect(() => {
		function callback(e) {
			// if (document.activeElement === inputEl.current) return;

			if (e.code === 'Enter') {
				if (document.activeElement === inputEl.current) {
					return;
				} else {
					inputEl.current.focus();
					setQuery('');
				}
			}
			if (e.code === 'Escape') {
				if (document.activeElement === inputEl.current) {
					inputEl.current.blur();
				}
			}
		}

		document.addEventListener('keydown', callback);

		return () => document.removeEventListener('keydown', callback);
	}, [setQuery]);

	// useEffect(() => {
	// 	const el = document.querySelector('.search');
	// 	el.focus();
	// }, []);

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputEl}
		/>
	);
}
// structural component
function Main({ children }) {
	return <main className="main">{children}</main>;
}

// presentational component
function WatchedMovieList({ watched, onDelete }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDelete={onDelete}
				/>
			))}
		</ul>
	);
}
// presentational component
function WatchedMovie({ movie, onDelete }) {
	return (
		<li>
			<img
				src={movie.poster}
				alt={`${movie.title} poster`}
			/>
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>

				<button
					className="btn-delete"
					onClick={() => onDelete(movie.imdb)}>
					X
				</button>
			</div>
		</li>
	);
}
// #TODO
function SelectedMovie({ selectedId, onCLoseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const isWatched = watched.map((movie) => movie.imdb).includes(selectedId);
	const watchedRating = watched.find(
		(movie) => movie.imdb === selectedId
	)?.userRating;

	// destrukture the data
	// ex in our object we have Title that we name title. lowercase
	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdb: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating,
		};
		onAddWatched(newWatchedMovie);
		onCLoseMovie();
	}

	// listening for keydown on esc
	useEffect(() => {
		function callback(e) {
			if (e.code === 'Escape') {
				onCLoseMovie();
			}
		}

		document.addEventListener('keydown', callback);

		// our clean up must be the same as our add, thats why we make a function

		return () => {
			document.removeEventListener('keydown', callback);
		};
	}, [onCLoseMovie]);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API}&i=${selectedId}`
			);

			const data = await res.json();
			setMovie(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [selectedId]);

	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;

		// clean up function
		return () => {
			document.title = 'usePopcorn';
			// console.log(`clean up effect for movie ${title}`);
		};
	}, [title]);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button
							className="btn-back"
							onClick={onCLoseMovie}>
							&larr;
						</button>
						<img
							src={poster}
							alt={`Poster of ${movie} movie`}
						/>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>{released}</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StartRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>

									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie {watchedRating}/10 <span>⭐</span>{' '}
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

// presentational component
function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}
//  stateful component

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

// stateful component
/* 
function Watchedbox() {
	const [isOpen2, setIsOpen2] = useState(true)

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen2((open) => !open)}>
				{isOpen2 ? "–" : "+"}
			</button>
			{isOpen2 && (
				<>
					<WatchedSummary watched={watched} />
					<WatchedMovieList watched={watched} />
				</>
			)}
		</div>
	)
}
 */
// stateful component
function MovieList({ movies, onSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onSelectMovie={onSelectMovie}
				/>
			))}
		</ul>
	);
}
// presentational component
function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img
				src={movie.Poster}
				alt={`${movie.Title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}
