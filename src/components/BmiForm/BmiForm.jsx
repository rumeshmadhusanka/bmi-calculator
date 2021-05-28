import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App/App.css';
// import Dictaphone from '../SpeechRec/SpeechRec';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

const initialValues = {
	weight: '',
	height: '',
	date: ''
}
let speechRecognitionOn = false;

const BmiForm = ({ change, calendarDate }) => {
	const [state, setState] = useState(initialValues);
	const [oldTranscript, setOldTranscript] = useState('');
	const [speechValue, setSpeechValue] = useState("");
	const { speak,cancel,speaking} = useSpeechSynthesis();
	const { transcript, resetTranscript } = useSpeechRecognition();

	useEffect(()=>{
		if (transcript===""|| transcript===oldTranscript){
			return;
		}
		if (transcript.includes("off")|| transcript.includes("shut")|| transcript.includes("kill")){
			SpeechRecognition.abortListening();
			setOldTranscript("")
			speechRecognitionOn = false;
			setSpeechValue("Speech Recognition stopped");
		}
		if (transcript.length>100){
			setOldTranscript("");
			resetTranscript();
		}
		if ((transcript.includes("kilo")|| transcript.includes("kg")) &&
			(transcript.includes("centi")||transcript.includes("cm") )){
			setSpeechValue("Found value");

			//todo enter the values to graph
			resetTranscript();
		}
		setOldTranscript(transcript);
		console.log(transcript);
	},[transcript])

	useEffect(()=>{
		if (speaking){
			cancel()
		}
		speak({ text: speechValue })
	},[speechValue])

	const toggleListen = ()=>{ //continuously listen from mic

		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			let txt ="Browser not supported. Use Google Chrome";
			console.error(txt)
			setSpeechValue(txt);
			return null
		}
		speechRecognitionOn = ! speechRecognitionOn;
		if (speechRecognitionOn){
			setSpeechValue("Speech Recognition started");
			return SpeechRecognition.startListening({ continuous: true,language: 'en-IN' })
		}else{
			speechRecognitionOn = false;
			setSpeechValue("Speech Recognition stopped");
			SpeechRecognition.stopListening();
		}

	}



	const handleChange = e => {
		let { value, name } = e.target;
		if (value > 999) {
			value = 999;
		}
		const date = calendarDate.toLocaleString().split(',')[0];
		setState({
			...state,
			[name]: value,
			date
		});
	};

	const handleSubmit = () => {
		change(state);
		setState(initialValues);
	};

	return (
		<>
			<div className="row">
				<div className="col m6 s12">
					<label htmlFor="weight">Weight (in kg)</label>
					<input
						className={"bmiform"}
						id="weight"
						name="weight"
						type="number"
						min="1"
						max="999"
						placeholder="50"
						value={state.weight}
						onChange={handleChange}
					/>
				</div>

				<div className="col m6 s12">
					<label htmlFor="height">Height (in cm)</label>
					<input
						className={"bmiform"}
						id="height"
						name="height"
						type="number"
						min="1"
						max="999"
						placeholder="176"
						value={state.height}
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className="center">
				<button
					id="bmi-btn"
					className="calculate-btn"
					type="button"
					disabled={state.weight === '' || state.height === ''}
					onClick={handleSubmit}
				>
					Calculate BMI
				</button>

				<div>
					<button onClick={toggleListen}>Toggle Speech Recognition</button>
					{/*//todo apply style, move to right upper corner*/}
					<p>{transcript}</p>
				{/*	Hide the above*/}

				</div>
			</div>
		</>
	);
};

BmiForm.propTypes = {
	change: PropTypes.func.isRequired
};

export default BmiForm;
