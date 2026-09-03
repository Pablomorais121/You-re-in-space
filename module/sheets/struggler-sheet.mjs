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

  static PARTS = {
    main: {
      template: "systems/spacefucked/templates/actor/struggler-sheet.hbs",
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.system = this.actor.system;
    return context;
  }

  static async #onRollCheck(event, target) {
    console.log("Roll check for", this.actor.name);
  }
    
}