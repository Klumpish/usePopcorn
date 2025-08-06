import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from "./App"
import StartRating from './components/StarRating';
import TextExpander from './components/TextExpander';
import App from './App';

function Test() {
	// super smart,
	const [movieRating, setMovieRating] = useState(0);
	return (
		<div>
			<StartRating
				color="blue"
				maxRating={10}
				// onSetRating lets us use the rating from the stars outside
				// our component
				onSetRating={setMovieRating}
			/>
			<p>This Movies was ratex {movieRating} stars</p>
		</div>
	);
}
const boxStyle = {
	padding: '10px',
	border: '1px solid #ccc',
	borderRadius: '7px',
	backgroundColor: '#f7f7f7',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
		{/* <StartRating
			maxRating={5}
			messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
		/>
		<StartRating
			size={24}
			color="red"
			className="test"
			defaultRating={3}
		/> */}
		{/* <Test /> */}
		{/*  */}
		{/* <div>
			<TextExpander>
				Space travel is the ultimate adventure! Imagine soaring past the stars
				and exploring new worlds. It's the stuff of dreams and science fiction,
				but believe it or not, space travel is a real thing. Humans and robots
				are constantly venturing out into the cosmos to uncover its secrets and
				push the boundaries of what's possible.
			</TextExpander>

			<TextExpander
				collapsedNumWords={20}
				expandButtonText="Show text"
				collapseButtonText="Collapse text"
				buttonColor="#ff6622">
				Space travel requires some seriously amazing technology and
				collaboration between countries, private companies, and international
				space organizations. And while it's not always easy (or cheap), the
				results are out of this world. Think about the first time humans stepped
				foot on the moon or when rovers were sent to roam around on Mars.
			</TextExpander>

			<TextExpander
				expanded={true}
				style={boxStyle}>
				Space missions have given us incredible insights into our universe and
				have inspired future generations to keep reaching for the stars. Space
				travel is a pretty cool thing to think about. Who knows what we'll
				discover next!
			</TextExpander>
		</div> */}
	</React.StrictMode>
);
