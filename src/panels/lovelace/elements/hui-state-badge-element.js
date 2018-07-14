import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../../../components/entity/ha-state-label-badge.js';

import ElementClickMixin from '../mixins/element-click-mixin.js';

/*
 * @appliesMixin ElementClickMixin
 */
class HuiStateBadgeElement extends ElementClickMixin(PolymerElement) {
  static get template() {
    return html`
      <template is="dom-if" if="[[_stateObj]]">
        <ha-state-label-badge state="[[_stateObj]]"></ha-state-label-badge> 
      </template>
    `;
  }

  static get properties() {
    return {
      hass: {
        type: Object,
        observer: '_hassChanged'
      },
      _config: Object,
      _stateObj: Object
    };
  }

  constructor() {
    super();
    this._clickListener = this.handleClick.bind(this);
  }

  ready() {
    super.ready();
    this.classList.add('clickable');
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._clickListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._clickListener);
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw Error('Error in element configuration');
    }

    this._config = config;
  }

  _hassChanged(hass) {
    this._stateObj = hass.states[this._config.entity];
  }
}
customElements.define('hui-state-badge-element', HuiStateBadgeElement);
