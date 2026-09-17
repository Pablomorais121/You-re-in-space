import BaseItemSheet from "./base-item-sheet.mjs";

export default class ArmorSheet extends BaseItemSheet {

    static DEFAULT_OPTIONS = {
        classes: ["armor"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/items/armor-sheet.hbs" }
    };
}