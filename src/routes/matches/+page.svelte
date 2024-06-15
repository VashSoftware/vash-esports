<script lang="ts">
  import { goto } from "$app/navigation";
  import QuickPlayButton from "../../components/quickPlayButton.svelte";

  export let data;

  function groupByDate(matches) {
    const groupedMatches = {};
    matches.forEach((match) => {
      const date = new Date(match.created_at).toLocaleDateString();
      if (!groupedMatches[date]) {
        groupedMatches[date] = [];
      }
      groupedMatches[date].push(match);
    });
    return groupedMatches;
  }
</script>

<div class="py-5 d-flex justify-content-between align-items-center">
  <h1>Matches ({data.matches.length})</h1>

  <div>
    <QuickPlayButton supabase={data.supabase} session={data.session} />
  </div>
</div>

{#each Object.entries(groupByDate(data.matches)) as [date, matches]}
  <h2>{date}</h2>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Event</th>
          <th scope="col">Team 1</th>
          <th scope="col">Team 2</th>
        </tr>
      </thead>
      <tbody>
        {#each matches as match}
          <tr role="button" on:click={() => goto(`/matches/${match.id}`)}>
            <td>{match.rounds.events.name}</td>
            <td>{match.match_participants[0].participants.teams.name}</td>
            <td>{match.match_participants[1].participants.teams.name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/each}
