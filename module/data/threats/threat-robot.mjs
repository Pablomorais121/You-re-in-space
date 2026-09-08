import BaseThreatData from "./base-threat.mjs";
const { HTMLField, NumberField } = foundry.data.fields;

export default class RobotThreatData extends BaseThreatData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.health = new NumberField({
            required: true,
            integer: true,
            initial: 0,
            min: 0
        });

        schema.slowThreshold = new NumberField({
            required: false,
            integer: true,
            initial: null,
            min: 0
        })

        schema.haltThreshold = new NumberField({
            required: false,
            integer: true,
            initial: null,
            min: 0
        })

        schema.immunities = new HTMLField({
            required: false,
            initial: ""
        });

        return schema;
    }
}