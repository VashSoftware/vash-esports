<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
</script>

<h1 class="my-3">{data.organisation.name}</h1>

<div class="my-3">
  <h2>Members</h2>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Rating</th>
          <th>Roles</th>
        </tr>
      </thead>
      <tbody>
        {#each data.organisation.organisation_members as member}
          <tr>
            <td> {member.user_profiles.name}</td>
            <td>1,000</td>
            <td
              >{#each member.organisation_member_roles as role}{role
                  .organisation_roles.name || role.custom_role_name}{/each}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="my-3">
  <h2>Events</h2>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        {#each data.organisation.events as event}
          <tr>
            <td>
              {#if event.event_groups}<b>{event.event_groups?.name}</b>
              {/if}{event.name}</td
            >
            <td>R1C2</td>
            <td>R1C3</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="my-3">
  <div class="d-flex justify-content-between">
    <h2>Event Groups</h2>
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#createEventGroupModal">Create Event Group</button
    >
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.organisation.event_groups as event_group}
          <tr>
            <td>{event_group.name}</td>
            <td class="text-end"
              ><form action="?/deleteEventGroup" method="post" use:enhance>
                <input
                  type="hidden"
                  name="event-group-id"
                  value={event_group.id}
                />
                <button type="submit" class="btn btn-danger"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                    />
                  </svg>
                </button>
              </form></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<form action="?/createEventGroup" method="post" use:enhance>
  <div
    class="modal fade"
    id="createEventGroupModal"
    tabindex="-1"
    aria-labelledby="createEventGroupModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Create Event Group</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name-input" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="name-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</form>

<div
  class="modal fade"
  id="staticBackdrop"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">...</div>
      <div class="modal-footer"></div>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
        >Close</button
      >
      <button type="button" class="btn btn-primary">Understood</button>
    </div>
  </div>
</div>
