const {NumberField, StringField, SchemaField, HTMLField, BooleanField } = foundry.data.fields;

export default class StrugglerData extends foundry.abstract.TypeDataModel {
    static defineSchema() {

        const resourceField = (initial) => new SchemaField({
            value: new NumberField({
                required: true,
                integer: true,
                min:0,
                initial: initial
            }),
            max: new NumberField({
                required: true,
                integer: true,
                min:0,
                initial: initial
            }),
        });

        const schema = {};

        schema.look = new StringField({
            required: true, 
            initial: ""
        });

        schema.background = new StringField({
            required: true, 
            initial: ""
        });

        schema.resources = new SchemaField({
            will: resourceField(5),
            luck : resourceField(2)
        });

        schema.stats = new SchemaField({
            tech: new SchemaField({
                value: new NumberField({required: true, integer: true, min:0, initial: 0})
            }),
            flesh: new SchemaField({
                value: new NumberField({required: true, integer: true, min:0, initial: 0})
            })
        })

        schema.wounds = new SchemaField({
            level1: new SchemaField({ active: new BooleanField({ initial: false }), text: new StringField() }),
            level2: new SchemaField({ active: new BooleanField({ initial: false }), text: new StringField() })
        })
    

        schema.experience = new SchemaField({
            value: new NumberField({
                required: true,
                integer: true,
                min: 0,
                max: 4,
                initial: 0
            }),
            marks: new NumberField({
                required: true,
                integer: true,
                min: 0,
                initial: 0
            })
            
        });

    

            
        return schema;
    }

     prepareDerivedData() {
            this.activeWoundCount = Object.values(this.wounds).filter(w => w.active).length;
        };
}