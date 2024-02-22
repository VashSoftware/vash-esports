<script lang="ts">
  import { enhance } from "$app/forms";

  export let event;
  export let teams;
</script>

<form action="/?/register" method="post" use:enhance>
  <div
    class="modal fade"
    id="registerEvent-{event.id}-Modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Register for {event?.name}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="modal-body text-center d-flex justify-content-center align-items-center gap-3"
        >
          <input type="hidden" name="event-id" value={event?.id} />

          <label for="team-id">Team</label>
          <select style="max-width: 15em;" class="form-select" name="team-id"
            >{#each teams as team}
              <option value={team.id}>{team.name}</option>
            {/each}
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal"
            >Save changes</button
          >
        </div>
      </div>
    </div>
  </div>
</form>
