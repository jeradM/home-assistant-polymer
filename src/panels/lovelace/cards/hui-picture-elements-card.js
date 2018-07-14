import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../elements/hui-service-button-element.js';
import '../elements/hui-service-icon-element.js';
import '../elements/hui-state-icon-element.js';
import '../elements/hui-state-badge-element.js';
import '../elements/hui-state-label-element.js';
import '../elements/hui-navigation-element.js';
import '../elements/hui-image-element.js';

import createElementElement from '../common/create-element-element.js';

import EventsMixin from '../../../mixins/events-mixin.js';
import LocalizeMixin from '../../../mixins/localize-mixin.js';
import NavigateMixin from '../../../mixins/navigate-mixin.js';

const VALID_TYPES = new Set([
  'image',
  'navigation',
  'service-button',
  'service-icon',
  'state-badge',
  'state-icon',
  'state-label',
]);

/*
 * @appliesMixin EventsMixin
 * @appliesMixin LocalizeMixin
 * @appliesMixin NavigateMixin
 */
class HuiPictureElementsCard extends NavigateMixin(EventsMixin(LocalizeMixin(PolymerElement))) {
  static get template() {
    return html`
    <style>
      ha-card {
        overflow: hidden;
      }
      #root {
        position: relative;
        overflow: hidden;
      }
      #root img {
        display: block;
        width: 100%;
      }
      .element {
        position: absolute;
        transform: translate(-50%, -50%);
      }
      .state-label {
        padding: 8px;
        white-space: nowrap;
      }
      .clickable {
        cursor: pointer;
      }
      ha-call-service-button {
        color: var(--primary-color);
        white-space: nowrap;
      }
      hui-image-element {
        overflow-y: hidden;
      }
    </style>

    <ha-card header="[[_config.title]]">
      <div id="root"></div>
    </ha-card>
`;
  }

  static get properties() {
    return {
      hass: {
        type: Object,
        observer: '_hassChanged'
      },
      _config: Object
    };
  }

  constructor() {
    super();
    this._elements = [];
  }

  ready() {
    super.ready();
    if (this._config) this._buildConfig();
  }

  getCardSize() {
    return 4;
  }

  setConfig(config) {
    if (!config || !config.image || !Array.isArray(config.elements)) {
      throw new Error('Invalid card configuration');
    }
    const invalidTypes = config.elements.map(el => el.type).filter(el => !VALID_TYPES.has(el));
    if (invalidTypes.length) {
      throw new Error(`Incorrect element types: ${invalidTypes.join(', ')}`);
    }

    this._config = config;
    if (this.$) this._buildConfig();
  }

  _buildConfig() {
    const config = this._config;
    const root = this.$.root;
    this._elements = [];

    while (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    const img = document.createElement('img');
    img.src = config.image;
    root.appendChild(img);

    config.elements.forEach((element) => {
      const el = createElementElement(element);
      el.hass = this.hass;
      this._elements.push(el);

      el.classList.add('element');
      Object.keys(element.style).forEach((prop) => {
        el.style.setProperty(prop, element.style[prop]);
      });
      root.appendChild(el);
    });

    if (this.hass) {
      this._hassChanged(this.hass);
    }
  }

  _hassChanged(hass) {
    this._elements.forEach((element) => {
      element.hass = hass;
    });
  }
}

customElements.define('hui-picture-elements-card', HuiPictureElementsCard);
