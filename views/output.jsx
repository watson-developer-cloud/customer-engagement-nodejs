import React from 'react';
import ConversationItem from './conversation-item.jsx';

const Output = React.createClass({

  displayName: 'output',

  propTypes: {
    conversation: React.PropTypes.array.isRequired,
    onVote: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      //eslint-disable-next-line
      conversation: null,
      onVote(curInput) { console.log('onVote '.concat(curInput)); },
    };
  },

  render() {
    return (
      <div className="conversation">
        <div className="conversation_header">
          <div className="statement_header">Conversation</div>
          <div className="tone_header"> Tone Analysis</div>
        </div>

        {/* Generate a div for each utterance in the conversation object */}
        <div>
          {
            this.props.conversation.map((utterance, i) =>
              <ConversationItem
                key={utterance.statement.text}
                utterance={utterance}
                utterance_id={i}
                onVote={this.props.onVote}
              />,
          )
        }
        </div>
      </div>
    );
  },

});

export default Output;
