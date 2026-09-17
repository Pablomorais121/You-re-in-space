const { SchemaField, NumberField } = foundry.data.fields;
import BaseItemData from "./base-item.mjs";

export default class UtilityData extends BaseItemData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.uses = new SchemaField({
            value: new NumberField({
                required: true,
                integer: true,
                initial: 1,
                min: 0
            }),
            max: new NumberField({
                required: true,
                integer: true,
                initial: 1,
                min: 0
            })
        });

        return schema;
    }
}