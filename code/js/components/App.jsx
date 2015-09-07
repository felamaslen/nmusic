/**
 * the main nmusic-app JSX component
 */

import {
  AUTH_STATUS_LOGGED_IN,
  BROWSER_MIN_HEIGHT
} from '../config';

import {
  debounce
} from '../common';

import { List } from 'immutable';
import React, { Component } from 'react';
import { Dispatcher } from 'flux';

// import reducers
import globalReducer from '../reducers/GlobalReducer';

import {
  canNotify,
  sliderClicked,
  resizeGlobal
} from '../actions/AppActions';
import {
  browserResized
} from '../actions/BrowserActions';

import apiCallEffectHandler from '../effects-handlers/ApiCallEffectHandler';
import generalEffectHandler from '../effects-handlers/GeneralEffectHandler';

// import components here
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';
import ResizeSlider from './ResizeSlider';
import PlayerEngine from './PlayerEngine';
import PlayerUI from './PlayerUI';
import Search from './Search';
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
      reduction.get('effects').forEach(generalEffectHandler.bind(null, dispatcher));

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
  }

  componentDidMount() {
    if (!!window.Notification) {
      if (Notification.permission === 'granted') {
        this.state.dispatcher.dispatch(canNotify());
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(permission => {
          if (permission === 'granted') {
            this.state.dispatcher.dispatch(canNotify());
          }
        });
      }
    }

    const _resizeGlobal = resizeGlobal();
    window.addEventListener('resize', debounce(() => {
      this.state.dispatcher.dispatch(_resizeGlobal);
    }, 250));
  }

  componentDidUpdate() {
    document.title = this.state.reduction.getIn(['appState', 'title']);
  }

  render() {
    const authenticated = this.state.reduction.getIn(
      ['appState', 'auth', 'status']
    ) === AUTH_STATUS_LOGGED_IN;

    const currentSong = this.state.reduction.getIn(['appState', 'player', 'currentSong']);
    const currentSongId = currentSong === null ? -1 : currentSong.get('id');

    let songList;
    let playerEngine;
    let playerUI;
    let browsersInside;
    let browsersStyle;
    let search;

    if (authenticated) {
      songList = (
        <SongList dispatcher={this.state.dispatcher}
          orderBy={this.state.reduction.getIn(['appState', 'songList', 'orderBy'])}
          browserHeight={this.state.reduction.getIn(['appState', 'browser', 'height'])}
          currentSongId={currentSongId}
          list={this.state.reduction.getIn(['appState', 'songList', 'list'])}
          selected={this.state.reduction.getIn(['appState', 'songList', 'selectedSongs'])}
          loaded={this.state.reduction.getIn(['appState', 'loaded', 'songList'])}
          resizeTitleClicked={this.state.reduction.getIn(['appState', 'slider', 'titleClicked'])}
          resizeArtistClicked={this.state.reduction.getIn(['appState', 'slider', 'artistClicked'])}
          resizeAlbumClicked={this.state.reduction.getIn(['appState', 'slider', 'albumClicked'])}
          resizeGenreClicked={this.state.reduction.getIn(['appState', 'slider', 'genreClicked'])}
          resizeTitleEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMouseup_title']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMousemove_title'])
          )}
          resizeArtistEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMouseup_artist']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMousemove_artist'])
          )}
          resizeAlbumEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMouseup_album']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMousemove_album'])
          )}
          resizeGenreEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMouseup_genre']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'ResizeSliderMousemove_genre'])
          )}
          titleWidthPreview={this.state.reduction.getIn(['appState', 'songList', 'colWidthPreview', 'title'])}
          artistWidthPreview={this.state.reduction.getIn(['appState', 'songList', 'colWidthPreview', 'artist'])}
          albumWidthPreview={this.state.reduction.getIn(['appState', 'songList', 'colWidthPreview', 'album'])}
          genreWidthPreview={this.state.reduction.getIn(['appState', 'songList', 'colWidthPreview', 'genre'])}
          titleWidthActual={this.state.reduction.getIn(['appState', 'songList', 'colWidthActual', 'title'])}
          artistWidthActual={this.state.reduction.getIn(['appState', 'songList', 'colWidthActual', 'artist'])}
          albumWidthActual={this.state.reduction.getIn(['appState', 'songList', 'colWidthActual', 'album'])}
          genreWidthActual={this.state.reduction.getIn(['appState', 'songList', 'colWidthActual', 'genre'])}
        />
      );

      playerEngine = (
        <PlayerEngine dispatcher={this.state.dispatcher}
          currentSong={currentSong}
          setTime={this.state.reduction.getIn(['appState', 'player', 'setTime'])}
          paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
          volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
          token={this.state.reduction.getIn(['appState', 'auth', 'token'])}
        />
      );

      playerUI = (
        <PlayerUI dispatcher={this.state.dispatcher}
          currentSong={currentSong}
          paused={this.state.reduction.getIn(['appState', 'player', 'paused'])}
          currentTime={this.state.reduction.getIn(['appState', 'player', 'currentTime'])}
          volume={this.state.reduction.getIn(['appState', 'player', 'volume'])}
          volumeClicked={this.state.reduction.getIn(['appState', 'slider', 'volumeClicked'])}
          seekbarClicked={this.state.reduction.getIn(['appState', 'slider', 'seekbarClicked'])}
          volumeControlEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMouseup_volume']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMousemove_volume'])
          )}
          seekbarEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMouseup_seekbar']),
            this.state.reduction.getIn(['appState', 'eventHandlers', 'CustomSliderMousemove_seekbar'])
          )}
          userMenuActive={this.state.reduction.getIn(['appState', 'userMenuActive'])}
          userMenuEvents={List.of(
            this.state.reduction.getIn(['appState', 'eventHandlers', 'UserMenuClear'])
          )}
        />
      );

      browsersInside = (
        <div className="inside">
          <ResizeSlider dispatcher={this.state.dispatcher}
            vertical={true}
            name="resizeBrowser"
            eventHandlers={List.of(
              this.state.reduction.getIn(
                ['appState', 'eventHandlers', 'ResizeSliderMouseup_resizeBrowser']
              ),
              this.state.reduction.getIn(
                ['appState', 'eventHandlers', 'ResizeSliderMousemove_resizeBrowser']
              )
            )}
            min={BROWSER_MIN_HEIGHT}
            max={this.state.reduction.getIn(['appState', 'browser', 'maxHeight'])}
            value={this.state.reduction.getIn(['appState', 'browser', 'height'])}
            clicked={this.state.reduction.getIn(['appState', 'slider', 'resizeBrowserClicked'])}
            clickedAction={sliderClicked}
            changedAction={browserResized}
          />
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
        </div>
      );

      browsersStyle = {
        height: this.state.reduction.getIn(['appState', 'browser', 'height'])
      };

      search = (
        <Search dispatcher={this.state.dispatcher}
          loading={this.state.reduction.getIn(['appState', 'search', 'loading'])}
          results={this.state.reduction.getIn(['appState', 'search', 'results'])}
          hoverIndex={this.state.reduction.getIn(['appState', 'search', 'hoverIndex'])}
        />
      );
    }

    const userArea = authenticated ? (
      <section id="userAreaOuter" className="noselect">
        <section id="section-meta" className="noselect">
          {playerEngine}
          {playerUI}
          {search}
        </section>
        <section id="section-browsers" style={browsersStyle}>
          {browsersInside}
        </section>
        {songList}
      </section>
    ) : false;

    return (
      <main>
        <LoadingSpinner dispatcher={this.state.dispatcher}
          loaded={this.state.reduction.getIn(['appState', 'loaded']).every(loadedItem => !!loadedItem)}
          loadedOnLastRender={this.state.reduction.getIn(['appState', 'loadedOnLastRender'])}
        />
        <LoginForm dispatcher={this.state.dispatcher}
          status={this.state.reduction.getIn(['appState', 'auth', 'status'])}
        />
        {userArea}
      </main>
    );
  }
}
