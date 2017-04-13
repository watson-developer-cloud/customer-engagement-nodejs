import React from 'react';

export default function ResetConversationLink(props) {
  ResetConversationLink.propTypes = {
    resetConversation: React.PropTypes.func,
  };
  return (
    <div
      className="reset"

    >
      <button
        onClick={(e) => {
          props.resetConversation.call(this, e);
        }}
      >Reset Conversation</button>
    </div>
  );
}
