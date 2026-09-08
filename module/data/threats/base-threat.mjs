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
/*
export default class ThreatData extends foundry.abstract.TypeDataModel {
    static defineSchema() {

       
        const schema = {};
        
        schema.category = new StringField({
            required: true,
            choices: ["hazard", "robot", "person", "monster", "boss"],
            initial: ""
        });
    
        schema.limbs = new NumberField({
            required:true,
            integer: true,
            initial: 0,
            min: 0,
        });

        schema.health = new NumberField({
            required: true,
            integer:true,
            initial:0,
            min:0
        })

        schema.size = new StringField({
            required: true,
            choices: ["Tiny", "Half-pint", "Human-ish", "Massive"],
            initial: ""
        });

        schema.body = new StringField({
            required: true,
            choices: ["Insectoid", "Slithering", "Humanoid", "Quadruped", "Metal-fused", "Horror"],
            initial: ""
        });

        schema.weakpoint = new StringField({
            required: true,
            choices: ["Arm(s)", "Leg(s)", "Head(s)", "Chest(s)", "Postule(s)", "Other Limb(s)"],
            initial: ""
        });

        schema.behaviour = new StringField({
            required: true,
            choices: ["Relentless", "Reproducer", "Trapper", "Grappler", "Stalker", "Climber"],
            initial: ""
        });

        schema.extraFeatures = new ArrayField({
            required: true,
            choices: ["None", "Carapace", "Extremely Fast", "Sapient", "Flies", "Explodes", "Transforms"],
            initial: []
        });

        schema.gimmicks = new ArrayField({
            required: false,
            choices: ["Corrosive", "Venom-filled", "Hulking", "Piercing", "Imitation", "Resource-Full"],
            initial: []
        });

        schema.quirks = new ArrayField({
            required: false,
            choices: ["Lumbering", "Eyeless", "Impulsive", "Flammable", "Stationary", "Melting"],
            initial: []
        });

        schema.encounter = new StringField({
            required: false,
            choices: ["Cloaked", "Complicated", "Corridor", "Cosmonaut", "Concentration", "Cosmic"],
            initial: ""
        })

        return schema;
    }

}
*/