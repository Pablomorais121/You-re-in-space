import { SPACEFUCKED } from "./helpers/config.mjs";
import { SpacefuckedActor } from "./documents/actor.mjs";
import { SpacefuckedItem } from "./documents/item.mjs";
import { SpacefuckedStrugglerSheet } from "./sheets/actor-sheet.mjs";
import { SpacefuckedThreatSheet } from "./sheets/threat-sheet.mjs";
import { SpacefuckedItemSheet } from "./sheets/item-sheet.mjs";
import { openCheckDialog, rollCheck } from "./helpers/dice.mjs";

Hooks.once("init", () => {
  console.log("Spacefucked | Initializing 'You're in Space and Everything's Fucked' fan system prototype");

  CONFIG.SPACEFUCKED = SPACEFUCKED;
  CONFIG.Actor.documentClass = SpacefuckedActor;
  CONFIG.Item.documentClass = SpacefuckedItem;

  // Expose a small API for macros: game.spacefucked.rollCheck(actor), etc.
  game.spacefucked = {
    openCheckDialog,
    rollCheck
  };

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("spacefucked", SpacefuckedStrugglerSheet, {
    types: ["struggler"],
    makeDefault: true,
    label: "SPACEFUCKED.SheetStruggler"
  });
  Actors.registerSheet("spacefucked", SpacefuckedThreatSheet, {
    types: ["threat"],
    makeDefault: true,
    label: "SPACEFUCKED.SheetThreat"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("spacefucked", SpacefuckedItemSheet, {
    makeDefault: true,
    label: "SPACEFUCKED.SheetItem"
  });

  // Handlebars helpers
  Handlebars.registerHelper("sf_range", n => Array.from({ length: n }, (_, i) => i + 1));
  Handlebars.registerHelper("sf_gte", (a, b) => a >= b);
  Handlebars.registerHelper("sf_eq", (a, b) => a === b);
});

Hooks.once("ready", () => {
  console.log("Spacefucked | Ready. This is an unofficial fan-made prototype, not affiliated with Dinoberry Press.");
});
