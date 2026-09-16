import BaseThreatSheet from "./base-threat-sheet.mjs";

export default class MonsterSheet extends BaseThreatSheet {

    static DEFAULT_OPTIONS = {
        classes: ["monster"],
        position: { width: 500, height: 700 }
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/actor/threats/monster-sheet.hbs" }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.isGM = game.user.isGM;
        return context;
    }
}