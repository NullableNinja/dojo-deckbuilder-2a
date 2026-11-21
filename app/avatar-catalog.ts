import baronVonBackflipUrl from "./assets/characters/core-roster/baron-von-backflip.webp";
import blurryMonkUrl from "./assets/characters/core-roster/blurry-monk.webp";
import booFuUrl from "./assets/characters/core-roster/boo-fu.webp";
import centuryBobUrl from "./assets/characters/core-roster/century-bob.webp";
import coachKarenUrl from "./assets/characters/core-roster/coach-karen.webp";
import crashTestDummyUrl from "./assets/characters/core-roster/crash-test-dummy.webp";
import discoDojoDanUrl from "./assets/characters/core-roster/disco-dojo-dan.webp";
import doodleBopperUrl from "./assets/characters/core-roster/doodle-bopper.webp";
import dopplebopperUrl from "./assets/characters/core-roster/dopplebopper.webp";
import flamingMonkDudeBroskiUrl from "./assets/characters/core-roster/flaming-monk-dude-broski.webp";
import glitterpunchUrl from "./assets/characters/core-roster/glitterpunch.webp";
import honorableTrashPandaUrl from "./assets/characters/core-roster/honorable-trash-panda.webp";
import inkFistUrl from "./assets/characters/core-roster/ink-fist.webp";
import janitorJoeUrl from "./assets/characters/core-roster/janitor-joe.webp";
import karatesaurusUrl from "./assets/characters/core-roster/karatesaurus.webp";
import masterMimefuUrl from "./assets/characters/core-roster/master-mimefu.webp";
import missDirectionUrl from "./assets/characters/core-roster/miss-direction.webp";
import paperCrainUrl from "./assets/characters/core-roster/paper-crain.webp";
import punchlinePeteUrl from "./assets/characters/core-roster/punchline-pete.webp";
import sleepyChadUrl from "./assets/characters/core-roster/sleepy-chad.webp";
import beltCollectorUrl from "./assets/characters/core-roster/the-belt-collector.webp";
import nerfhammerUrl from "./assets/characters/core-roster/the-nerfhammer.webp";
import rebooterUrl from "./assets/characters/core-roster/the-rebooter.webp";
import elPolloRojoUrl from "./assets/characters/el-pollo-rojo.webp";
import mrBobbyUrl from "./assets/characters/mr-bobby.webp";
import senseiDucktapeUrl from "./assets/characters/sensei-ducktape.webp";
import waveyDaveyUrl from "./assets/characters/wavey-davey.webp";
import type { AvatarKey } from "./user-preferences";

export const AVATAR_IMAGES: Record<AvatarKey, string> = {
  "baron-von-backflip": baronVonBackflipUrl,
  "blurry-monk": blurryMonkUrl,
  "boo-fu": booFuUrl,
  "century-bob": centuryBobUrl,
  "coach-karen": coachKarenUrl,
  "crash-test-dummy": crashTestDummyUrl,
  "disco-dojo-dan": discoDojoDanUrl,
  "doodle-bopper": doodleBopperUrl,
  dopplebopper: dopplebopperUrl,
  "flaming-monk-dude-broski": flamingMonkDudeBroskiUrl,
  glitterpunch: glitterpunchUrl,
  "honorable-trash-panda": honorableTrashPandaUrl,
  "ink-fist": inkFistUrl,
  "janitor-joe": janitorJoeUrl,
  karatesaurus: karatesaurusUrl,
  "master-mimefu": masterMimefuUrl,
  "miss-direction": missDirectionUrl,
  "paper-crain": paperCrainUrl,
  "punchline-pete": punchlinePeteUrl,
  "sleepy-chad": sleepyChadUrl,
  "the-belt-collector": beltCollectorUrl,
  "the-nerfhammer": nerfhammerUrl,
  "the-rebooter": rebooterUrl,
  "el-pollo-rojo": elPolloRojoUrl,
  "mr-bobby": mrBobbyUrl,
  "sensei-ducktape": senseiDucktapeUrl,
  "wavey-davey": waveyDaveyUrl,
};

export const AVATAR_OPTIONS: Array<{ id: AvatarKey; label: string; quip: string }> = [
  ["honorable-trash-panda", "Honorable Trash Panda", "Fights with honor. Mostly."],
  ["karatesaurus", "Karatesaurus", "Extinction-level kicks."],
  ["janitor-joe", "Janitor Joe", "Mop-Fu specialist."],
  ["miss-direction", "Miss Direction", "Points somewhere else."],
  ["baron-von-backflip", "Baron von Backflip", "The cape is a procedural risk."],
  ["blurry-monk", "Blurry Monk", "Already moved. Probably."],
  ["boo-fu", "Boo-Fu", "Haunts the reaction window."],
  ["century-bob", "Century Bob", "A very patient punch."],
  ["coach-karen", "Coach Karen", "Would like to speak to your stance."],
  ["crash-test-dummy", "Crash Test Dummy", "Safety is a theory."],
  ["disco-dojo-dan", "Disco Dojo Dan", "The groove has priority."],
  ["doodle-bopper", "Doodle Bopper", "Draws outside the combat zone."],
  ["dopplebopper", "Dopplebopper", "Twice the paperwork."],
  ["flaming-monk-dude-broski", "Flaming Monk Dude Broski", "Please do not lick the aura."],
  ["glitterpunch", "Glitterpunch", "Sparkles with intent."],
  ["ink-fist", "Ink Fist", "Signs every impact."],
  ["master-mimefu", "Master Mime-Fu", "The wall is undefeated."],
  ["paper-crain", "Paper Crain", "Folds under pressure."],
  ["punchline-pete", "Punchline Pete", "The setup is always suspicious."],
  ["sleepy-chad", "Sleepy Chad", "Power nap. Then power nap."],
  ["the-belt-collector", "The Belt Collector", "Please remain belt-aware."],
  ["the-nerfhammer", "The Nerfhammer", "Soft impact. Hard feelings."],
  ["the-rebooter", "The Rebooter", "Have you tried turning it off?"],
  ["el-pollo-rojo", "El Pollo Rojo", "A spicy administrative presence."],
  ["mr-bobby", "Mr. Bobby", "No relation to the filing cabinet."],
  ["sensei-ducktape", "Sensei Ducktape", "Holds the whole dojo together."],
  ["wavey-davey", "Wavey Davey", "The stance is technically fluid."],
].map(([id, label, quip]) => ({ id: id as AvatarKey, label, quip }));

