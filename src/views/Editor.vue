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

<script>
import ActionBar from '@/components/ActionBar.vue';
import List from '@/components/List.vue';
import PeerTeacher from '@/models/PeerTeacher';

export default {
  name: 'Editor',
  components: {
    ActionBar,
    List,
  },
  computed: {
    labs() {
      return Array.from(this.$store.state.labs.values()).sort((a, b) => a.id
        .localeCompare(b.id));
    },
    peerTeachers() {
      return Array.from(this.$store.state.peerTeachers.values()).sort((a, b) => a.lastname
        .toUpperCase().localeCompare(b.lastname.toUpperCase()));
    },
    compatibleLabs() {
      const temp = this.labs.filter((lab) => (!this.selectedPeerTeacher.assignedLabs.has(lab.id)
        && !this.selectedPeerTeacher.conflictsWith(lab.event)));

      const currentAssignments = this.selectedPeerTeacherAssignments;
      return temp.filter((lab) => {
        let compatible = true;
        currentAssignments.every((assignedLab) => {
          if (lab.event.conflictsWith(assignedLab.event)) {
            compatible = false;
            return false;
          }
          return true;
        });
        return compatible;
      });
    },
    selectedPeerTeacherAssignments() {
      return [...this.selectedPeerTeacher.assignedLabs.values()].map((id) => this.$store.state.labs
        .get(id)).sort((a, b) => {
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
    handlePtClick(peerTeacher) {
      this.selectedPeerTeacher = peerTeacher;
    },
    deletePeerTeacher(id) {
      if (this.selectedPeerTeacher.id === id) {
        this.selectedPeerTeacher = new PeerTeacher();
      }
      this.$store.commit('deletePeerTeacher', id);
    },
    assignLab(id) {
      if (this.selectedPeerTeacher.id !== 0) {
        this.selectedPeerTeacher.assignedLabs.add(id);
      }
    },
    unassignLab(id) {
      this.selectedPeerTeacher.assignedLabs.delete(id);
    },
  },
};
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
