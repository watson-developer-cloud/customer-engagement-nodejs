import React from 'react';
import { ButtonsGroup, Icon, Colors } from 'watson-react-components';
import CheckboxesGroup from './checkboxes-group.jsx';
import ExpansionPanel from './expansion-panel.jsx';

const CUSTOMER_TONES = ['sad', 'frustrated', 'satisfied', 'excited', 'polite', 'impolite', 'sympathetic'];

const ConversationItem = React.createClass({
  displayName: 'ConversationItem',

  propTypes: {
    //eslint-disable-next-line
    utterance: React.PropTypes.object.isRequired,
    utterance_id: React.PropTypes.number.isRequired,
    onVote: React.PropTypes.func.isRequired,
    onRecordOtherTone: React.PropTypes.func.isRequired,
    isResetting: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      utterance: '',
      utterance_id: '',
      onVote(curInput) { console.log('onVote '.concat(curInput)); },
      onRecordOtherTone(curInput) { console.log('onRecordOtherTone '.concat(curInput)); },
      isResetting: false,
    };
  },

  getInitialState() {
    return {
      showPanel: false,
      className: 'checkbox_group_container',
      utteranceVotes: {},
    };
  },

  getMissingTones(tones) {
    const utteranceTones = tones.map(t => t.tone);
    const missingTones = CUSTOMER_TONES.filter(x => utteranceTones.indexOf(x) < 0);
    missingTones.push('neutral');
    return (missingTones);
  },

  isFirstToneNegative(tones) {
    const firstTone = tones[0];
    this.getMissingTones(tones);
    return (
      tones.length !== 0 &&
      (firstTone.tone === 'sad' ||
      firstTone.tone === 'frustrated' ||
      firstTone.tone === 'anxious' ||
      firstTone.tone === 'impolite')
    );
  },

  calculateUtteranceCummulativeVote() {
    const voteSum = Object.values(this.state.utteranceVotes).reduce((a, b) => parseInt(a, 10) + parseInt(b, 10));
    const numberOfVotes = Object.keys(this.state.utteranceVotes).length;
    return (voteSum < numberOfVotes);
  },

  castVote(e, tone) {
    const source = this.props.utterance.source;
    const updatedUtteranceVotes = this.state.utteranceVotes;
    updatedUtteranceVotes[tone] = e.target.value;

    this.setState({ utteranceVotes: updatedUtteranceVotes });
    this.setState({
      showPanel: this.calculateUtteranceCummulativeVote(),
    });

    const voteData = {
      statement: this.props.utterance.statement.text,
      user_feedback: {
        tone,
        vote: e.target.value,
      },
      tone_analyzer_payload: this.props.utterance.tone_analyzer_payload,
    };
    this.props.onVote.call(this, voteData, source);
  },

  recordOtherTone(e) {
    const otherToneData = {
      statement: this.props.utterance.statement.text,
      user_feedback: {
        otherTone: e.target.value,
        vote: e.target.checked,
      },
      tone_analyzer_payload: this.props.utterance.tone_analyzer_payload,
    };
    this.props.onRecordOtherTone.call(this, otherToneData);
  },

  render() {
    const user = this.props.utterance.user;
    const statement = this.props.utterance.statement;
    const tones = this.props.utterance.tones;

    return (
      <div>
        <div className={user.type === 'customer' ? 'speaker consumer' : 'speaker'}>
          <div className="avatar">
            <div className={user.type === 'customer' ? 'customer_avatar' : 'agent_avatar'} />
          </div>
          <div className="statement_container">
            <span className="speaker_name">{user.name}</span>
            <span className="speaker_handle">{user.handle}</span>
            <span className="time_stamp"> {statement.timestamp}</span>
            <div
              className={this.isFirstToneNegative(tones) ? 'speaker_statement negative' : 'speaker_statement'}
            >
              { statement.text }
            </div>
          </div>
          <div className="score_container">
            <div className="agree_container"><span className="agree_link">Do you agree?</span></div>
            { tones.length === 0 ?
              <div className="tone_results" key={'none'}>
                <div className="tone_text">{ 'none' }</div>
                { this.props.isResetting ?
                  null :
                  <ButtonsGroup
                    type="radio"
                    name={'utterance'.concat('-', this.props.utterance_id)}
                    onClick={e => this.castVote(e, 'none')}
                    buttons={[{
                      value: 1,
                      id: 'utterance'.concat('-', this.props.utterance_id, '-none-true'),
                      text: <Icon className={'thumb'} type={'thumbs-up'} fill={Colors.gray_30} />,
                    }, {
                      value: 0,
                      id: 'utterance'.concat('-', this.props.utterance_id, '-none-false'),
                      text: <Icon className={'thumb'} type={'thumbs-down'} fill={Colors.gray_30} />,
                    }]}
                  />
                }
              </div>
              :
              tones.map((t, i) => (
                <div className="tone_results" key={`${t.tone}-${t.score}`}>
                  <div
                    className={this.isFirstToneNegative(tones) ? 'tone_text negative' : 'tone_text'}
                  >{t.tone}
                  </div>
                  { this.props.isResetting ?
                    null :
                    <ButtonsGroup
                      type="radio"
                      name={'utterance'.concat('-', this.props.utterance_id, '-', i)}
                      onClick={e => this.castVote(e, t.tone)}
                      buttons={[{
                        value: 1,
                        id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-true'),
                        text: <Icon className={'thumb'} type={'thumbs-up'} fill={Colors.gray_30} />,
                      }, {
                        value: 0,
                        id: 'utterance'.concat('-', this.props.utterance_id, '-', i, '-', t.tone, '-false'),
                        text: <Icon className={'thumb'} type={'thumbs-down'} fill={Colors.gray_30} />,
                      }]}
                    />
                  }
                </div>
              ))}
          </div>
        </div>
        <ExpansionPanel
          isOpen={this.state.showPanel}
          className={this.state.className}
        >
          <span className="description"> What other tones do you think are in this statement?</span>
          <CheckboxesGroup
            checkboxGroupId={this.props.utterance_id.toString()}
            checkboxValues={this.getMissingTones(tones)}
            onCheckboxSelection={this.recordOtherTone}
          />
        </ExpansionPanel>
      </div>
    );
  },
});

export default ConversationItem;
