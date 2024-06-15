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
    {#if !data.team.team_members.find((member) => member.user_profiles.user_id === data.session.user.id)}
      <form method="post">
        <button class="btn btn-primary mx-3" type="submit"
          >Request to Join</button
        >
      </form>
    {/if}

    {#if data.team.team_members.find((member) => member.user_profiles.user_id === data.session.user.id)}
      <a
        class="btn btn-secondary"
        href="/teams/{data.team.id}/manage"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">Manage</a
      >
    {/if}
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

<div
  class="modal fade"
  id="exampleModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          Manage {data.team.name}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">...</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
