<script lang="ts">
  import { enhance } from "$app/forms";
  import { tooltip } from "$lib/bootstrapTooltip";
  import DropdownSearch from "./dropdownSearch.svelte";

  export let supabase;
  export let ongoingMatch;
</script>

<span
  data-bs-title={ongoingMatch ? "You already have an ongoing match." : ""}
  use:tooltip
>
  <button
    type="button"
    class="btn btn-success btn-lg"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    class:disabled={ongoingMatch}
  >
    Quick Match
  </button>
</span>

<form action="/?/makeQuickMatch" method="post" use:enhance>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Quick Match</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Opponent</label
            >
            <DropdownSearch
              searchKey="teams"
              selectKey="*, team_members(user_profiles(id))"
              filters={[(item) => item.is_personal_team]}
              searchColumn="name"
              {supabase}
              text="Choose an Opponent"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Map Pool</label>
            <div class="d-flex gap-2">
              <DropdownSearch
                searchKey="map_pools"
                selectKey="*"
                searchColumn="name"
                {supabase}
                text="Choose a Map Pool"
              />
              <button
                class="btn btn-primary"
                data-bs-target="#createMapPoolModal"
                data-bs-toggle="modal"
                type="button">+</button
              >
            </div>
          </div>

          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Best of</label
            >
            <input
              type="number"
              class="form-control"
              id="bestOfInput"
              name="best-of"
              value="13"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</form>
