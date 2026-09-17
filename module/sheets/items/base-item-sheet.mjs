const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export default class BaseItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {

    static DEFAULT_OPTIONS = {
        classes: ["spacefucked", "sheet", "item"],
        position: { width: 450, height: 400 },
        form: { submitOnChange: true },
        actions: {
            toggleEditor: BaseItemSheet.#onToggleEditor
        }
    };

    _editingFields = new Set();

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.item = this.item;
        context.system = this.item.system;
        context.editable = this.isEditable;
        context.editingFields = this._editingFields;

        const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
        context.enrichedDescription = await TextEditorImpl.enrichHTML(
            this.item.system.description,
            { secrets: this.item.isOwner, rollData: this.item.getRollData?.() ?? {} }
        );

        return context;
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

    static async #onToggleEditor(event, target) {
        const field = target.dataset.field;
        if (this._editingFields.has(field)) this._editingFields.delete(field);
        else this._editingFields.add(field);
        this.render();
    }
}