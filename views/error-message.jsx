import React from 'react';
import { Icon } from 'watson-react-components';

export default React.createClass({
  displayName: 'ErrorMessage',

  propTypes: {
    //eslint-disable-next-line
    error: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      error: null,
    };
  },

  render() {
    return (<div className="error">
      <p className="alerttext"> <Icon type="error" /> {this.props.error.message}</p>
    </div>);
  },
});
