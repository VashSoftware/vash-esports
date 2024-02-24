<script lang="ts">
  export let data;
</script>

<h1 class="my-3">{data.organisation.name}</h1>

<h2>Members</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
    </thead>
    <tbody>
      {#each data.organisation.organisation_members as member}
        <tr>
          <td> {member.user_profiles.name}</td>
          <td>R1C2</td>
          <td>R1C3</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<h2>Events</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
    </thead>
    <tbody>
      {#each data.organisation.events as event}
        <tr>
          <td> {event.name}</td>
          <td>R1C2</td>
          <td>R1C3</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<h2>Event Groups</h2>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
    </thead>
    <tbody>
      {#each data.organisation.event_groups as event_group}
        <tr>
          <td> {event_group.name}</td>
          <td>R1C2</td>
          <td>R1C3</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
