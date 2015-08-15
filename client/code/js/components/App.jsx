/**
 * the main nmusic-app JSX component
 */

import { } from '../config';

import { Record, fromJS, List } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

// import reducers
import mainReducer from '../reducers/MainReducer';
import browserReducer from '../reducers/BrowserReducer';

import apiCallEffectHandler from '../effects-handlers/ApiCallEffectHandler';

import LoadingSpinner from './LoadingSpinner';
import BrowserArtists from './BrowserArtists';

const Reduction = new Record({
  appState: fromJS({
    loaded: {
      browserArtists: false,
    },
    loadedOnLastRender: false,
    browser: {
      selectedArtist: -1,
      listArtists: List.of(),
    },
  }),
  effects: List.of(),
});

export default class App extends Component {
  constructor(props) {
    super(props);

    const dispatcher = new Dispatcher();

    // This is actually top level store, composing reducers and applying effect handlers
    dispatcher.register(action => {
      let reduction = this.state.reduction;

      // let's store all actions so that we can replay them
      const actionLog = this.state.actionLog.push(action);

      // we want to purge list of effects before every action
      reduction = reduction.set('effects', List.of());

      // all reducers are being executed here
      reduction = mainReducer(reduction, action);
      reduction = browserReducer(reduction, action);

      // all effect handlers are being handled here
      reduction.get('effects').forEach(apiCallEffectHandler.bind(null, dispatcher));

      // let's set the reduction back to the Component's state,
      // this will result in re-render of those pure views, whose
      // props have changed.
      this.setState({reduction, actionLog});
    });

    // we will keep dispatcher, reduction and action log in the root component's state,
    // the portion of the state is being passed down the component hierarchy to corresponding
    // components
    this.state = {
      dispatcher: dispatcher,
      reduction: new Reduction(),
      actionLog: List.of(), // This is only for debugging, we can perform replay of actions
    };

    // If there is hot-reloading available
    // We want to perform a replay after the code has been refreshed
    if (module.hot) {
      module.hot.addStatusHandler(() => setTimeout(() => window.replay()));
    }
  }

  componentDidUpdate() {
    // The method is here only for hot-reloading
    window.replay = () => {
      // We will take the action log, reduce it in reducers and pass an them initial empty reduction
      // strip down the effects so that we are not replaying them.
      const reduction = this.state
        .actionLog
        .reduce(mainReducer, new Reduction())
        .set('effects', List.of());

      this.setState({reduction});
    };
  }

  render() {
    return (
      <main>
        <LoadingSpinner dispatcher={this.state.dispatcher}
          loaded={!this.state.reduction.getIn(['appState', 'loaded']).some(loadedItem => !loadedItem)}
          loadedOnLastRender={this.state.reduction.getIn(['appState', 'loadedOnLastRender'])}/>
        <section>
          <BrowserArtists dispatcher={this.state.dispatcher}
            loaded={this.state.reduction.getIn(['appState', 'loaded', 'browserArtists'])}
            selected={this.state.reduction.getIn(['appState', 'browser', 'selectedArtist'])}
            list={this.state.reduction.getIn(['appState', 'browser', 'listArtists'])}/>
        </section>
      </main>
    );
  }
}