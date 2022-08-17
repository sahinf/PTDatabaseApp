<script lang="ts">
  import type PeerTeacher from "../models/PeerTeacher";
  import type Lab from "../models/Lab";
  import { labStore, ptStore } from "../stores";
  import LabBox from "./helpers/LabBox.svelte";
  import PT from "./helpers/PTBox.svelte";
  import Icon from "./helpers/Icon.svelte";

  let selectedPeerTeacher: PeerTeacher | undefined;
  let selectedLab: Lab | undefined;

  $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
    a.lastname.toUpperCase() === b.lastname.toUpperCase()
      ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
      : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
  );

  $: labs = [...$labStore.values()].sort((a, b) => a.id - b.id);

  $: selectedPtAssignedLabs = [...(selectedPeerTeacher?.labs.values() ?? [])]
    .flatMap((labId) => {
      const lab = $labStore.get(labId);
      return lab === undefined ? [] : [lab];
    })
    .sort((a, b) => a.id - b.id);

  $: unassignedLabs = labs.filter((lab) => !lab.assigned);

  $: compatibleLabs = labs.filter((lab) =>
    isPTandLabCompatible(lab, selectedPeerTeacher)
  );

  $: compatiblePTs = peerTeachers.filter((pt) =>
    isPTandLabCompatible(selectedLab, pt)
  );

  function isPTandLabCompatible(
    lab: Lab | undefined,
    pt: PeerTeacher | undefined
  ): boolean {
    return (
      pt != undefined &&
      lab != undefined &&
      !lab?.assigned &&
      !pt?.conflictsWith(lab.event)
    );
  }

  function updateReactiveDeclarations() {
    selectedPeerTeacher = selectedPeerTeacher;
    selectedLab = selectedLab;
    peerTeachers = peerTeachers;
    labs = labs;
  }

  function assignLab(id: number) {
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = true;
    selectedPeerTeacher?.labs.add(id);
    updateReactiveDeclarations();
  }

  function unassignLab(id: number) {
    const lab = $labStore.get(id);
    if (lab === undefined) return;
    lab.assigned = false;
    selectedPeerTeacher?.labs.delete(id);
    updateReactiveDeclarations();
  }

  // Bad code design! Very similar function to the download function in Labs page.
  // This should be redesigned with more thought instead
  // of automatically encapsulating it in some other file.
  //* NOTE although this outputs a CSV, the csv file might look mangled because
  // we output courses as "course1: labs \n course2: labs \n course3: labs..."
  // The newlines \n cause issues when displaying the csv file, but they look fine
  // when uploaded to Google Sheets thanks to being encompassed by quotes ""
  export function downloadAssignments() {
    console.log("Downloading lab assignments");
    let cols = [
      "First",
      "Last",
      "Courses",
      "Labs",
      "#LH",
      "Office Hours",
      "#OH",
      "Total Hours",
    ];
    let csv = cols.join(",") + "\n";
    peerTeachers.forEach((pt) => {
      let labs = new Array<string>();
      pt.coursesAndLabs().forEach((sections, course) => {
        labs.push(`${course} - ${sections}`);
      });
      let office_hours = new Array<string>();
      pt.office_hours.forEach((e) => {
        office_hours.push(e.info);
      });
      csv +=
        [
          pt.firstname,
          pt.lastname,
          "n/a",
          `"${labs.join("\n")}"`,
          pt.lab_hours,
          `"${[office_hours.join("\n")]}"`,
          pt.office_hours_hours,
          pt.lab_hours + pt.office_hours_hours,
        ].join(",") + "\n";
    });
    console.log("Result of Assignments", csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const anchor = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = "assignments.csv";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  // TODO Figure out way for PT boxes to both be blue if compat labs AND be bordered if selected_pt
</script>

<div
  class="flex-none overflow-hidden flex-col h-[100vh] w-[80vw] px-[2vw] pt-[1vh]"
>
  <!-- Top half: 3 Columns -->
  <div class="flex flex-row h-[80vh]">
    <!-- Peer Teacher -->
    <div class="assign-box rounded-l-xl">
      <div class="assign-box-header">
        <div class="flex flex-row justify-center items-center gap-x-8">
          <div class="flex">Peer Teacher</div>
          <Icon
            class="flex"
            name="download"
            handleClick={downloadAssignments}
          />
        </div>
      </div>
      <div class="assign-box-body">
        {#each peerTeachers as pt}
          <div
            class={compatiblePTs.includes(pt) //selectedPeerTeacher == pt
              ? "bg-info text-info-content" // "border-l-8 border-blue-500"
              : "bg-base-100 text-base-100-content"}
            on:click={() => {
              selectedPeerTeacher = pt;
            }}
          >
            <svelte:component this={PT} {pt} />
          </div>
        {/each}
      </div>
    </div>

    <!-- Available Labs -->
    <div class="assign-box">
      <div class="assign-box-header">Labs: {labs.length}</div>
      <div class="assign-box-body">
        {#each compatibleLabs as lab}
          <svelte:component
            this={LabBox}
            {lab}
            iconName="plus-circle"
            iconClick={() => {
              assignLab(lab.id);
            }}
          />
        {/each}
      </div>
    </div>

    <!-- Selected PT's Labs -->
    <div class="assign-box rounded-r-xl">
      <div class="assign-box-header">
        {selectedPeerTeacher?.name ?? "PT's Labs"}
      </div>
      <div class="assign-box-body">
        {#each selectedPtAssignedLabs as lab}
          <svelte:component
            this={LabBox}
            {lab}
            iconName="minus-circle"
            iconClick={() => {
              unassignLab(lab.id);
            }}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Bottom half: Universal unassigned labs -->
  <div class="flex flex-col mt-2 text-center">
    <h1>Unassigned Labs: {unassignedLabs.length}</h1>
    <ul class="menu menu-horizontal bg-base-100 rounded-box overflow-auto">
      {#each unassignedLabs as lab}
        <li
          on:click={() => {
            selectedLab = lab;
          }}
          class={selectedLab == lab ? "bg-info text-info-content" : ""}
        >
          <span>{lab.course} {lab.section}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>
