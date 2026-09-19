const {DialogV2} = foundry.applications.api;

export const SEARCH_TABLE = {
    0: [
        { min: 1, max: 3, name: "Ammunition", desc: "Station's choice" },
        { min: 4, max: 6, name: "1x Stimjet (1 use)", desc: "Ignore a Level 1 Wound for a short time" },
        { min: 7, max: 9, name: "A Note", desc: "Maybe this points to something…" },
        { min: 10, max: 12, name: "Slapdash Noisemaker", desc: "A distraction?" }
    ],
    1: [
        { min: 1, max: 1, name: "Ammunition", desc: "Struggler's choice" },
        { min: 2, max: 2, name: "Ammunition", desc: "Station's choice" },
        { min: 3, max: 3, name: "Audio Log", desc: "What an awful fate…" },
        { min: 4, max: 4, name: "5x Glow Sticks", desc: "Dimly lights an area for 5 hours" },
        { min: 5, max: 5, name: "A Note", desc: "Maybe this points to something…" },
        { min: 6, max: 6, name: "2x Bandages", desc: "Stops the bleeding, at least" },
        { min: 7, max: 7, name: "Slapdash Noisemaker", desc: "A distraction?" },
        { min: 8, max: 8, name: "1x Mx. Handyweld", desc: "Welds things together, for a time" },
        { min: 9, max: 9, name: "A Dying A.I. Core", desc: "Maybe it can answer a question or two?" },
        { min: 10, max: 10, name: "Energy Drink (1 use)", desc: "Station's choice" },
        { min: 11, max: 11, name: "1x Stimjet (1 use)", desc: "Ignore a Level 1 Wound for a short time" },
        { min: 12, max: 12, name: "1x Pocket Nurse", desc: "Heals Level 1 Wound, use 2 to heal Level 2" }
    ],
    2: [
        { min: 1, max: 1, name: "2x Pocket Nurse", desc: "Heals Level 1 Wound, use 2 to heal Level 2" },
        { min: 2, max: 2, name: "Vintage Engineering Suit (Armor, Durability 3)", desc: "+1d when defending against Melee" },
        { min: 3, max: 3, name: "Repair Kit (2 uses)", desc: "Use to repair an Item (by 1 Durability) or something in the world" },
        { min: 4, max: 4, name: "2x Stimjets (1 use each)", desc: "Ignore a Level 1 Wound for a short time" },
        { min: 5, max: 5, name: "Armory Requisition (1 use)", desc: "Turn in to an A.I. Quartermaster to requisition a new piece of equipment" },
        { min: 6, max: 6, name: "3x Ammunition", desc: "Struggler's choice" },
        { min: 7, max: 7, name: "Useful materials", desc: "What are they for?" },
        { min: 8, max: 8, name: "2x Mx. Handyweld", desc: "Welds things together, for a time" },
        { min: 9, max: 9, name: "2x Stimjets (1 use each)", desc: "Ignore a Level 1 Wound for a short time" },
        { min: 10, max: 10, name: "A New Weapon", desc: "Roll on the Unique Tool table to generate it" },
        { min: 11, max: 11, name: "An Upgrade for a weapon", desc: "What's it for? What's it do?" },
        { min: 12, max: 12, name: "An Improvement for yourself", desc: "What's it for? What's it do?" }
    ]
};

export function getSearchResult(hits, roll) {
    const column = SEARCH_TABLE[Math.min(hits, 2)];
    return column.find(entry => roll >= entry.min && roll <= entry.max);
}

export async function performSearchCheck(actor) {
    const dialogContent = await foundry.applications.handlebars.renderTemplate(
        "systems/spacefucked/templates/chat/search-dialog.hbs",
    );
    const result = await DialogV2.prompt({
        window: { title: "Search Check" },
        classes: ["spacefucked-roll-dialog"],
        content: dialogContent,
        render: (event, dialog) => {
            const form = dialog.element.querySelector("form");
            const statInput = form.elements.stat;
            const advantageInput = form.elements.advantage;
            const disadvantageInput = form.elements.disadvantage;
            const poolValueEl = form.querySelector(".pool-value");

            const statButtons = form.querySelectorAll(".toggle-btn");
            const counterButtons = form.querySelectorAll(".counter-btn");

            function updatePool() {
                const stat = statInput.value;
                const statValue = stat !== "none" ? (actor.system.stats[stat]?.value ?? 0) : 0;
                const advantage = Number(advantageInput.value) || 0;
                const disadvantage = Number(disadvantageInput.value) || 0;
                const pool = Math.max(2 + statValue + advantage - disadvantage, 0);
                poolValueEl.textContent = pool;
            }

            statButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const clickedStat = btn.dataset.stat;
                    if (statInput.value === clickedStat) {
                        statInput.value = "none";
                        btn.classList.remove("active");
                    } else {
                        statInput.value = clickedStat;
                        statButtons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                    }
                    updatePool();
                });
            });

            counterButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const counter = btn.dataset.counter;
                    const delta = Number(btn.dataset.delta);
                    const input = counter === "advantage" ? advantageInput : disadvantageInput;
                    const valueEl = form.querySelector(`[data-counter-value="${counter}"]`);
                    const newValue = Math.max(0, Number(input.value) + delta);
                    input.value = newValue;
                    valueEl.textContent = newValue;
                    updatePool();
                });
            });

            updatePool();
        },
        ok: {
            label: "Search",
            callback: (event, button) => ({
                stat: button.form.elements.stat.value,
                advantage: Number(button.form.elements.advantage.value) || 0,
                disadvantage: Number(button.form.elements.disadvantage.value) || 0,
                useLuck: button.form.elements.useLuck.checked
            })
        }
    });

    if (!result) return;

    const statValue = result.stat !== "none" ? actor.system.stats[result.stat].value : 0;
    const pool = Math.max(2 + statValue + (result.desperation ? 2 : 0) + result.advantage - result.disadvantage, 0);
    const poolFormula = pool === 0 ? "2d6kl" : `${pool}d6`;

    if (result.useLuck) {
        const roll = new Roll(poolFormula);
        await roll.evaluate();

        const dieTerm = roll.terms.find(t => Array.isArray(t.results));
        const hits = dieTerm.results.filter(r => r.active && r.result >= 5).length;
        const rollHTML = await roll.render();

        const content = await foundry.applications.handlebars.renderTemplate(
            "systems/spacefucked/templates/chat/search-luck-card.hbs",
            { hits, rollHTML, table: SEARCH_TABLE[Math.min(hits, 2)] }
        );

        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content,
            rolls: [roll],
            sound: CONFIG.sounds.dice
        });
        return;
    }

    const roll = new Roll(`{${poolFormula}, 2d6}`);
    await roll.evaluate();

    const poolTerm = roll.terms.find(t => t instanceof foundry.dice.terms.PoolTerm);
    const [hitsRoll, tableRoll] = poolTerm.rolls;

    const dieTerm = hitsRoll.terms.find(t => Array.isArray(t.results));
    const hits = dieTerm.results.filter(r => r.active && r.result >= 5).length;
    const tableRowRoll = tableRoll.total;
    const item = getSearchResult(hits, tableRowRoll);

    const rollHTML = await roll.render();

    const content = await foundry.applications.handlebars.renderTemplate(
        "systems/spacefucked/templates/chat/search-card.hbs",
        { hits, tableRowRoll, item, rollHTML }
    );

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content,
        rolls: [roll],
        sound: CONFIG.sounds.dice
    });
}

export  async function performRoll(actor) {

        const dialogContent = await foundry.applications.handlebars.renderTemplate(
            "systems/spacefucked/templates/chat/roll-dialog.hbs",
        )
        const result = await DialogV2.prompt({
            window: {title: `Roll Check`},
            classes: ["spacefucked-roll-dialog"],
            content: dialogContent,
            render: (event, dialog) => {
                const form = dialog.element.querySelector("form");
                const statInput = form.elements.stat;
                const desperationInput = form.elements.desperation;
                const advantageInput = form.elements.advantage;
                const disadvantageInput = form.elements.disadvantage;
                const poolValueEl = form.querySelector(".pool-value")

                const statButtons = form.querySelectorAll(".toggle-btn");
                const counterButtons = form.querySelectorAll(".counter-btn");

                function updatePool() {
                    const stat = statInput.value;
                    const statValue = stat !== "none" ? (actor.system.stats[stat]?.value ?? 0) : 0;
                    const desperation = desperationInput.checked ? 2 : 0;
                    const advantage = Number(advantageInput.value) || 0;
                    const disadvantage = Number(disadvantageInput.value) || 0;
                    const pool = Math.max(1 + statValue + desperation + advantage - disadvantage, 0);
                    poolValueEl.textContent = pool;
                }

                statButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        const clickedStat = btn.dataset.stat;
                        if (statInput.value === clickedStat){
                            statInput.value = "none";
                            btn.classList.remove("active");
                        } else {
                            statInput.value = clickedStat;
                            statButtons.forEach(b => b.classList.remove("active"));
                            btn.classList.add("active");
                        }
                        updatePool();
                    });
                });

                desperationInput.addEventListener("change", updatePool);

                counterButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        const counter = btn.dataset.counter;
                        const delta = Number(btn.dataset.delta);
                        const input = counter === "advantage" ? advantageInput : disadvantageInput;
                        const valueEl = form.querySelector(`[data-counter-value="${counter}"]`);
                        const newValue = Math.max(0, Number(input.value) + delta);
                        input.value = newValue;
                        valueEl.textContent = newValue;
                        updatePool();
                    });
                });

                updatePool();

            },
            ok: {
                label: "Roll",
                callback: (event, button) => ({
                    stat: button.form.elements.stat.value,
                    desperation: button.form.elements.desperation.checked,
                    advantage: Number(button.form.elements.advantage.value) || 0,
                    disadvantage: Number(button.form.elements.disadvantage.value) || 0
                })
            }
        });
        
        if (!result) return;

        const statValue = result.stat !== "none" ? actor.system.stats[result.stat].value : 0;
        const pool = Math.max(1 + statValue + (result.desperation ? 2: 0) + result.advantage - result.disadvantage, 0);

        const formula = pool === 0 ? "2d6kl" : `${pool}d6`;

        const roll = new Roll(formula);
        await roll.evaluate();

        const dieTerm = roll.terms.find(t => Array.isArray(t.results));
        const hits = dieTerm.results.filter(r => r.active && r.result >= 5).length;

        let outcome, outcomeClass;
        if (hits === 0) {outcome = "SPACEFUCKED.RollFailure"; outcomeClass = "failure"}
        else if (hits <= 2) {outcome = "SPACEFUCKED.RollPyrrhic"; outcomeClass = "pyrrhic"}
        else {outcome = "SPACEFUCKED.RollSuccess"; outcomeClass = "success"}
        
        const rollHTML = await roll.render();

        const templateData = {
            outcome,
            outcomeClass,
            hits,
            rollHTML
        };

        const content = await foundry.applications.handlebars.renderTemplate(
            "systems/spacefucked/templates/chat/roll-card.hbs",
            templateData
        );

        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content,
            rolls: [roll],
            sound: CONFIG.sounds.dice,
        });
}

