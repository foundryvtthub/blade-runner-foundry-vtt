import { FLBR } from '@system/config';
import { ACTOR_TYPES, ITEM_TYPES } from '@system/constants';
import { enrichTextFields } from '@utils/string-util';
import ActorSheetConfig from './actor-sheet-config';

/**
 * Blade Runner RPG Actor Sheet.
 * @extends {ActorSheet} Extends the basic ActorSheet
 */
export default class BladeRunnerActorSheet extends ActorSheet {

  /* ------------------------------------------ */
  /*  Properties                                */
  /* ------------------------------------------ */

  get rollData() {
    return this.actor.getRollData();
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  async getData(options) {
    const isOwner = this.actor.isOwner;
    const baseData = super.getData(options);
    const sheetData = {
      cssClass: isOwner ? 'editable' : 'locked',
      owner: isOwner,
      limited: this.actor.limited,
      editable: this.isEditable,
      options: this.options,
      isGM: game.user.isGM,
      actor: baseData.actor,
      system: foundry.utils.duplicate(baseData.actor.system),
      items: baseData.items,
      effects: baseData.effects,
      rollData: this.rollData,
      config: CONFIG.BLADE_RUNNER,
    };

    await enrichTextFields(sheetData, ['system.description']);

    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Methods                                   */
  /* ------------------------------------------ */

  /* ------------------------------------------ */
  /*  Filtering Dropped Items                   */
  /* ------------------------------------------ */

  /** @override */
  async _onDropItemCreate(itemData) {
    const type = itemData.type;
    const alwaysAllowedItems = FLBR.physicalItems;
    const allowedItems = {
      [ACTOR_TYPES.CHAR]: [ITEM_TYPES.SPECIALTY, ITEM_TYPES.SYNTHETIC_AUGMENTATION, ITEM_TYPES.CRITICAL_INJURY],
      [ACTOR_TYPES.VEHICLE]: [],
    };
    let allowed = true;

    if (!alwaysAllowedItems.includes(type)) {
      if (!allowedItems[this.actor.type].includes(type)) {
        allowed = false;
      }
    }

    if (!allowed) {
      const msg = game.i18n.format('FLBR.ActorSheet.NotifWrongItemType', {
        type: game.i18n.localize(`FLBR.ItemTypes.${type}`),
        actor: game.i18n.localize(`FLBR.ActorTypes.${this.actor.type}`),
      });
      console.warn(`FLBR | ${msg}`);
      ui.notifications.warn(msg);
      return false;
    }
    return super._onDropItemCreate(itemData);
  }

  /* ------------------------------------------ */
  /*  Custom Drag Data                          */
  /* ------------------------------------------ */

  /** @override */
  _onDragStart(event) {
    const elem = event.currentTarget;
    const data = elem.dataset;

    if (
      typeof data.attribute !== 'undefined' ||
      typeof data.skill !== 'undefined' ||
      typeof data.action !== 'undefined'
    ) {
      const dragData = {
        actorId: this.actor.id,
        sceneId: this.actor.isToken ? canvas.scene?.id : null,
        tokenId: this.actor.isToken ? this.actor.token.id : null,
        uuid: this.actor.uuid,
        type: data.action ? 'Action' : 'Stat',
        attribute: data.attribute,
        skill: data.skill,
        action: data.action,
      };
      return event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
    return super._onDragStart(event);
  }

  /* ------------------------------------------ */
  /*  Custom Config Sheet                       */
  /* ------------------------------------------ */

  /** @override */
  _onConfigureSheet(event) {
    event.preventDefault();
    new ActorSheetConfig(this.actor, {
      // classes: ['blade-runner'],
      top: this.position.top + 40,
      left: this.position.left + (this.position.width - 400) / 2,
    }).render(true);
  }

  /* ------------------------------------------ */
  /*  Sheet Header Buttons                      */
  /* ------------------------------------------ */

  /** @override */
  _getHeaderButtons() {
    const originalButtons = super._getHeaderButtons();

    if (!game.user.isGM && this.actor.limited) return originalButtons;

    const myButtons = [
      {
        label: game.i18n.localize('FLBR.SHEET_HEADER.GenericRoll'),
        class: 'custom-roll',
        icon: 'fas fa-dice',
        onclick: () => this.actor.rollStat(),
      },
    ];
    return myButtons.concat(originalButtons);
  }

  /* ------------------------------------------ */
  /*  Sheet Listeners                           */
  /* ------------------------------------------ */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Editable-only Listeners
    if (!game.user.isGM && this.actor.limited) return;
    // if (!this.options.editable) return;
    if (!this.isEditable) return;

    // Input Focus & Update
    const inputs = html.find('input');
    inputs.focus(ev => ev.currentTarget.select());

    // Item Management
    html.find('.capacities .capacity-boxes').on('click contextmenu', this._onCapacityIncrease.bind(this));
    html.find('.meta-currencies .capacity-boxes').on('click contextmenu', this._onCapacityIncrease.bind(this));

    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
    html.find('.item-delete-confirmed').click(this._onItemDeleteConfirmed.bind(this));
    html.find('.item-roll').click(this._onItemRoll.bind(this));
    html.find('.item-chat').click(this._onItemChat.bind(this));
    html.find('.blast-roll').click(this._onBlastRoll.bind(this));
    html.find('.embedded-item').on('contextmenu', this._onItemEdit.bind(this));

    // Owner-only listeners.
    if (this.actor.isOwner) {
      html.find('.stat-roll[data-attribute]').each((_index, elem) => {
        elem.setAttribute('draggable', true);
        elem.addEventListener('dragstart', ev => this._onDragStart(ev), false);
      });
      html.find('.embedded-item[data-item-id]').each((_index, elem) => {
        elem.setAttribute('draggable', true);
        elem.addEventListener('dragstart', ev => this._onDragStart(ev), false);
      });
    }
  }

  /* ------------------------------------------ */

  _onItemCreate(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const type = elem.dataset.type;
    const itemName = game.i18n.format('FLBR.NewItem', {
      type: game.i18n.localize(`ITEM.Type${type.capitalize()}`),
    });
    const itemData = { name: itemName, type };
    return this.actor.createEmbeddedDocuments('Item', [itemData])
      // Displays the sheet of the newly created item.
      .then(itmData => {
        const itemId = itmData[0].id;
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
      });
  }

  _onItemEdit(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    return item.sheet.render(true);
  }

  /** @param {MouseEvent} event */
  _onItemDelete(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    elem.style.display = 'none';
    const embeddedItem = elem.closest('.embedded-item');
    const deleteButton = embeddedItem.getElementsByClassName('item-delete-confirmed')[0];
    deleteButton.style.display = 'inline';
  }

  _onItemDeleteConfirmed(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    return this.actor.deleteEmbeddedDocuments('Item', [itemId]);
  }

  /* ------------------------------------------ */

  _onItemRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) return item.roll();
  }

  /* ------------------------------------------ */

  _onBlastRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) return item._rollExplosive();
  }

  /* ------------------------------------------ */

  _onItemChat(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) return item.toMessage();
  }

  /* ------------------------------------------ */

  _onCapacityIncrease(event) { return this._onCapacityChange(event, +1); }
  _onCapacityDecrease(event) { return this._onCapacityChange(event, -1); }

  /** Default => Left-click: +1, Right-click: -1 */
  _onCapacityChange(event, mod = 1) {
    event.preventDefault();
    const elem = event.currentTarget;
    const min = +elem.dataset.min ?? 0;
    const max = +elem.dataset.max || 10;
    const field = elem.dataset.field;
    if (!field) return;

    let count = foundry.utils.getProperty(this.actor, field) ?? 0;

    if (event.type === 'click') count += mod;
    else count -= mod; // contextmenu
    count = Math.clamped(count, min, max);

    return this.actor.update({ [field]: count });
  }
}
