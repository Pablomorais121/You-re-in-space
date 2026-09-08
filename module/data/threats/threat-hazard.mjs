import BaseThreatData from "./base-threat.mjs";
const { HTMLField } = foundry.data.fields;

export default class HazardThreatData extends BaseThreatData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.triggerCondition = new HTMLField({
            required: false,
            initial: ""
        });

        return schema;
    }
}