const { NumberField, StringField } = foundry.data.fields;

export default class WeaponData extends BaseItemData {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.category = new StringField({
            required: false,
            blank: true,
            initial: "",
            choices: ["Melee", "Projectile", "Thrown", "Placed & Triggered"]
        });

        schema.damageType = new StringField({
            required: false,
            initial: ""
        });

        schema.damage = new NumberField({
            required: true,
            integer: true,
            initial: 1,
            min: 0
        });

        schema.ammoType = new StringField({
            required: false,
            initial: ""
        });

        return schema;
    }
}