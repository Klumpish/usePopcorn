import { useState } from 'react';

export default function TextExpander({
	collapsedNumWords = 10,
	expandButtonText = 'Show more',
	collapseButtonText = 'Show less',
	buttonColor = 'blue',
	expanded = false,
	children,
}) {
	const [numWords, setnumWords] = useState(collapsedNumWords);
	const [showAll, setShowAll] = useState(expanded);

	const buttonStyle = {
		color: `${buttonColor}`,
		border: 'none',
		backgroundColor: 'white',
		cursor: 'Pointer',
		marginLeft: '3px',
		marginBottom: '1rem',
	};
	const pStyle = {};

	const limitWords = (numWords, children) => {
		const text = children;
		const split = text.split(' ');
		if (split.length > numWords) {
			const sliceWords = split.slice(0, numWords).join(' ');
			return sliceWords + '...';
		}
		return text;
	};

	return (
		<div className="box">
			<span style={pStyle}>
				{showAll ? children : limitWords(numWords, children)}
			</span>
			<button
				style={buttonStyle}
				onClick={() => setShowAll(!showAll)}>
				{showAll ? collapseButtonText : expandButtonText}
			</button>
		</div>
	);
}
