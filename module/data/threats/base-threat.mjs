const {HTMLField } = foundry.data.fields;

export default class BaseThreatData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new HTMLField({
                required: true,
                initial: ""
            })
        }
    }
}

