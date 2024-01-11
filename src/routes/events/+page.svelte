<script lang="ts">
    export let data;
</script>

<div class="row">
    <div class="col-10">
        <h1>Events</h1>
    </div>
    <div class="col-2">
        <a href="/events/create">
            <button class="btn btn-primary">
                Create Event
            </button>
        </a>
    </div>
</div>

<table class="table table-striped">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Registrations</th>
            <th scope="col">Register</th>
        </tr>
    </thead>
    <tbody>
        {#each data.events as event}
            <tr>
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{event.registrations?.length}/{event.maxRegistrations}</td>
                <td>
                    <a href="/events/{event.id}/register">
                        <button class="btn btn-primary">Register</button>
                    </a>
                </td>
            </tr>
        {/each}
    </tbody>
</table>