<script>
  import { goto } from "$app/navigation";

  export let data;
</script>

<div class="text-center py-5">
  <h1>Vash Esports</h1>
  <h3>Next-Gen gaming tournaments</h3>
</div>

<div class="text-center">
  <h3>Current events:</h3>
</div>
<div class="table-responsive">
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col" class="col-8">Event Name</th>
        <th scope="col" class="col-2 text-center">Registations</th>
        <th scope="col" class="col-2"></th>
      </tr>
    </thead>
    <tbody>
      {#each data.events as event}
        <tr
          role="button"
          class="align-self-center"
          on:click={() => goto(`/events/${event.id}`)}
        >
          <td class="align-middle">{event.name}</td>
          <td class="align-middle text-center"
            >{event.registrations} / {event.maxRegistrations}</td
          >

          <td class="align-middle text-end">
            <a href="/events/{event.id}/register">
              <button
                type="button"
                class="btn btn-primary"
                disabled={!event.registered}>Register</button
              >
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
