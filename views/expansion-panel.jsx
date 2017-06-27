import React from 'react';
import classNames from 'classnames';

const ExpansionPanel = React.createClass({
  displayName: 'ExpansionPanel',

  propTypes: {
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element),
    ]),
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      className: '',
      children: '',
      isOpen: false,
    };
  },

  render() {
    return (
      <div
        className={classNames(
          `${this.props.className}`,
          { [`${this.props.className}_show`]: this.props.isOpen },
        )}
      >
        {this.props.children}
      </div>
    );
  },
});

export default ExpansionPanel;
