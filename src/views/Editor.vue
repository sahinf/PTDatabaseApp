<template>
  <div id="home">
    <action-bar />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import List from '@/components/List.vue';
import PeerTeacher from '@/models/PeerTeacher';
import Lab from '@/models/Lab';

export default defineComponent({
  name: 'Editor',
  components: {
    ActionBar,
    List,
  },
  computed: {
    labs(): Lab[] {
      return Array.from(this.$store.state.labs.values()).sort((a, b) => a.id
        .localeCompare(b.id));
    },
    peerTeachers(): PeerTeacher[] {
      return Array.from(this.$store.state.peerTeachers.values()).sort((a, b) => a.lastname
        .toUpperCase().localeCompare(b.lastname.toUpperCase()));
    },
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
#home {
  max-height: inherit;
}

#editor {
  display: flex;
  max-height: inherit;
}

.column {
  flex: 1;
  overflow: auto;
}
</style>
