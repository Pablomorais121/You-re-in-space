import BaseThreatSheet from "./base-threat-sheet.mjs";

export default class RobotSheet extends BaseThreatSheet {

    static DEFAULT_OPTIONS = {
        classes: ["robot"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/actor/threats/robot-sheet.hbs" }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
        context.enrichedImmunities = await TextEditorImpl.enrichHTML(
            this.actor.system.immunities,
            { secrets: this.actor.isOwner, rollData: this.actor.getRollData() }
        );

        return context;
    }
}