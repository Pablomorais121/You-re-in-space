import StrugglerData from "./data/actor-struggler.mjs";
import HazardThreatData from "./data/threats/threat-hazard.mjs";
import RobotThreatData from "./data/threats/threat-robot.mjs";
import PersonThreatData from "./data/threats/threat-person.mjs";
import MonsterThreatData from "./data/threats/threat-monster.mjs";

import StrugglerSheet from "./sheets/struggler-sheet.mjs";

Hooks.once("init", () => {
  console.log("Spacefucked | Initializing 'You're in Space and Everything's Fucked' fan system prototype");

  CONFIG.Actor.dataModels.struggler = StrugglerData;
  CONFIG.Actor.dataModels["threat-hazard"] = HazardThreatData;
  CONFIG.Actor.dataModels["threat-robot"] = RobotThreatData;
  CONFIG.Actor.dataModels["threat-person"] = PersonThreatData;
  CONFIG.Actor.dataModels["threat-monster"] = MonsterThreatData;

  const {Actors, Items} = foundry.documents.collections;

  Actors.registerSheet("spacefucked", StrugglerSheet, {
    types: ["struggler"],
    makeDefault: true,
    label: "Struggler Sheet"
  });


});


