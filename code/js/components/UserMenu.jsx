// displays a user menu

import { List } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

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
        onMouseDown={this._toggle.bind(this, !this.props.active)}>Menu</button>
    );

    const menuItems = List.of(
      List.of('Log out', this._actionLogout),
    );

    const menuClass = classNames({
      'user-menu': true,
      'context-menu': true,
      'hover-active': true,
      active: this.props.active
    });

    const menu = menuItems.map(
      (item, index) => (
        <li key={index}>
          <a onClick={item.get(1).bind(this)}>{item.get(0)}</a>
        </li>
      )
    );

    return (
      <div className="user-menu-wrapper">
        {menuButton}
        <div onMouseDown={this._cancelEvent} className={menuClass}>
          <ul>{menu}</ul>
        </div>
      </div>
    );
  }

  _cancelEvent(ev) {
    ev.stopPropagation();
  }

  _toggle(status, ev) {
    ev.stopPropagation();

    this.dispatchAction(userMenuToggle(status));

    if (status) {
      window.addEventListener('mousedown', this.props.events.get(0), false);
    } else {
      window.removeEventListener('mousedown', this.props.events.get(0), false);
    }
  }

  _actionLogout() {
    this.dispatchAction(logout());
  }
}

UserMenu.propTypes = {
  active: PropTypes.bool,
  events: PropTypes.instanceOf(List)
};
