<template>
  <div id="editor">
    <div class="column">
      <list :items="peerTeachers" @selection-changed="handlePtClick" #default="pt">
        {{ pt.item.name }} <button @click.stop="deletePeerTeacher(pt.item.id)">X</button>
      </list>
    </div>
    <div class="column">
      <list :items="compatibleLabs" #default="lab">
        {{ lab.item.fullInfo }} <button @click.stop="assignLab(lab.item.id)">+</button>
      </list>
    </div>
    <div class="column">
      <list :items="selectedPeerTeacherAssignments" #default="lab">
        {{ lab.item.fullInfo }} <button @click.stop="unassignLab(lab.item.id)">X</button>
      </list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import List from '@/components/List.vue';
import PeerTeacher from '@/models/PeerTeacher';
import Lab from '@/models/Lab';

export default defineComponent({
  name: 'EditorLists',
  components: {
    List,
  },
  props: {
    peerTeachers: {
      type: Array as PropType<PeerTeacher[]>,
      default: [],
    },
    labs: {
      type: Array as PropType<Lab[]>,
      default: [],
    },
  },
  computed: {
    compatibleLabs(): Lab[] {
      const temp = this.labs.filter((lab) => (!this.selectedPeerTeacher.assignedLabs.has(lab.id)
        && !this.selectedPeerTeacher.conflictsWith(lab.event)));

      const currentAssignments = this.selectedPeerTeacherAssignments;
      return temp.filter((lab) => !currentAssignments
        .some((assignedLab) => lab.event.conflictsWith(assignedLab.event)));
    },
    selectedPeerTeacherAssignments(): Lab[] {
      return Array.from(this.selectedPeerTeacher.assignedLabs.values())
        .flatMap((id) => {
          const lab = this.$store.state.labs.get(id);
          return (lab === undefined) ? [] : [lab];
        }).sort((a, b) => {
          if (a.course < b.course) {
            return -1;
          }
          if (b.course < a.course) {
            return 1;
          }

          if (a.section < b.section) {
            return -1;
          }
          if (b.section < a.section) {
            return 1;
          }

          return 0;
        });
    },
  },
  data() {
    return {
      selectedPeerTeacher: new PeerTeacher(),
    };
  },
  methods: {
    handlePtClick(peerTeacher: PeerTeacher) {
      this.selectedPeerTeacher = peerTeacher;
    },
    deletePeerTeacher(id: number) {
      if (this.selectedPeerTeacher.id === id) {
        this.selectedPeerTeacher = new PeerTeacher();
      }
      this.$store.commit('deletePeerTeacher', id);
    },
    assignLab(id: string) {
      if (this.selectedPeerTeacher.id !== 0) {
        this.selectedPeerTeacher.assignedLabs.add(id);
      }
    },
    unassignLab(id: string) {
      this.selectedPeerTeacher.assignedLabs.delete(id);
    },
  },
});
</script>

<style>
#editor {
  display: flex;
  max-height: inherit;
}

.column {
  flex: 1;
  overflow: auto;
}
</style>
