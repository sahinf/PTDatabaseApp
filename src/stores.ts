import { writable } from "svelte/store";
import type Lab from "./models/Lab";
import type PeerTeacher from "./models/PeerTeacher";

export const ptStore = writable(new Map<number, PeerTeacher>());
export const labStore = writable(new Map<number, Lab>());