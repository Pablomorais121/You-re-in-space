import BaseItemSheet from "./base-item-sheet.mjs";

export default class UtilitySheet extends BaseItemSheet {

    static DEFAULT_OPTIONS = {
        classes: ["utility"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/items/utility-sheet.hbs" }
    };
}