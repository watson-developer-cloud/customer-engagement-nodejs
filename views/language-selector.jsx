import React from 'react';
import { ButtonsGroup } from 'watson-react-components';

function LanguageSelector(props) {
  let englishSelected = false;

  if (props.currentLanguage === 'en') {
    englishSelected = true;
  }
  // boo
  return (
    <div className="language_selection_container">
      <div className="select_language_header">Select Language: </div>
      <div className="language_options">
        {
          <ButtonsGroup
            type="radio"
            name="radio-buttons"
            onClick={(e) => {
              props.onLanguageSelection(e.target.id);
            }}
            buttons={[{
              value: 1,
              id: 'en',
              text: 'English',
              selected: englishSelected,
            }, {
              value: 2,
              id: 'fr',
              text: 'French',
              selected: !englishSelected,
            }]}
          />
      }
      </div>
    </div>
  );
}

LanguageSelector.propTypes = {
  onLanguageSelection: React.PropTypes.func.isRequired,
  currentLanguage: React.PropTypes.string.isRequired,
};

export default LanguageSelector;
