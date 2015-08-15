/**
 * the main nmusic-app JSX component
 */

import { } from '../config';

import { Record, fromJS, List } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

// import reducers
import mainReducer from '../reducers/MainReducer';
import playerReducer from '../reducers/PlayerReducer';
import audioReducer from '../reducers/AudioReducer';
import browserReducer from '../reducers/BrowserReducer';

import apiCallEffectHandler from '../effects-handlers/ApiCallEffectHandler';

// import components here
import LoadingSpinner from './LoadingSpinner';
import PlayerEngine from './PlayerEngine';
import PlayerUI from './PlayerUI';
import BrowserArtists from './BrowserArtists';
import BrowserAlbums from './BrowserAlbums';

const Reduction = new Record({
  appState: fromJS({
    loaded: {
      browserArtists: false,
      browserAlbums: false,
    },
    loadedOnLastRender: false,
    player: {
      trackHistory: [],
      currentTrack: null,
      paused: true,
      volume: 0.7,
      currentTime: 0,
      setTime: -1,
    },
    trackList: [],
    browser: {
      selectedArtist: -1,
      listArtists: List.of(),
      listAlbums: List.of(),
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
      reduction = playerReducer(reduction, action);
      reduction = audioReducer(reduction, action);
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
          loadedOnLastRender={this.state.reduction.getIn(['appState', 'loadedOnLastRender'])}
        />
        <PlayerEngine dispatcher={this.state.dispatcher}
          history={this.state.reduction.getIn(['appState', 'player', 'trackHistory'])}
          currentTrack={this.state.reduction.getIn(['appState', 'player', 'currentTrack'])}
          setTime={this.state.reduction.getIn(['appState', 'player', 'setTime'])}
          paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
          volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
        />
        <section id="section-meta">
          <PlayerUI dispatcher={this.state.dispatcher}
            currentTrack={this.state.reduction.getIn(['appState', 'player', 'currentTrack'])}
            paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
            currentTime={this.state.reduction.getIn(['appState', 'player', 'currentTime'])}
            volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
          />
        </section>
        <section id="section-browsers">
          <BrowserArtists dispatcher={this.state.dispatcher}
            loaded={this.state.reduction.getIn(['appState', 'loaded', 'browserArtists'])}
            selected={this.state.reduction.getIn(['appState', 'browser', 'selectedArtist'])}
            list={this.state.reduction.getIn(['appState', 'browser', 'listArtists'])}
          />
          <BrowserAlbums dispatcher={this.state.dispatcher}
            loaded={this.state.reduction.getIn(['appState', 'loaded', 'browserAlbums'])}
            selected={this.state.reduction.getIn(['appState', 'browser', 'selectedAlbum'])}
            selectedArtist={this.state.reduction.getIn(['appState', 'browser', 'selectedArtist'])}
            list={this.state.reduction.getIn(['appState', 'browser', 'listAlbums'])}
          />
        </section>
      </main>
    );
  }
}
