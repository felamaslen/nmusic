// displays a user menu

import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  storeEventHandler,
  userMenuToggle
} from '../actions/AppActions';

import {
  logout
} from '../actions/LoginActions';

export default class UserMenu extends PureControllerView {
  componentWillMount() {
    this.dispatchNext(storeEventHandler({
      name: 'UserMenuClear',
      func: this._toggle.bind(this, false)
    }));
  }

  render() {
    const menuButton = (
      <button id="user-menu-btn"
        onClick={this._toggle.bind(this, !this.props.active)}>Menu</button>
    );

    const menu = this.props.active ? (
      <div className="user-menu">
        <ul>
          <li><a onClick={this._actionLogout.bind(this)}>Log out</a></li>
        </ul>
      </div>
    ) : false;

    return (
      <div className="user-menu-wrapper">
        {menuButton}
        {menu}
      </div>
    );
  }

  _toggle(status) {
    this.dispatchAction(userMenuToggle(status));
  }

  _actionLogout() {
    this.dispatchAction(logout());
  }
}

UserMenu.propTypes = {
  active: PropTypes.bool
};
