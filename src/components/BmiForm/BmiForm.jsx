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

const BmiForm = ({ change }) => {
	const [state, setState] = useState(initialValues);
	const [speechValue, setSpeechValue] = useState('');
	const { speak,cancel,speaking} = useSpeechSynthesis();
	const { transcript, resetTranscript } = useSpeechRecognition();
	const contListen = ()=>{ //continuously listen from mic

		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			console.error("Browser not supported. Use Chrome")
			return null
		}
		speechRecognitionOn = ! speechRecognitionOn;
		if (speechRecognitionOn){
			setSpeechValue("Speech Recognition started");
			return SpeechRecognition.startListening({ continuous: true,language: 'en-IN' })
		}else{
			setSpeechValue("Speech Recognition stopped");
			SpeechRecognition.stopListening();
		}

	}


	const HiddenPara = ({text})=>{
		useEffect(()=>{
			if (text===""|| text===speechValue){
				return;
			}

			if (text.includes("off")|| text.includes("shut")|| text.includes("kill")||text.includes("reset")||text.includes("stop")){
				SpeechRecognition.abortListening();
				setSpeechValue("Speech Recognition stopped")
			}
			setSpeechValue(text.toString());
			console.log(speechValue);
		},[speechValue])

		return (<p>transcript: </p>)
	}

	const SpeakPara = ({textToSpeak})=>{
		useEffect(()=>{
			if (speaking){
				cancel()
			}
			speak({ text: textToSpeak })
		})
		return (
			<p>{textToSpeak}</p>
		)
	}

	const handleChange = e => {
		let { value, name } = e.target;
		if (value > 999) {
			value = 999;
		}
		const date = new Date().toLocaleString().split(',')[0];
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
					<button onClick={contListen}>Toggle Speech Recognition</button>
					{/*//todo apply style, move to right upper corner*/}
					<button onClick={resetTranscript}>Reset</button>
					{/*//todo this should be hidden*/}
					<HiddenPara text={transcript}/>
					{/*//todo this should be hidden*/}
					<SpeakPara textToSpeak={"Hello"}/>


				</div>
			</div>
		</>
	);
};

BmiForm.propTypes = {
	change: PropTypes.func.isRequired
};

export default BmiForm;
