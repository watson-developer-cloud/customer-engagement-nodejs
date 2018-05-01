import React from 'react';
import { ButtonsGroup } from 'watson-react-components';

function LanguageSelector(props) {
  let englishSelected = false;

  if (props.currentLanguage === 'en') {
    englishSelected = true;
  }

  return (
    <div className="language-selector">
      <div className="disclaimer--message">
        <h6 className="base--h6" >
            * This system is for demonstration purposes only and is not intended to process
            Personal Data. No Personal Data is to be entered into this system as it may not
            have the necessary controls in place to meet the requirements of the General Data
            Protection Regulation (EU) 2016/679.<br />
        </h6>
      </div>
      <div className="language-selector--header">Select Language: </div>
      <div className="language-selector--options">
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
