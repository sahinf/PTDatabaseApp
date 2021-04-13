import { Store } from 'vuex';

import PeerTeacher from './models/PeerTeacher';
import Lab from './models/Lab';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    peerTeachers: Map<number, PeerTeacher>,
    labs: Map<string, Lab>
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
