import { createStore } from 'vuex';

export default createStore({
  state: {
    labs: new Map(),
    peerTeachers: new Map(),
  },
  mutations: {
    setLabs(state, labs) {
      state.labs = labs;
    },
    setPeerTeachers(state, peerTeachers) {
      state.peerTeachers = peerTeachers;
    },
    importLabs(state, labs) {
      state.labs.clear();
      labs.forEach((lab) => {
        state.labs.set(lab.id, lab);
      });
    },
    addPeerTeachers(state, peerTeachers) {
      peerTeachers.forEach((pt) => {
        state.peerTeachers.set(pt.id, pt);
      });
    },
    deletePeerTeacher(state, id) {
      state.peerTeachers.delete(id);
    },
  },
  actions: {
  },
  modules: {
  },
});
