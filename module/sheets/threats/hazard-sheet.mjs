import BaseThreatSheet from "./base-threat-sheet.mjs";

export default class HazardSheet extends BaseThreatSheet {

    static DEFAULT_OPTIONS = {
        classes: ["hazard"]
    };

    static PARTS = {
        main: { template: "systems/spacefucked/templates/actor/threats/hazard-sheet.hbs" }
    };

    async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
    context.enrichedTriggerCondition = await TextEditorImpl.enrichHTML(
        this.actor.system.triggerCondition,
        { secrets: this.actor.isOwner, rollData: this.actor.getRollData() }
    );

    return context;
}
}