import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames'
const shared = {
  padding: 0,
  margin: 0,
  fontSize: 14,
  fontFamily: 'Ubuntu',
  fontWeight: 400,
  backgroundColor: 'transparent'
};

const styles = theme => ({
  input: {
    position: 'absolute',
    outline: 'none',
    border: 'none',
    ...shared
  },
  shadow: {
    position: 'absolute',
    ...shared,
    color: 'grey'
  }
});

class ShadowInput extends React.Component {

  state = {
    userInput: ''
  };

  getMatch = () => {
    const {options = []} = this.props;
    const {userInput} = this.state;
    const match = userInput ? (options.filter(i => i.label.toLowerCase().startsWith(userInput.toLowerCase().trim()))[0]) : null;

    return match
  };

  onChange = (match) => {
    if (this.props.onChange) {
      this.props.onChange(match)
    }
  }

  render() {
    const {classes, className, options = [], onChange, style, onDelete, onEmptyNext, inputClass} = this.props;
    const {userInput} = this.state;

    const match = this.getMatch()
    const label = (match) ? match.label : null;

    const displayInput = label ? label.substr(0, userInput.length) : userInput;

    return <div className={className} style={style}>
      <div className={classes.shadow}>{label}</div>
      <input className={classNames(classes.input, inputClass)}
             value={displayInput}
             autoFocus
             fullWidth
             onKeyDown={(e) => {
               if (e.keyCode === 8 && e.target.value === '') {
                 if (onDelete) {
                   onDelete()
                 }
               }

               const rightArrowAtEnd = (e.target.selectionStart === e.target.value.length && e.which === 39)

               if (e.which === 9 || e.which === 13 || rightArrowAtEnd) {
                 if (match) {
                   this.setState({userInput: label})
                   this.onChange(match)
                 } else {
                   if (onEmptyNext) {
                     onEmptyNext()
                   }
                 }
               }
             }}
             onChange={(e) => this.setState({userInput: e.target.value})}/>
    </div>;
  }
}

export default withStyles(styles)(ShadowInput);