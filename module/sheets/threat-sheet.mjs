export class SpacefuckedThreatSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["spacefucked", "sheet", "actor", "threat"],
      template: "systems/spacefucked/templates/actor/threat-sheet.html",
      width: 480,
      height: 560
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.categories = CONFIG.SPACEFUCKED.threatCategories;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".hp-pip").on("click", this._onHpPip.bind(this));
    html.find(".weak-point-toggle").on("click", this._onWeakPointToggle.bind(this));
  }

  async _onHpPip(event) {
    event.preventDefault();
    const value = Number(event.currentTarget.dataset.value);
    await this.actor.update({ "system.hp.value": value });
  }

  async _onWeakPointToggle(event) {
    event.preventDefault();
    await this.actor.update({ "system.weakPointsKnown": !this.actor.system.weakPointsKnown });
  }
}
