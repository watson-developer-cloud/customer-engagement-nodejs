import React from 'react';
import { Alert } from 'watson-react-components';

export default function ErrorMessage(props) {
  return (
    <div className="error">
      <Alert type="error" color="grey">
        <p>{props.error.message}</p>
      </Alert>
    </div>
  );
}

ErrorMessage.propTypes = {
  //eslint-disable-next-line
  error: React.PropTypes.object.isRequired,
};
