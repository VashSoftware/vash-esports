<script lang="ts">
  export let data;

  const isActive = () => {
    return true;
  }
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
  <table class="table-striped table">
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
          <td>{event.organisations?.name}</td>
          <td>{event.name}</td>
          <td>{event.participants.length}/{event.maxRegistrations}</td>
          <td>
            <a href="/events/{event.id}/register">
              <button class="btn btn-primary">Register</button>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

<form method="POST">
    <nav aria-label="Event pagination">
        <ul class="pagination justify-content-center">
            <li class="page-item"><button type="submit" class="page-link">Previous</button></li>
            {#each [1,2,3,4,5] as tab}
            <li class="page-item"><button type="submit" class="page-link {isActive() ? 'active' : ''}" >{tab}</button></li>
            {/each}
            <li class="page-item"><button type="submit" class="page-link">Next</button></li>
        </ul>
    </nav>
</form>
</div>
