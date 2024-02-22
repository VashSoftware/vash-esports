<script lang="ts">
  import { goto } from "$app/navigation";
  import RegisterButton from "../../components/registerButton.svelte";

  export let data;

  const isActive = () => {
    return true;
  };
</script>

<div class="row py-5">
  <div class="col">
    <h1>Events ({data.events.length})</h1>
  </div>
  <div class="col text-end">
    <a href="/events/create">
      <button class="btn btn-primary btn-lg"> Create Event </button>
    </a>
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
          <td role="button" on:click={() => goto(`/events/${event.id}`)}
            >{event.name}</td
          >
          <td role="button" on:click={() => goto(`/events/${event.id}`)}
            >{event.participants.length} / {event.max_registrations
              ? event.max_registrations
              : "∞"}</td
          >
          <td class="col-1">
            <RegisterButton {event} teams={data.teams} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <form method="POST">
    <nav aria-label="Event pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <button type="submit" class="page-link">Previous</button>
        </li>
        {#each [1, 2, 3, 4, 5] as tab}
          <li class="page-item">
            <button type="submit" class="page-link {isActive() ? 'active' : ''}"
              >{tab}</button
            >
          </li>
        {/each}
        <li class="page-item">
          <button type="submit" class="page-link">Next</button>
        </li>
      </ul>
    </nav>
  </form>
</div>
