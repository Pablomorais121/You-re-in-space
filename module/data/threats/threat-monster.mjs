import BaseThreatData from "./base-threat.mjs";
const { NumberField, StringField, ArrayField, BooleanField } = foundry.data.fields;

export default class MonsterThreatData extends BaseThreatData {
    static defineSchema() {
   
        const schema = super.defineSchema();
        
    
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
            required: false,
            blank: true,
            initial: "",
            choices: ["Tiny", "Half-pint", "Human-ish", "Massive"]
        });

        schema.body = new StringField({
            required: false,
            blank: true,
            initial: "",
            choices: ["Insectoid", "Slithering", "Humanoid", "Quadruped", "Metal-fused", "Horror"],
        });

        schema.weakpoint = new StringField({
            required: false,
            blank: true,
            initial: "",
            choices: ["Arm(s)", "Leg(s)", "Head(s)", "Chest(s)", "Pustule(s)", "Other Limb(s)"],
        });

        schema.behaviour = new StringField({
            required: false,
            blank: true,
            initial: "",
            choices: ["Relentless", "Reproducer", "Trapper", "Grappler", "Stalker", "Climber"],
        });

        schema.extraFeatures = new ArrayField(
            new StringField({
                choices: ["Carapace", "Extremely Fast", "Sapient", "Flies", "Explodes", "Transforms"] 
            }),
            { required: false, initial: [] }
        );

        schema.gimmicks = new ArrayField(
            new StringField({
                choices: ["Corrosive", "Venom-filled", "Hulking", "Piercing", "Imitation", "Resource-Full"], 
            }),
            { required: false, initial: [] }
        );

        schema.quirks = new ArrayField(
            new StringField({
                choices: ["Lumbering", "Eyeless", "Impulsive", "Flammable", "Stationary", "Melting"] 
            }),
            { required: false, initial: [] }
        );

        schema.isBoss = new BooleanField({
            required: false,
            initial: false
        });

        schema.encounter = new StringField({
            required: false,
            blank: true,
            initial: "",
            choices: ["Cloaked", "Complicated", "Corridor", "Cosmonaut", "Concentration", "Cosmic"]
        })

        return schema;
    }

}
