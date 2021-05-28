import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { lightBlue } from '@material-ui/core/colors';

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

const Info = ({ weight, height, id, date, bmi, deleteCard }) => {
  const classes = useStyles();
  const handleDelete = () => {
    deleteCard(id);
  };

  return (
    <div className="col m6 s12">
      <div className="card">
        <div className="card-content">
          <Grid item xs={12}>
            <span className="card-title" data-test="bmi">
              <Paper className={classes.paper}>BMI: {bmi}</Paper>  
            </span>  
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <span data-test="weight">Weight: {weight} kg</span>  
            </Grid>
            <Grid item xs>
              <span data-test="height">Height: {height} cm</span>
            </Grid>  
            <Grid item xs>
              <span data-test="date">Date: {date}</span>
            </Grid>  
          </Grid>
          <button className="delete-btn" onClick={handleDelete}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

Info.propTypes = {
  weight: PropTypes.string,
  height: PropTypes.string,
  id: PropTypes.string,
  date: PropTypes.string,
  bmi: PropTypes.string,
  deleteCard: PropTypes.func
};

export default Info;
