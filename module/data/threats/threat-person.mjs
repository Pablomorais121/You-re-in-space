import BaseThreatData from "./base-threat.mjs";
const { HTMLField, NumberField, StringField } = foundry.data.fields;

export default class PersonThreatData extends BaseThreatData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.health = new NumberField({
            required: false,
            integer: true,
            initial: 0,
            min: 0
        });

        schema.pronouns = new StringField({
            required: false,
            initial: "",
        })

        schema.motivation = new HTMLField({
            required: true,
            initial: ""
        });

        schema.disposition = new StringField({
            required: true,
            choices: ["Friendly", "Neutral", "Hostile"],
            initial: "Neutral"
        })

        return schema;
    }
}