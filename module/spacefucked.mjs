import StrugglerData from "./data/actor-struggler.mjs";

import StrugglerSheet from "./sheets/struggler-sheet.mjs";

Hooks.once("init", () => {
  console.log("Spacefucked | Initializing 'You're in Space and Everything's Fucked' fan system prototype");

  CONFIG.Actor.dataModels.struggler = StrugglerData;

  const {Actors, Items} = foundry.documents.collections;

  Actors.registerSheet("spacefucked", StrugglerSheet, {
    types: ["struggler"],
    makeDefault: true,
    label: "Struggler Sheet"
  });


});


