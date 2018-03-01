import React from 'react';
import { ButtonsGroup } from 'watson-react-components';

const LanguageSelector = React.createClass({

  displayName: 'LanguageSelector',

  propTypes: {
    onLanguageSelection: React.PropTypes.func.isRequired,
  },

  render() {
    return (
      <div className="language_selection_container">
        <div className="select_language_header">Select Language: </div>
        <div className="language_options">
          {
            <ButtonsGroup
              type="radio"
              name="radio-buttons"
              onClick={e => this.props.onLanguageSelection(e.target.id)}
              buttons={[{
                value: 1,
                id: 'en',
                text: 'English',
              }, {
                value: 2,
                id: 'fr',
                text: 'French',
              }]}
            />
        }
        </div>
      </div>
    );
  },

});

export default LanguageSelector;
