import BaseThreatSheet from "./base-threat-sheet.mjs";

export default class PersonSheet extends BaseThreatSheet {

    static DEFAULT_OPTIONS = {
        classes: ["person"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/actor/threats/person-sheet.hbs" }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
        context.enrichedMotivation = await TextEditorImpl.enrichHTML(
            this.actor.system.motivation,
            { secrets: this.actor.isOwner, rollData: this.actor.getRollData() }
        );

        return context;
    }
}