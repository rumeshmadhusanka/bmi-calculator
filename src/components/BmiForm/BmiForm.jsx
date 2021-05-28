import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../App/App.css';

const initialValues = {
	weight: '',
	height: '',
	date: ''
}

const BmiForm = ({ change }) => {
	const [state, setState] = useState(initialValues);
	const [weightError, setWeightError] = useState({error:false, errorMsg:""})
	const [heightError, setHeightError] = useState({error:false, errorMsg:""})

	const handleChangeWeight = e => {
		let { value, name } = e.target;
		console.log(value)
		if (value > 999 || value < 1 && value !== "") {
			setWeightError({error:true, errorMsg: "Enter valid weight between 1 and 500"})
		}
		else if(isNaN(parseFloat(value)) && value !== ""){
			setWeightError({error:true, errorMsg: "Only enter numbers"})
		}else{
			setWeightError({error:false, errorMsg: ""})
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
		if (value > 999 || value < 1 && value !== "") {
			setHeightError({error:true, errorMsg: "Enter valid height between 1 and 200"})
		}
		else if(isNaN(parseFloat(value)) && value !== ""){
			setHeightError({error:true, errorMsg: "Only enter numbers"})
		}else{
			setHeightError({error:false, errorMsg: ""})
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
						// type="number"
						// min="1"
						// max="999"
						placeholder="50"
						value={state.weight}
						onChange={handleChangeWeight}
					/>
					<p>{weightError.errorMsg}</p>
				</div>

				<div className="col m6 s12">
					<label htmlFor="height">Height (in cm)</label>
					<input
						id="height"
						name="height"
						// type="number"
						// min="1"
						// max="999"
						placeholder="176"
						value={state.height}
						onChange={handleChangeHeight}
					/>
					<p>{heightError.errorMsg}</p>
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
			</div>
		</>
	);
};

BmiForm.propTypes = {
	change: PropTypes.func.isRequired
};

export default BmiForm;
