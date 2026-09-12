const {DialogV2} = foundry.applications.api;

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

