const { SchemaField, NumberField } = foundry.data.fields;

export default class ArmorData extends BaseItemData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.durability = new SchemaField({
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