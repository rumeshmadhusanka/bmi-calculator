import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'materialize-css/dist/css/materialize.min.css';
import 'react-calendar/dist/Calendar.css';
import '../DatePicker.css';
import './App.css';
import BmiForm from '../BmiForm/BmiForm';
import Info from '../Info/Info';
import Description from '../Info/Description';
import { getData, storeData } from '../../helpers/localStorage';
import { Grid } from '@material-ui/core'

import Chart from '../Chart'

const App = () => {
  const initialState = () => getData('data') || [];
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const myRef = useRef(null)

  const colors = ['', 'lightBlue', 'darkSkyBlue', 'aquamarine', 'electricBlue']
  const sections = [...document.getElementsByTagName('section')]

  window.addEventListener('scroll', function () {

    const scrollFromTop = window.pageYOffset

    for (let i = 0; sections.length > i; i++) {

      if (scrollFromTop <= sections[i].offsetTop) {
        document.body.className = colors[i]
        break
      }
    }
  })

  useEffect(() => {
    storeData('data', state);
    const date = state.map(obj => obj.date);
    const bmi = state.map(obj => obj.bmi);
    let newData = { date, bmi };
    setData(newData);
    console.log(state, state.sort((a, b) => b.date - a.date));
  }, [state]);

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth' })

  const handleChange = val => {
    let heightInM = val.height / 100;
    val.bmi = (val.weight / (heightInM * heightInM)).toFixed(2);
    val.id = uuidv4();
    let newVal = [...state, val];
    let len = newVal.length;
    if (len > 7) newVal = newVal.slice(1, len);
    setState(newVal);
    executeScroll()
  };

  const handleDelete = id => {
    storeData('lastState', state);
    let newState = state.filter(i => {
      return i.id !== id;
    });
    setState(newState);
  };

  const handleUndo = () => {
    setState(getData('lastState'));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>

        <section></section>
        <Grid item xs={12} sm={12}>

          <Grid item xs={12} sm={12}>
            <div style = {{margin : '30px'}}>
              <BmiForm change={handleChange} />
            </div>
          </Grid>

        </Grid>

      </Grid>
      <Grid ref={myRef} item xs={12} sm={12}>
        <div className="center white-text"><h1>{state && state.length > 0 ? `Your last BMI is: ${state.sort((a, b) => b.dateObject - a.dateObject)[0].bmi}`  : ""}</h1></div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Chart labelData={data.date} bmiData={data.bmi} />
      </Grid>
      <section></section>
      <Grid item xs={12} sm={6}>
        <div style={{ margin: '20px' }}>
          <div className='row center'>
            <h4 className='white-text'>BMI History</h4>
          </div>
          <div className='data-container row' style={{maxHeight:'400px', overflowY:'scroll', overflowX:'hidden'}}>
            {state.length > 0 ? (
              <>
                {
                  state.slice(0).reverse().map(info => (
                  <Info
                    key={info.id}
                    id={info.id}
                    weight={info.weight}
                    height={info.height}
                    date={info.date}
                    bmi={info.bmi}
                    deleteCard={handleDelete}
                  />
                ))

                }
              </>
            ) : (
              <div className='center white-text'>No log found</div>
            )}
          </div>
        </div>

        <Grid container direction="row" justify="center" alignItems="center" >
          {getData('lastState') !== null ? (
            <div className='center'>
              <button className='calculate-btn' onClick={handleUndo}>
                Undo
              </button>
            </div>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
      <section></section>
        <div style = {{margin : '20px'}}>
            <Description />
        </div>

      </Grid>
    </Grid>

  );
};

export default App;
