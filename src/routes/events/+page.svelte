<script lang="ts">
  import { goto } from "$app/navigation";
  import { tooltip } from "$lib/bootstrapTooltip";
  import RegisterButton from "../../components/registerButton.svelte";

  export let data;
</script>

<div class="row py-5">
  <div class="col">
    <h1>Events ({data.eventsCount})</h1>
  </div>
  <div class="col text-end">
    <button
      data-bs-toggle="modal"
      data-bs-target="#createEventModal"
      class="btn btn-success btn-lg"
    >
      Create Event
    </button>
  </div>
</div>

<div>
  <table class="table-striped table table-hover">
    <thead>
      <tr>
        <th scope="col">Organisation</th>
        <th scope="col">Name</th>
        <th scope="col">Registrations</th>
        <th scope="col">Register</th>
      </tr>
    </thead>
    <tbody>
      {#each data.events as event}
        <tr>
          <td role="button" on:click={() => goto(`/events/${event.id}`)}
            >{event.organisations?.name}</td
          >
          <td role="button" on:click={() => goto(`/events/${event.id}`)}>
            {#if event.event_groups}<b>{event.event_groups?.name}</b>
            {/if}{event.name}</td
          >
          <td role="button" on:click={() => goto(`/events/${event.id}`)}
            >{event.participants.length} / {event.event_options
              .max_registrations
              ? event.event_options.max_registrations
              : "∞"}</td
          >
          <td class="col-1">
            <RegisterButton {event} teams={data.teams} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <nav aria-label="Event pagination">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <button type="submit" class="page-link">Previous</button>
      </li>
      {#each new Array(Math.floor(data.eventsCount / 10 + 1)) as tab, i}
        <li class="page-item">
          <a
            href="?page={i + 1}"
            class="page-link {() =>
              i + 1 == Math.floor(data.eventsCount / 10 + 1) ? 'active' : ''}"
            >{i + 1}</a
          >
        </li>
      {/each}
      <li class="page-item">
        <button type="submit" class="page-link">Next</button>
      </li>
    </ul>
  </nav>
</div>

<form action="?/createEvent" method="post">
  <div
    class="modal fade"
    id="createEventModal"
    tabindex="-1"
    aria-labelledby="createEventModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Event</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="organisation-id" class="form-label">Organisation</label>
            <select
              class="form-select"
              aria-label="Default select example"
              name="organisation-id"
            >
              {#each data.organisations as organisation}<option
                  value={organisation.id}>{organisation.name}</option
                >{/each}
            </select>
          </div>

          <div class="mb-3">
            <label for="event-group-id" class="form-label">Event Group</label>
            <select
              class="form-select"
              aria-label="Default select example"
              name="event-group-id"
            >
              <option>None</option>
              {#each data.eventGroups as eventGroup}<option
                  value={eventGroup.id}>{eventGroup.name}</option
                >{/each}
            </select>
          </div>

          <label for="game-id" class="form-label">Game</label>
          <div class="input-group mb-3">
            <label class="input-group-text" for="game-id"
              ><img
                height="32"
                src={data.games[0].logo}
                alt="Game icon"
              /></label
            >
            <select
              use:tooltip
              name="game-id"
              class="form-select"
              id="game-id"
              disabled
              data-bs-title="More games coming soon"
            >
              {#each data.games as game}
                <option value={game.id}>{game.name}</option>
              {/each}
            </select>
          </div>

          <div class="mb-3">
            <label for="event-name" class="form-label">Name</label>
            <input
              id="event-name"
              type="text"
              class="form-control"
              name="event-name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="event-description" class="form-label">Description</label
            >
            <textarea
              id="event-name"
              class="form-control"
              name="event-description"
            />
          </div>

          <div class="form-text">
            We'll need more configuration later to start the event.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Create Event</button>
        </div>
      </div>
    </div>
  </div>
</form>
