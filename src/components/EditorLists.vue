<template>
  <div id="editor-lists">
    <div class="column">
      <h3 class="column-header">Peer Teachers</h3>
      <List :items="peerTeachers" @selection-changed="handlePtClick" #default="pt">
        <span class="list-item">
          {{ pt.item.name }} <button @click.stop="deletePeerTeacher(pt.item.id)">x</button>
        </span>
      </List>
    </div>
    <div class="column">
      <h3 class="column-header">Labs</h3>
      <List :items="compatibleLabs" #default="lab">
        <span class="list-item">
          {{ lab.item.fullInfo }} <button @click.stop="assignLab(lab.item.id)">+</button>
        </span>
      </List>
    </div>
    <div class="column">
      <h3 class="column-header">{{ this.selectedPeerTeacher.name }}</h3>
      <List :items="selectedPeerTeacherAssignments" #default="lab">
        <span class="list-item">
          {{ lab.item.fullInfo }} <button @click.stop="unassignLab(lab.item.id)">x</button>
        </span>
      </List>
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
        }).sort((a, b) => a.course - b.course || a.section - b.section);
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
#editor-lists {
  display: flex;
  max-height: inherit;
  min-height: 0;
}

.column-header {
  margin: 0;
}

.column {
  flex: 1;
  overflow: auto;
}

.list-item {
  align-items: center;
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-between;
  margin: 0.5em;
  padding: 0.5em;
}

.list-item:hover {
  background-color: #c0c0c0;
}

.list-item > button {
  background-color: #500000;
  border: none;
  color: white;
  font-size: 1em;
}

@media (prefers-color-scheme: dark) {
  .column-header {
    color: white;
  }

  .list-item {
    background-color: #303030;
    color: white;
  }

  .list-item:hover {
    background-color: #707070;
  }

  .list-item > button {
    background-color: #81302b;
  }
}
</style>
