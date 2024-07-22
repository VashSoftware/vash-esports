<script lang="ts">
  import { enhance } from "$app/forms";
  import { tooltip } from "$lib/bootstrapTooltip";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import DropdownSearch from "./dropdownSearch.svelte";

  export let supabase: SupabaseClient;
  export let ongoingMatch;

  let opponentId;
  let mapPoolId;

  async function getUserId() {
    const user = await supabase.auth.getUser();
    return user.data.user?.id;
  }

  let userId;

  getUserId().then((id) => {
    userId = id;
  });
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

<div
  class="modal modal-lg fade"
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
        <div class="d-flex justify-content-around align-items-center">
          <form action="/?/soloQueue" method="post">
            <div>
              <h3 class="my-4">Solo Queue</h3>

              <button class="btn btn-success">Search</button>
            </div>
          </form>
          <div class="fs-1">|</div>

          <form action="/?/makeQuickMatch" method="post" use:enhance>
            <div>
              <h3 class="my-4">Custom Match</h3>

              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"
                  >Opponent</label
                >
                <input type="hidden" name="sender-id" value={userId} />
                <input type="hidden" name="opponent-id" value={opponentId} />

                <DropdownSearch
                  searchKey="teams"
                  searchColumn="name"
                  selectKey="*, team_members(user_profiles(id, user_id))"
                  filters={[
                    (item) => item.is_personal_team,
                    (item) =>
                      item.team_members[0].user_profiles.user_id !== userId,
                  ]}
                  {supabase}
                  text="Choose an Opponent"
                  selectRowFn={(item) => {
                    opponentId = item.team_members[0].user_profiles.id;
                  }}
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Map Pool</label>
                <div class="d-flex gap-2">
                  <input type="hidden" name="map-pool-id" value={mapPoolId} />
                  <DropdownSearch
                    searchKey="map_pools"
                    selectKey="*"
                    searchColumn="name"
                    {supabase}
                    text="Choose a Map Pool"
                    selectRowFn={(item) => {
                      mapPoolId = item.id;
                    }}
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
                <label for="exampleInputPassword1" class="form-label"
                  >Best of</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="bestOfInput"
                  name="best-of"
                  value="13"
                />
              </div>

              <button class="btn btn-success">Invite</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
