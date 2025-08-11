import { useState, useEffect } from 'react';
export function useLocalStorageState(initialState, key) {
	// localstorage getItem
	const [value, setValue] = useState(() => {
		const storedValue = localStorage.getItem(key);
		// here we check if there is a storedvalue, if not we input the initialState, otherwise we get null error
		return storedValue ? JSON.parse(storedValue) : initialState;
	});

	// local storage
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value]);

	return [value, setValue];
}
