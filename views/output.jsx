import React from 'react';
import ConversationItem from './conversation-item.jsx';

export default function Output(props) {
  return (
    <div className="conversation">
      <div className="conversation_header">
        <div className="statement_header">Conversation</div>
        <div className="tone_header"> Tone Analysis</div>
      </div>

      {/* Generate a div for each utterance in the conversation object */}
      <div>
        { props.conversation.map(utterance =>
          <ConversationItem key={utterance.statement.text} utterance={utterance} />,
        )
      }
      </div>
    </div>
  );
}

Output.propTypes = {
  //eslint-disable-next-line
  conversation: React.PropTypes.array.isRequired,
};
