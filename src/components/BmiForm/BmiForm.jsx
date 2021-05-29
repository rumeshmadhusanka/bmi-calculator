import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App/App.css';
// import Dictaphone from '../SpeechRec/SpeechRec';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import spiritedaway from "@amcharts/amcharts4/.internal/themes/spiritedaway";

const initialValues = {
	weight: '',
	height: '',
	date: ''
}
let speechRecognitionOn = false;
let unitSystem = "metric" //OR 'imperial'
const BmiForm = ({ change, calendarDate }) => {
	const [state, setState] = useState(initialValues);
	const [weightError, setWeightError] = useState({ error: false, errorMsg: "" })
	const [heightError, setHeightError] = useState({ error: false, errorMsg: "" })
	const [oldTranscript, setOldTranscript] = useState('');
	const [speechValue, setSpeechValue] = useState("");
	const { speak, cancel, speaking } = useSpeechSynthesis();
	const { transcript, resetTranscript } = useSpeechRecognition();

	let heightMax = 200
	let weightMax = 500

	useEffect( ()=>{

		fetch("https://ipinfo.io/?token=575df63ec9a20d",{mode:"cors",headers: {
				'Content-Type': 'application/json'
			}}).then(res=>res.json()).then(data=> {
			if (data.country==="US"){
				//imperial system
				//change unit to imperial
				unitSystem ="imperial";
				console.log("Using imperial unit system");
			}else{
				unitSystem ="metric";
				console.log("Using metric unit system");
			}
		})
	},[])

	useEffect(() => {
		if (transcript === "" || transcript === oldTranscript) {
			return;
		}
		if (transcript.includes("off") || transcript.includes("shut") || transcript.includes("kill")) {
			SpeechRecognition.abortListening();
			setOldTranscript("")
			speechRecognitionOn = false;
			setSpeechValue("Speech Recognition stopped");
		}
		if (transcript.length > 100) {
			setOldTranscript("");
			resetTranscript();
		}
		if ((transcript.includes("kilo") || transcript.includes("kg")) &&
			(transcript.includes("centi") || transcript.includes("cm"))) {
			setSpeechValue("Found value");

			//todo read out the entered value
			//todo
			resetTranscript();
		}
		setOldTranscript(transcript);
		console.log(transcript);
	}, [transcript])

	useEffect(() => {
		if (speaking) {
			cancel()
		}
		speak({ text: speechValue })
	}, [speechValue])

	const toggleListen = () => { //continuously listen from mic

		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			let txt = "Browser not supported. Use Google Chrome";
			console.error(txt)
			setSpeechValue(txt);
			return null
		}
		speechRecognitionOn = !speechRecognitionOn;
		if (speechRecognitionOn) {
			setSpeechValue("Speech Recognition started");
			return SpeechRecognition.startListening({ continuous: true })
		} else {
			speechRecognitionOn = false;
			setSpeechValue("Speech Recognition stopped");
			SpeechRecognition.stopListening();
		}

	}



	const handleChangeWeight = e => {
		let { value, name } = e.target;
		console.log(value)
		if ((value > 999 || value < 1) && value !== "") {
			setWeightError({ error: true, errorMsg: `Enter valid weight between 1 and ${weightMax}` })
		}
		else if (isNaN(parseFloat(value)) && value !== "") {
			setWeightError({ error: true, errorMsg: "Only enter numbers" })
		} else {
			setWeightError({ error: false, errorMsg: "" })
		}
		const date = new Date().toLocaleString().split(',')[0];
		setState({
			...state,
			[name]: value,
			date
		});
	};

	const handleChangeHeight = e => {
		let { value, name } = e.target;
		console.log(value)
		if ((value > 999 || value < 1) && value !== "") {
			setHeightError({ error: true, errorMsg: `Enter valid height between 1 and ${heightMax}` })
		}
		else if (isNaN(parseFloat(value)) && value !== "") {
			setHeightError({ error: true, errorMsg: "Only enter numbers" })
		} else {
			setHeightError({ error: false, errorMsg: "" })
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

			<div className="center">
				<div className="row">
					<div className="col m12 s12">
						<label htmlFor="weight">Weight (in kg)</label>
						<input
							className={"bmiform"}
							id="weight"
							name="weight"
							placeholder="50"
							value={state.weight}
							onChange={handleChangeWeight}
						/>
						<p className="error">{weightError.errorMsg}</p>
						<label htmlFor="height">Height (in cm)</label>
						<input
							className={"bmiform"}
							id="height"
							name="height"
							placeholder="176"
							value={state.height}
							onChange={handleChangeHeight}
						/>
						<p className="error">{heightError.errorMsg}</p>
					</div>
				</div>
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
					<button className="calculate-btn" onClick={toggleListen}>Toggle Speech Recognition</button>
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
