const { ActorSheetV2 } = foundry.applications.sheets;
const {HandlebarsApplicationMixin} = foundry.applications.api;

export default class StrugglerSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  
  static DEFAULT_OPTIONS = {
    classes: ["spacefucked", "sheet", "actor", "struggler"],
    position: { width: 650, height: 750},
    form: {submitOnChange: true},
    actions: {
      rollCheck: StrugglerSheet.#onRollCheck
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
    inventory: { template: "systems/spacefucked/templates/actor/struggler/struggler-inventory.hbs",scrollable:[""]},
    notes: { template: "systems/spacefucked/templates/actor/struggler/struggler-notes.hbs",scrollable:[""]}
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

  static async #onRollCheck(event, target) {
    console.log("Roll check for", this.actor.name);
  }


    
}