import React from 'react';

const CheckboxesGroup = React.createClass({
  displayName: 'CheckboxesGroup',

  propTypes: {
    checkboxGroupId: React.PropTypes.string,
    checkboxValues: React.PropTypes.arrayOf(React.PropTypes.string),
    onCheckboxSelection: React.PropTypes.func.isRequired,
    isResetting: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      checkboxValues: [],
      checkboxGroupId: '0',
      isResetting: false,
      onCheckboxSelection(curInput) { console.log('onCheckboxSelection '.concat(curInput)); },
    };
  },

  render() {
    return (
      this.props.isResetting ?
        null :
      (<div className="checkbox_container">
        {
        this.props.checkboxValues.map(v => (
          <div
            className="checkbox"
            key={`cb-${v}-${this.props.checkboxGroupId}`}
          >
            <input
              // className="base--checkbox"
              className="checkbox_input"
              type="checkbox"
              id={`cb-${v}-${this.props.checkboxGroupId}`}
              name={`${v}`}
              value={`${v}`}
              onChange={e => this.props.onCheckboxSelection(e)}
            />
            <label
              // className="base--inline-label"
              className="checkbox_label"
              htmlFor={`cb-${v}-${this.props.checkboxGroupId}`}
            >{v}
            </label>
          </div>
        ))
      }
      </div>)
    );
  },
});

export default CheckboxesGroup;
