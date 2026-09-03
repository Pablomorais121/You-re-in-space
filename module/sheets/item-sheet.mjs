export class SpacefuckedItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["spacefucked", "sheet", "item"],
      template: "systems/spacefucked/templates/item/item-sheet.html",
      width: 480,
      height: 420
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.system = context.item.system;
    context.config = CONFIG.SPACEFUCKED;
    return context;
  }
}
