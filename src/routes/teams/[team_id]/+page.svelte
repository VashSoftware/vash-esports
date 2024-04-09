<script lang="ts">
  import { page } from "$app/stores";

  export let data;
</script>

<svelte:head>
  <title>{data.team.name} | Vash Esports</title>
  <meta name="description" content={data.team.bio} />
  <meta name="og:url" content={$page.url.href} />
  <meta name="og:title" content={data.team.name} />
  <meta name="og:description" content={data.team.bio} />
  <meta name="og:image" content={data.teamPicture.data.publicUrl} />

  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="py-5 row">
  <div class="col d-flex align-items-center">
    <img
      src={data.teamPicture.data.publicUrl}
      height="128"
      alt="Team icon"
      class="rounded me-4"
    />
    <h1>{data.team.name}</h1>
  </div>

  <div class="col text-end d-flex justify-content-end align-items-center">
    <form method="post">
      <button class="btn btn-primary mx-3" type="submit">Request to Join</button
      >
    </form>

    <a
      class="btn btn-secondary"
      href="/teams/{data.team.id}/manage"
      role="button">Manage</a
    >
  </div>
</div>

<h2>Team Members</h2>
<ul>
  {#each data.team.team_members as teamMember}
    <li>
      <a href="/users/{teamMember.user_profiles.id}"
        >{teamMember.user_profiles.name}</a
      >
    </li>
  {/each}
</ul>

<h2>Events</h2>
<ul>
  {#each data.team.participants as participation}
    <li>
      <a href="/events/{participation.events.id}"
        >{participation.events.event_groups?.name}
        {participation.events.name}</a
      >
    </li>
  {/each}
</ul>
