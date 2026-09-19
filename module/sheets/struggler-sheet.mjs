import {performRoll, performSearchCheck} from "../utils.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const {HandlebarsApplicationMixin} = foundry.applications.api;


export default class StrugglerSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["spacefucked", "sheet", "actor", "struggler"],
    position: { width: 650, height: 750},
    form: {submitOnChange: true},
    actions: {
      openRoll: StrugglerSheet.#onOpenRoll,
      openSearchCheck: StrugglerSheet.#onOpenSearchCheck,
      togglePip: StrugglerSheet.#onTogglePip
    }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "main", label: "SPACEFUCKED.TabMain" },
        { id: "inventory", label: "SPACEFUCKED.TabInventory" },
        { id: "notes", label: "SPACEFUCKED.TabNotes" }
      ],
      initial: "main"
    }
  };

  static PARTS = {
    header: { template: "systems/spacefucked/templates/actor/struggler/struggler-header.hbs",},
    tabs: { template: "templates/generic/tab-navigation.hbs",},
    main: { template: "systems/spacefucked/templates/actor/struggler/struggler-main.hbs", scrollable:[""]},
    inventory: { template: "systems/spacefucked/templates/actor/struggler/struggler-inventory.hbs", scrollable:[""]},
    notes: { template: "systems/spacefucked/templates/actor/struggler/struggler-notes.hbs", scrollable:[""]}
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.cssClass = this.actor.isOwner ? "editable" : "locked";
    context.tabs = this._prepareTabs("primary");

    const items = this.actor.items;
    context.weapons = items.filter(i => i.type === "weapon");
    context.armor = items.filter(i => i.type === "armor");
    context.utility = items.filter(i => i.type === "utility");
    context.keyItems = items.filter(i => i.type === "keyitem");

    return context;
  }

  async _preparePartContext(partId, context) {
    context = await super._preparePartContext(partId, context);
    if (context.tabs?.[partId]) {
        context.tab = context.tabs[partId];
    }
    return context;
  }

  static async #onOpenRoll(event, target) {
    await performRoll(this.actor);
  }

  static async #onOpenSearchCheck(event, target) {
    await performSearchCheck(this.actor);
  }

  static async #onTogglePip(event, target) {
    const resource = target.dataset.resource;
    const clickedValue = Number(target.dataset.value);

    if (resource == "xp") {
      const current = this.actor.system.xp.value;
      const newValue = current === clickedValue ? clickedValue -1 : clickedValue;
      
      if (newValue >= 5) {
        await this.actor.update ({
          "system.xp.value": 0,
          "system.xp.marks": this.actor.system.xp.marks + 1
        });
      } else {
        await this.actor.update({ "system.xp.value": newValue });
      }
      return
    }

    const current = this.actor.system.resources[resource].value;
    const newValue = current === clickedValue ? clickedValue -1 : clickedValue;
    await this.actor.update ({[`system.resources.${resource}.value`]: newValue});

  }

}