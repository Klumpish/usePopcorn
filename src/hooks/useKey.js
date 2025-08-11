import { useEffect } from 'react';
export function useKey(key, action) {
	// listening for keydown on esc
	useEffect(() => {
		function callback(e) {
			if (e.code.toLowerCase() === key.toLowerCase()) {
				action();
			}
		}

		document.addEventListener('keydown', callback);
		// our clean up must be the same as our add, thats why we make a function
		return () => {
			document.removeEventListener('keydown', callback);
		};
	}, [action, key]);
}
