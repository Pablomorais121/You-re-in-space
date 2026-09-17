import BaseItemSheet from "./base-item-sheet.mjs";

export default class KeyItemSheet extends BaseItemSheet {

    static DEFAULT_OPTIONS = {
        classes: ["keyitem"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/items/keyitem-sheet.hbs" }
    };
}