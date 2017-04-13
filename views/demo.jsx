import React from 'react';
import { JsonLinkInline } from 'watson-react-components';
//eslint-disable-next-line
import Output from './output.jsx';
//eslint-disable-next-line
import Input from './input.jsx';
//eslint-disable-next-line
import ResetConversationLink from './reset-conversation-link.jsx';

// load initial conversation state, a json object
// hack to get around deep clone of initial conversation for reseting conversation
const initialConversationString = JSON.stringify(require('../public/data/initial-conversation'));
const initialConversation = require('../public/data/initial-conversation');
const MAX_TONES_TO_DISPLAY = 4;

const Demo = React.createClass({
  displayName: 'Conversation',

  /**
  * Method to initialize the state of the Conversation react component (ES5 compatible)
  * The initial state for the conversation is stored in a json file
  */
  getInitialState() {
    const initialLastUtterance = initialConversation.utterances[initialConversation.utterances.length - 1];
    return {
      conversation: JSON.parse(initialConversationString),
      error: null,
      newUtterancePlaceholder: JSON.parse(initialConversationString).agent.handle,
      newUtteranceAvatarType: initialLastUtterance.user.type === 'agent' ? 'customer_avatar' : 'agent_avatar', // 'customer_avatar'
      showJson: false,
    };
  },

  onShowJson() {
    this.setState({
      showJson: !this.state.showJson,
    });
  },

  onExitJson() {
    this.setState({
      showJson: false,
    });
  },

  onSubmit(utterance) {
    fetch('/api/tone_chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        utterances: [
          { text: utterance, user: 'customer' },
        ],
      }),
    }).then(this.handleErrors).then((response) => {
      response.json().then((tone) => {
        this.updateConversation(tone);
      });
    }).catch((error) => {
      this.setState({
        error,
        //loading: false,
      });
    });
  },

  handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  },

  updateConversation(tone) {
    const tonesRaw = tone.utterances_tone[0].tones;

    // sort tones in descending order
    tonesRaw.sort((tone1, tone2) =>
      parseFloat(tone2.score) - parseFloat(tone1.score),
    );

    // map each tone to the required json object
    const tones = tonesRaw.map(t => ({ tone: t.tone_name, score: t.score }));
    const tonesShortlist = tones.slice(0, MAX_TONES_TO_DISPLAY);

    // create new conversation turn json object to add to the conversation state
    const lastConversationTurn = this.state.conversation.utterances[this.state.conversation.utterances.length - 1];
    const newConversationTurn = {
      user: {
        type: lastConversationTurn.user.type === 'agent' ? 'customer' : 'agent',
        name: lastConversationTurn.user.type === 'agent' ? this.state.conversation.customer.name : this.state.conversation.agent.name,
        handle: lastConversationTurn.user.type === 'agent' ? this.state.conversation.customer.handle : this.state.conversation.agent.handle,
      },
      statement: {
        text: tone.utterances_tone[0].utterance_text,
        timestamp: 'now',
      },
      tones: tonesShortlist,
    };

    // push new conversation turn to the conversation state and setState
    const conversation = this.state.conversation;
    const newUtteranceAvatarType = newConversationTurn.user.type === 'agent' ? 'customer_avatar' : 'agent_avatar';
    const newUtterancePlaceholder = newConversationTurn.user.type === 'agent' ? this.state.conversation.agent.handle : this.state.conversation.customer.handle;
    conversation.utterances.push(newConversationTurn);
    this.setState({
      conversaton: conversation,
      newUtterancePlaceholder,
      newUtteranceAvatarType,
    });
  },

  resetConversation() {
    this.setState({
      conversation: JSON.parse(initialConversationString),
      error: null,
      newUtterancePlaceholder: JSON.parse(initialConversationString).agent.handle,
      newUtteranceAvatarType: 'customer_avatar',
    });
  },

  render() {
    return (
      <div>
        <Output conversation={this.state.conversation.utterances} />
        <Input
          error={this.state.error}
          onSubmit={this.onSubmit}
          newUtterancePlaceholder={this.state.newUtterancePlaceholder}
          newUtteranceAvatarType={this.state.newUtteranceAvatarType}
        />

        <div className="conversation_footer">
          <JsonLinkInline
            json={this.state.conversation}
            showJson={this.state.showJson}
            onExit={this.onExitJson}
            onShow={this.onShowJson}
            description={<p>
              <ResetConversationLink
                resetConversation={this.resetConversation}
              /></p>}
          />
        </div>
      </div>
    );
  },

});

export default Demo;
