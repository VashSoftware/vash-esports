<script lang="ts">
  export let data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Offline":
        return "🔴";
      case "Online":
        return "🟡";
      case "Joined":
        return "🟢";
      case "Ready":
        return "✅";
      case "Playing":
        return "🎮";
    }
  };
</script>

<div class="my-5">
  <div class="row my-5">
    <div class="col">
      <h2 class="text-center">
        {data.match.match_participants[0].participants.teams.name}
      </h2>

      <div class="d-flex gap-3">
        {#each data.match.match_participants[0].match_participant_players as player}
          <div class="card col p-2">
            <div class="row">
              <div class="col">{player.team_members.user_profiles.name}</div>
              <div class="col text-end">
                {player.status}
                {getStatusIcon(player.status)}
              </div>
            </div>
          </div>
        {/each}
        {#each data.match.match_participants[0].match_participant_players as player}
          <div class="card col p-2">
            <div class="row">
              <div class="col">{player.team_members.user_profiles.name}</div>
              <div class="col text-end">
                {player.status}
                {getStatusIcon(player.status)}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="col text-center">1-1</div>
    <div class="col text-end">
      <h2 class="text-center">
        {data.match.match_participants[1].participants.teams.name}
      </h2>

      {#each data.match.match_participants[1].match_participant_players as player}
        <div class="card">
          <div class="row">
            <div class="col text-start">
              {player.team_members.user_profiles.name}
            </div>
            <div class="col">
              {player.status}
              {getStatusIcon(player.status)}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <h2 class="my-5">Phase 0: Preparation</h2>
  - Waiting for players - Count current players - Bans

  <h2 class="my-5">Phase 1: Playing</h2>
  <h2>Map pool</h2>
  {#each data.match.rounds.map_pools.map_pool_maps as map}
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="" class="img-fluid rounded-start" alt="..." />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              {map.maps.mapsets.artist} - {map.maps.mapsets.title}
            </h5>
            <button class="btn btn-primary">Pick</button>
            <button class="btn btn-danger">Ban</button>
          </div>
        </div>
      </div>
    </div>
  {/each}

  <h2 class="my-5">Phase 3: Finishing</h2>
</div>
