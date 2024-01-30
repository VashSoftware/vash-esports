<script lang="ts">
  export let data;
</script>

<h1 class="py-5">Manage {data.event.name}</h1>

<div class="py-2">
  <h2>General</h2>
  <form method="POST">
    <label>
      Organisation
      <select name="name">
        {#each data.organisations as organisation}
          <option value={organisation.id}>{organisation.name}</option>
        {/each}
      </select>
    </label>

    <label>
      Name:
      <input type="text" name="name" value={data.event.name} />
    </label>

    <label>
      Start Time:
      <input
        type="datetime-local"
        name="startTime"
        value={new Date(data.event.created_at).toISOString().substring(0, 16)}
      />
    </label>

    <button type="submit">Save Changes</button>
  </form>
</div>

<div class="py-2">
  <div class="row">
    <h2 class="col">Staff Members ({data.staffMembers.length})</h2>
    <div class="col">
      <button class="btn btn-primary">Add Staff Members</button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Roles</th>
        </tr>
      </thead>
      <tbody>
        {#each data.staffMembers as staffMember}
          <tr class="">
            <td>{staffMember.user_profiles.name}</td>
            <td>{staffMember.roles}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="py-2">
  <div class="row">
    <h2 class="col">Rounds ({data.rounds.length})</h2>
    <div class="col">
      <button class="btn btn-primary">Add Rounds</button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Map Pool</th>
          <th scope="col">Column 3</th>
        </tr>
      </thead>
      <tbody>
        {#each data.rounds as round}
          <tr>
            <td>{round.name}</td>
            <td>
              <a href="/map-pools/{round.map_pool_id}">{round.map_pool}</a>
            </td>
            <td>{round.map_pool}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<div class="py-2">
  <div class="row">
    <div class="col">
      <h2>Participants ({data.participants.length})</h2>
    </div>

    <div class="col">
      <button class="btn btn-primary">Invite Teams</button>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Registered On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.participants as participant}
          <tr>
            <td>{participant.teams.name}</td>
            <td>{new Date(participant.created_at).toLocaleString()}</td>
            <td>
              <button class="btn btn-danger">Disqualify</button>
              <button class="btn btn-secondary">Manage</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
