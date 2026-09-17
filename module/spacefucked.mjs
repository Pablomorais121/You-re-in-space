import StrugglerData from "./data/actor-struggler.mjs";
import HazardThreatData from "./data/threats/threat-hazard.mjs";
import RobotThreatData from "./data/threats/threat-robot.mjs";
import PersonThreatData from "./data/threats/threat-person.mjs";
import MonsterThreatData from "./data/threats/threat-monster.mjs";
import BaseItemData from "./data/items/base-item.mjs";
import WeaponData from "./data/items/weapon.mjs";
import ArmorData from "./data/items/armor.mjs";
import UtilityData from "./data/items/utility.mjs";
import KeyItemData from "./data/items/keyitem.mjs";

import StrugglerSheet from "./sheets/struggler-sheet.mjs";
import HazardSheet from "./sheets/threats/hazard-sheet.mjs";
import RobotSheet from "./sheets/threats/robot-sheet.mjs";
import PersonSheet from "./sheets/threats/person-sheet.mjs";
import MonsterSheet from "./sheets/threats/monster-sheet.mjs";

Hooks.once("init", () => {
  console.log("Spacefucked | Initializing 'You're in Space and Everything's Fucked' ");

  CONFIG.Actor.dataModels.struggler = StrugglerData;
  CONFIG.Actor.dataModels["threat-hazard"] = HazardThreatData;
  CONFIG.Actor.dataModels["threat-robot"] = RobotThreatData;
  CONFIG.Actor.dataModels["threat-person"] = PersonThreatData;
  CONFIG.Actor.dataModels["threat-monster"] = MonsterThreatData;
  CONFIG.Item.dataModels.weapon = WeaponData;
  CONFIG.Item.dataModels.armor = ArmorData;
  CONFIG.Item.dataModels.utility = UtilityData;
  CONFIG.Item.dataModels.keyitem = KeyItemData;


  Handlebars.registerHelper("sf_range", (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
  });
  Handlebars.registerHelper("sf_has", (set, value) => set?.has(value));
  Handlebars.registerHelper("sf_gte", (a, b) => a >= b);
  Handlebars.registerHelper("sf_includes", (arr, value) => Array.isArray(arr) && arr.includes(value));
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("array", (...args) => args.slice(0, -1));

  const {Actors, Items} = foundry.documents.collections;

  Actors.registerSheet("spacefucked", StrugglerSheet, {
    types: ["struggler"],
    makeDefault: true,
    label: "Struggler Sheet"
  });

  Actors.registerSheet("spacefucked", HazardSheet, {
    types: ["threat-hazard"],
    makeDefault: true,
    label: "Hazard Sheet"
  });

  Actors.registerSheet("spacefucked", RobotSheet, {
    types: ["threat-robot"],
    makeDefault: true,
    label: "Robot Sheet"
  });

  Actors.registerSheet("spacefucked", PersonSheet, {
    types: ["threat-person"],
    makeDefault: true,
    label: "Person Sheet"
  });

  Actors.registerSheet("spacefucked", MonsterSheet, {
    types: ["threat-monster"],
    makeDefault: true,
    label: "Monster Sheet"
  });


});


