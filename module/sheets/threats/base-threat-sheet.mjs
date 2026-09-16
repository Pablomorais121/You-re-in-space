const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export default class BaseThreatSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

    static DEFAULT_OPTIONS = {
        classes: ["spacefucked", "sheet", "actor", "threat"],
        position: { width: 500, height: 500 },
        form: { submitOnChange: true },
        actions: {
            toggleEditor: BaseThreatSheet.#onToggleEditor
        }
    };

    _editingFields = new Set();

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.actor = this.actor;
        context.system = this.actor.system;
        context.cssClass = this.actor.isOwner ? "editable" : "locked";
        context.editable = this.isEditable;
        context.editingFields = this._editingFields;

        const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
        context.enrichedDescription = await TextEditorImpl.enrichHTML(
            this.actor.system.description,
            { secrets: this.actor.isOwner, rollData: this.actor.getRollData() }
        );

        return context;
    }

    static async #onToggleEditor(event, target) {
        const field = target.dataset.field;
        if (this._editingFields.has(field)) this._editingFields.delete(field);
        else this._editingFields.add(field);
        this.render();
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        this.element.querySelectorAll("prose-mirror").forEach(el => {
            el.addEventListener("save", () => {
                const field = el.getAttribute("name").replace("system.", "");
                this._editingFields.delete(field);
                this.render();
        });
    });
}
}