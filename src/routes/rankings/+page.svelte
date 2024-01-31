<script lang="ts">
  import { goto } from "$app/navigation";

  export let data;
</script>

<div class="py-5 text-center">
  <h1>Rankings</h1>

  <ul
    class="nav nav-pills justify-content-center"
    id="pills-tab"
    role="tablist"
  >
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="pills-home-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-users"
        type="button"
        role="tab"
        aria-controls="pills-home"
        aria-selected="true">Users</button
      >
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-profile-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-teams"
        type="button"
        role="tab"
        aria-controls="pills-profile"
        aria-selected="false">Teams</button
      >
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="pills-profile-tab"
        data-bs-toggle="pill"
        data-bs-target="#tab-pane-organisations"
        type="button"
        role="tab"
        aria-controls="pills-profile"
        aria-selected="false">Organisations</button
      >
    </li>
  </ul>
</div>

<div class="tab-content" id="pills-tabContent">
  <div
    class="tab-pane fade show active"
    id="tab-pane-users"
    role="tabpanel"
    aria-labelledby="pills-home-tab"
    tabindex="0"
  >
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Matches Played</th>
          <th scope="col">Rating</th>
        </tr>
      </thead>
      <tbody>
        {#each data.userRatings as userRating, i}
          <tr role="button" on:click={() => goto(`/users/${userRating.id}`)}>
            <td>{i + 1}</td>
            <td>{userRating.user_profiles.name}</td>
            <td>{data.matchesPlayed.length}</td>
            <td>{userRating.rating}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div
    class="tab-pane fade"
    id="tab-pane-teams"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Events Played</th>
        </tr>
      </thead>
      <tbody>
        {#each data.teams as team, i}
          <tr role="button" on:click={() => goto(`/teams/${team.id}`)}>
            <td>{i + 1}</td>
            <td>{team.name}</td>
            <td>{team.participants[0].count}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div
    class="tab-pane fade"
    id="tab-pane-organisations"
    role="tabpanel"
    aria-labelledby="pills-profile-tab"
    tabindex="0"
  >
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Events Hosted</th>
        </tr>
      </thead>
      <tbody>
        {#each data.organisations as organisation, i}
          <tr role="button" on:click={() => goto(`/teams/${organisation.id}`)}>
            <td>{i + 1}</td>
            <td>{organisation.name}</td>
            <td>{organisation.events[0].count}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
