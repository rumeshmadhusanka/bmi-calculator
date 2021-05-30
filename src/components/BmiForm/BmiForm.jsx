import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App/App.css';
// import Dictaphone from '../SpeechRec/SpeechRec';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Grid } from '@material-ui/core'
import DatePicker from 'react-date-picker';

const initialValues = {
	weight: '',
	height: '',
	date: ''
}
let speechRecognitionOn = false;

const BmiForm = ({ change }) => {
	const [state, setState] = useState(initialValues);
	const [weightError, setWeightError] = useState({ error: false, errorMsg: "" })
	const [heightError, setHeightError] = useState({ error: false, errorMsg: "" })
	const [oldTranscript, setOldTranscript] = useState('');
	const [speechValue, setSpeechValue] = useState("");
	const { speak, cancel, speaking } = useSpeechSynthesis();
	const { transcript, resetTranscript } = useSpeechRecognition();
	const [calendarDate, onChange] = useState(new Date());

	let heightMax = 200
	let weightMax = 500

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

			//todo enter the values to graph
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
			return SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
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
			setTimeout(() => {
				setWeightError({ error: false, errorMsg: "" })
			}, 5000)
		}
		else if (isNaN(parseFloat(value)) && value !== "") {
			setWeightError({ error: true, errorMsg: "Invalid input" })
			setTimeout(() => {
				setWeightError({ error: false, errorMsg: "" })
			}, 5000)
		} else {
			setWeightError({ error: false, errorMsg: "" })
			const date = calendarDate.toLocaleString().split(',')[0];
			setState({
				...state,
				[name]: value,
				date,
				dateObject: new Date(calendarDate)
			});
		}
	};

	const handleChangeHeight = e => {
		let { value, name } = e.target;
		console.log(value)
		if ((value > 999 || value < 1) && value !== "") {
			setHeightError({ error: true, errorMsg: `Enter valid height between 1 and ${heightMax}` })
			setTimeout(() => {
				setHeightError({ error: false, errorMsg: "" })
			}, 5000)
		}
		else if (isNaN(parseFloat(value)) && value !== "") {
			setHeightError({ error: true, errorMsg: "Invalid input" })
			setTimeout(() => {
				setHeightError({ error: false, errorMsg: "" })
			}, 5000)
		} else {
			setHeightError({ error: false, errorMsg: "" })
			const date = calendarDate.toLocaleString().split(',')[0];
			setState({
				...state,
				[name]: value,
				date,
				dateObject: new Date(calendarDate)
			});
		}
	};

	const onChangeDate = date => {
		onChange(date);
		console.log(date, calendarDate);
	  };

	const handleSubmit = () => {
		change(state);
		setState(initialValues);
	};

	return (
		<>
			<div className="container">
			<div className="center">
				<Grid container xs={12} sm={12} spacing={2}>
					<Grid item xs={12} sm={12}>
						<Grid item xs={12} sm={12}>
							<div className='row center'>
								<h1 className='white-text' style={{marginBottom:'2px'}}> BMI Tracker </h1>
							</div>
						</Grid>
						<Grid item xs={12} sm={12}>
							<div>
								<h6 className='white-text'> Body mass index (BMI) Tracker tracks your BMI changes. </h6>
							</div>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={12}>
						<div className='row center' style={{marginBottom:'-50px'}}>
							<button className="calculate-btn" onClick={toggleListen}>Voice Button</button>
							{/*//todo apply style, move to right upper corner*/}
							<p>{transcript}</p>
							{/*	Hide the above*/}

						</div>
					</Grid>
				</Grid>
				
				<Grid container xs={12} sm={12} >
					
					<Grid item xs={12} sm={6}>
						<label htmlFor="weight">Weight (in kg)</label>
						<input
							className={"bmiform"}
							id="weight"
							name="weight"
							placeholder="Weight"
							value={state.weight}
							onChange={handleChangeWeight}
						/>
						<p class="error">{weightError.errorMsg}</p>
					</Grid>
					<Grid item xs={12} sm={6}>
						<label htmlFor="height">Height (in cm)</label>
						<input
							className={"bmiform"}
							id="height"
							name="height"
							placeholder="Height"
							value={state.height}
							onChange={handleChangeHeight}
						/>
						<p class="error">{heightError.errorMsg}</p>
					</Grid>	
						
				</Grid>
				<Grid item xs={12} sm={12}>
					<div className='col m12 s12'>
						<div>
							<label>Date</label>
							<DatePicker
								onChange={onChangeDate}
								value={calendarDate}
								maxDate={new Date()}
							/>
						</div>
					</div>	
				</Grid>
				<Grid item xs={12} sm={12}>	
				<div style={{marginTop: '16px'}}>
					<button
						id="bmi-btn"
						className="calculate-btn"
						type="button"
						disabled={state.weight === '' || state.height === ''}
						onClick={handleSubmit}
					>
						Calculate BMI
					</button>
				</div>
				</Grid>


			</div>
			</div>
		</>
	);
};

BmiForm.propTypes = {
	change: PropTypes.func.isRequired
};

export default BmiForm;
