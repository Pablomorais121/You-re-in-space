const { HTMLField } = foundry.data.fields;

export default class BaseItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({
                required: true,
                initial: ""
            })
        };
    }
}