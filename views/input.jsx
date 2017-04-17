import React from 'react';
//eslint-disable-next-line
import ErrorMessage from './error-message.jsx'

// string constants for text on input component
const INPUT_PLACEHOLDER = 'Reply to ';
const INPUT_AVATAR = 'input_avatar ';

const Input = React.createClass({
  displayName: 'Input',

  propTypes: {
    newUtterancePlaceholder: React.PropTypes.string.isRequired, // user.handle of last conversation turn (new utterance will be in reply to that user)
    newUtteranceAvatarType: React.PropTypes.string.isRequired, // avatar for user whose conversation turn is next
    onSubmit: React.PropTypes.func.isRequired,
    //eslint-disable-next-line
    error: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      //eslint-disable-next-line
      onSubmit(curInput) { console.log('onSubmit ' + curInput); },
      newUtterancePlaceholder: '',
      newUtteranceAvatarType: '',
      error: null,
    };
  },

  getInitialState() {
    return {
      newUtterance: '',
    };
  },

  /**
   * During changes to the newUtterance input
   */
  handleInputChange(e) {
    this.setState({ newUtterance: e.target.value });
  },

  /**
   * On Input text key press
   */
  handleKeyPress(e) {
    if (e.key === 'Enter' && this.state.newUtterance) {
      this.props.onSubmit.call(this, this.state.newUtterance);
      this.setState({
        newUtterance: '',
      });
    }
  },

  handleButtonClick() {
    this.props.onSubmit.call(this, this.state.newUtterance);
    this.setState({
      newUtterance: '',
    });
  },

  render() {
    return (
      <div id="contribute" className="contribute_container">
        <div className="input_wrapper">
          <div className={INPUT_AVATAR.concat(this.props.newUtteranceAvatarType)} />
          <div className="input_area">
            <input
              type="text"
              maxLength="170"
              value={this.state.newUtterance}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
              id="newUtteranceTextArea"
              placeholder={INPUT_PLACEHOLDER.concat(this.props.newUtterancePlaceholder)}
              required="true"
            />
          </div>
          <div>
            <div className="submit_button">
              <button
                className="base--button_fill"
                onClick={this.handleButtonClick}
                disabled={!this.state.newUtterance}
              >Reply
              </button>
            </div>
            <div className="error_message">
              {this.props.error ? <ErrorMessage error={this.props.error} /> : <span />}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Input;
