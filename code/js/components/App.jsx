/**
 * the main nmusic-app JSX component
 */

import { } from '../config';

import { List } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

// import reducers
import globalReducer from '../reducers/GlobalReducer';

import apiCallEffectHandler from '../effects-handlers/ApiCallEffectHandler';

// import components here
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';
import PlayerEngine from './PlayerEngine';
import PlayerUI from './PlayerUI';
import BrowserArtists from './BrowserArtists';
import BrowserAlbums from './BrowserAlbums';
import SongList from './SongList';

import Reduction from '../reduction';

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
      reduction = globalReducer(reduction, action);

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
      actionLog: List.of() // This is only for debugging, we can perform replay of actions
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
        .reduce(globalReducer, new Reduction())
        .set('effects', List.of());

      this.setState({reduction});
    };
  }

  render() {
    let main;

    const authenticated = !this.state.reduction.getIn(['appState', 'auth', 'status']);

    const currentSong = this.state.reduction.getIn(['appState', 'player', 'currentSong']);
    const currentSongId = currentSong === null ? -1 : currentSong.get('id');

    const userArea = authenticated ? (
      <section id="userAreaOuter">
        <LoadingSpinner dispatcher={this.state.dispatcher}
          loaded={!this.state.reduction.getIn(['appState', 'loaded']).some(loadedItem => !loadedItem)}
          loadedOnLastRender={this.state.reduction.getIn(['appState', 'loadedOnLastRender'])}
        />
        <PlayerEngine dispatcher={this.state.dispatcher}
          currentSong={currentSong}
          setTime={this.state.reduction.getIn(['appState', 'player', 'setTime'])}
          paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
          volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
          token={this.state.reduction.getIn(['appState', 'auth', 'token'])}
        />
        <section id="section-meta" className="noselect">
          <PlayerUI dispatcher={this.state.dispatcher}
            currentSong={currentSong}
            paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
            currentTime={this.state.reduction.getIn(['appState', 'player', 'currentTime'])}
            volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
            volumeClicked={this.state.reduction.getIn(['appState', 'customSlider', 'volumeClicked'])}
            seekbarClicked={this.state.reduction.getIn(['appState', 'customSlider', 'seekbarClicked'])}
            volumeControlEvents={List.of(
              this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMouseup_volume']),
              this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMousemove_volume'])
            )}
            seekbarEvents={List.of(
              this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMouseup_seekbar']),
              this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMousemove_seekbar'])
            )}
          />
        </section>
        <section id="section-browsers">
          <BrowserArtists dispatcher={this.state.dispatcher}
            loaded={this.state.reduction.getIn(['appState', 'loaded', 'browserArtists'])}
            selected={this.state.reduction.getIn(['appState', 'browser', 'selectedArtists'])}
            list={this.state.reduction.getIn(['appState', 'browser', 'listArtists'])}
          />
          <BrowserAlbums dispatcher={this.state.dispatcher}
            loaded={this.state.reduction.getIn(['appState', 'loaded', 'browserAlbums'])}
            selected={this.state.reduction.getIn(['appState', 'browser', 'selectedAlbums'])}
            selectedArtists={this.state.reduction.getIn(['appState', 'browser', 'selectedArtists'])}
            list={this.state.reduction.getIn(['appState', 'browser', 'listAlbums'])}
          />
        </section>
        <SongList dispatcher={this.state.dispatcher}
          currentSongId={currentSongId}
          list={this.state.reduction.getIn(['appState', 'songList', 'list'])}
          selected={this.state.reduction.getIn(['appState', 'songList', 'selectedSongs'])}
          loaded={this.state.reduction.getIn(['appState', 'loaded', 'songList'])}
        />
      </section>
    ) : false;

    return (
      <main>
        <LoginForm dispatcher={this.state.dispatcher}
          status={this.state.reduction.getIn(['appState', 'auth', 'status'])}
        />
        {userArea}
      </main>
    );
  }
}
