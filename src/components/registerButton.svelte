<script>
  import { tooltip } from "$lib/bootstrapTooltip";
  import RegisterModal from "./registerModal.svelte";

  export let event;
  export let teams;
</script>

{#if event?.disabled}
  <div use:tooltip data-bs-title={event?.disabledMessage}>
    <button class="btn btn-primary" disabled={true}>Register</button>
  </div>
{:else}
  <button
    data-bs-toggle="modal"
    data-bs-target="#registerEvent-{event.id}-Modal"
    class="btn btn-primary">Register</button
  >
{/if}

<RegisterModal {event} {teams} />
