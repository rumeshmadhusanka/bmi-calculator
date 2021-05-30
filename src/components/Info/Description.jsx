import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { lightBlue } from '@material-ui/core/colors';
import BMIImage from '../BMI.jpg'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor : lightBlue,
  },
}));

const Info = () => {
  const classes = useStyles();

  return (
    <div className="col m12 s12">
      <div className="card blue-grey darken-1">
        <div className="card-content">
          <Grid item xs={12} sm={12}>
            <span className="card-title">
              What is BMI?
            </span>  
          </Grid>
          
        <div className="row" style={{marginTop:"20px"}}>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <div style={{margin:'30px'}}>
                        <h4>About Adult BMI</h4>
                        <p>
                        Body mass index (BMI) is a person’s weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity.

                        BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat 1,2,3. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcome as are these more direct measures of body fatness
                        </p>  
                    </div>  
                    <div style={{margin:"30px"}}>
                        <h4>How is BMI used?</h4>
                        <p>
                        BMI can be a screening tool, but it does not diagnose the body fatness or health of an individual. To determine if BMI is a health risk, a healthcare provider performs further assessments. Such assessments include skinfold thickness measurements, evaluations of diet, physical activity, and family history
                        </p>  
                    </div>    
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className="card-image" style={{margin:"30px"}}>
                        <img src={BMIImage} alt="BMI"/>
                    </div>
                </Grid>
            </Grid>   
        </div>
          <div style={{margin:"30px"}}>
            <h4>What are other ways to assess excess body fatness besides BMI?</h4>
            <p>
            Other methods to measure body fatness include skinfold thickness measurements (with calipers), underwater weighing, bioelectrical impedance, dual-energy x-ray absorptiometry (DXA), and isotope dilution 1,2,3. However, these methods are not always readily available, and they are either expensive or need to be conducted by highly trained personnel. Furthermore, many of these methods can be difficult to standardize across observers or machines, complicating comparisons across studies and time periods.
            </p>  
          </div>  
        </div>
      </div>
    </div>
  );
};


export default Info;
