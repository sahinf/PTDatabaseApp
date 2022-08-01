<script lang="ts">
    import { ptStore } from "../stores";
    import type PeerTeacher from "../models/PeerTeacher";

    $: peerTeachers = [...$ptStore.values()].sort((a, b) =>
        a.lastname.toUpperCase() === b.lastname.toUpperCase()
            ? a.firstname.toUpperCase().localeCompare(b.firstname.toUpperCase())
            : a.lastname.toUpperCase().localeCompare(b.lastname.toUpperCase())
    );

    function getCourses(pt: PeerTeacher) {
        const courses = new Map<number, number[]>();
        const getCourse = (x: number) => Math.floor(x / 1000);
        pt.labs.forEach((lab_id) => {
            const key = getCourse(lab_id);
            const sec = lab_id % 1000;
            if (courses.has(key)) {
                courses.get(key).push(sec);
            } else {
                courses.set(key, [sec]);
            }
        });
        pt.can_teach.forEach((course) => {
            if (course == null || course == undefined) return;
            if (!courses.has(course)) courses.set(course, []);
        });
        return courses;
    }
</script>

<div
    class="flex flex-col overflow-y-auto h-full overflow-x-hidden mx-[25%] pt-10"
>
    {#each peerTeachers as pt}
        <div class="h-40">
            <hr />
            <p>
                <img
                    class="float-right"
                    alt={pt?.name}
                    src={pt?.drive_pic}
                    width="100"
                    height="125"
                />
            </p>
            <h1 class="text-xl font-bold">
                {pt?.name} |
                <a
                    href="mailto:{pt.email}"
                    rel="noopener"
                    target="_blank"
                    title="${pt?.name} email"
                >
                    Email {pt?.firstname}
                </a>
            </h1>
            {#if pt?.labs.size > 0}
                <p>
                    <strong class="text-lg">Courses:</strong>
                </p>
                <ul class="text-lg">
                    {#each Array.from(getCourses(pt)) as lab}
                        <li>
                            CSCE {lab[0]} - {lab[1]}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    {/each}
</div>
