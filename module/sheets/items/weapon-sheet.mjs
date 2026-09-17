import BaseItemSheet from "./base-item-sheet.mjs";

export default class WeaponSheet extends BaseItemSheet {

    static DEFAULT_OPTIONS = {
        classes: ["weapon"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/items/weapon-sheet.hbs" }
    };
}