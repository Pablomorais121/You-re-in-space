import { openCheckDialog } from "../helpers/dice.mjs";

export class SpacefuckedStrugglerSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["spacefucked", "sheet", "actor", "struggler"],
      template: "systems/spacefucked/templates/actor/struggler-sheet.html",
      width: 640,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.items = context.actor.items;
    context.weapons = context.actor.items.filter(i => ["weapon", "tool"].includes(i.type));
    context.armor = context.actor.items.filter(i => i.type === "armor");
    context.utility = context.actor.items.filter(i => i.type === "utility");
    context.keyItems = context.actor.items.filter(i => i.type === "keyitem");
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".roll-check").on("click", this._onRollCheck.bind(this));
    html.find(".search-check").on("click", this._onSearchCheck.bind(this));
    html.find(".item-edit").on("click", this._onItemEdit.bind(this));
    html.find(".item-delete").on("click", this._onItemDelete.bind(this));
    html.find(".item-create").on("click", this._onItemCreate.bind(this));
    html.find(".item-to-chat").on("click", this._onItemToChat.bind(this));
    html.find(".wound-toggle").on("click", this._onWoundToggle.bind(this));
    html.find(".resource-pip").on("click", this._onResourcePip.bind(this));
  }

  async _onRollCheck(event) {
    event.preventDefault();
    await openCheckDialog(this.actor, {});
  }

  async _onSearchCheck(event) {
    event.preventDefault();
    await openCheckDialog(this.actor, {
      isSearch: true,
      flavor: game.i18n.localize("SPACEFUCKED.SearchCheck")
    });
  }

  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    item?.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    await item?.delete();
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type ?? "utility";
    const name = game.i18n.format("SPACEFUCKED.NewItem", {
      type: game.i18n.localize(`TYPES.Item.${type}`)
    });
    await Item.create({ name, type }, { parent: this.actor });
  }

  async _onItemToChat(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    await item?.toChat();
  }

  async _onWoundToggle(event) {
    event.preventDefault();
    const level = event.currentTarget.dataset.level;
    const path = `system.wounds.${level}.active`;
    const current = foundry.utils.getProperty(this.actor, path);
    await this.actor.update({ [path]: !current });
  }

  async _onResourcePip(event) {
    event.preventDefault();
    const resource = event.currentTarget.dataset.resource;
    const value = Number(event.currentTarget.dataset.value);
    await this.actor.update({ [`system.resources.${resource}.value`]: value });
  }
}
