import Lab from '@/models/Lab';
import PeerTeacher from '@/models/PeerTeacher';
import { createStore } from 'vuex';

export default createStore({
  state: {
    labs: new Map(),
    peerTeachers: new Map(),
  },
  mutations: {
    setLabs(state, labs: Map<string, Lab>) {
      state.labs = labs;
    },
    setPeerTeachers(state, peerTeachers: Map<number, PeerTeacher>) {
      state.peerTeachers = peerTeachers;
    },
    importLabs(state, labs: Lab[]) {
      state.labs.clear();
      labs.forEach((lab) => {
        state.labs.set(lab.id, lab);
      });
    },
    addPeerTeachers(state, peerTeachers: PeerTeacher[]) {
      peerTeachers.forEach((pt) => {
        state.peerTeachers.set(pt.id, pt);
      });
    },
    deletePeerTeacher(state, id: number) {
      state.peerTeachers.delete(id);
    },
  },
  actions: {
  },
  modules: {
  },
});
