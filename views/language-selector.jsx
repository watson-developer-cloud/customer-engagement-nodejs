import React from 'react';
import { ButtonsGroup } from 'watson-react-components';

const LanguageSelector = React.createClass({

  displayName: 'LanguageSelector',

  getInitialState() {
    return {
      lang: 'en',
    };
  },

  updateLanguage(e) {
    if (e.target.id.toString() === 'en') {
      this.setState({
        lang: 'en',
      });
    } else {
      this.setState({
        lang: 'fr',
      });
    }
  },

  render() {
    return (
      <div className="language_selection_container">
        <div className="select_language_header">Select Language: </div>

        {/* Generate a div for each utterance in the conversation object */}
        <div className="language_options">
          {
            <ButtonsGroup
              type="radio"
              name="radio-buttons"
              // eslint-disable-next-line no-console
              onClick={e => this.updateLanguage(e)}
              // eslint-disable-next-line no-console
              onChange={e => console.log('Language changed to ', e.target.value)}
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
