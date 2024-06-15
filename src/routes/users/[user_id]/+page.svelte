<script lang="ts">
  import { page } from "$app/stores";

  export let data;

  // console.log(data);
</script>

<svelte:head>
  <title>{data.user?.name} | Vash Esports</title>
  <meta
    name="description"
    content="View {data.user?.name}'s profile on Vash Esports"
  />
  <meta property="og:title" content="{data.user?.name} | Vash Esports" />
  <meta
    property="og:description"
    content="View {data.user?.name}'s profile on Vash Esports"
  />
  <meta property="og:image" content={data.userPictureUrl} />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:type" content="profile" />
</svelte:head>

<div class="row align-items-center py-5">
  <div class="col d-flex align-items-center">
    <img
      src={data.userPictureUrl}
      height="128"
      class="rounded-circle me-4"
      alt="User profile"
    />
    <div>
      <h1>{data.user?.name}</h1>
      <div class="d-flex gap-4">
        <div class="d-flex gap-2 align-items-center">
          <div>Organisations:</div>

          {#each data.organisationPublicUrls as organisation, i}
            <a
              href="/organisations/{data.user.organisation_members[i]
                .organisations.id}"
            >
              <img
                height={32}
                class="rounded"
                src={organisation.data.publicUrl}
                alt="Organisation logo"
              /></a
            >
          {/each}
        </div>
        <div class="d-flex gap-2 align-items-center">
          <div>Teams:</div>

          {#each data.teamPublicUrls as team, i}
            <a href="/teams/{data.user.team_members[i].teams.id}">
              <img
                height={32}
                class="rounded"
                src={team.data.publicUrl}
                alt="Team logo"
              /></a
            >
          {/each}
        </div>
      </div>
      <div class="d-flex gap-2 my-2">
        {#each data.user.user_badges as badge}
          <img
            src="https://assets.ppy.sh/profile-badges/{badge.badges.osu_id}.png"
            alt=""
          />
        {/each}
        {#each data.user.user_badges as badge}
          <img
            src="https://assets.ppy.sh/profile-badges/{badge.badges.osu_id}.png"
            alt=""
          />
        {/each}
        {#each data.user.user_badges as badge}
          <img
            src="https://assets.ppy.sh/profile-badges/{badge.badges.osu_id}.png"
            alt=""
          />
        {/each}
      </div>
    </div>
  </div>
  <div class="col">
    <div class="text-end">
      <a
        class="btn btn-primary"
        href="https://osu.ppy.sh/users/11212255"
        role="button">osu! profile</a
      >

      <button class="btn btn-primary"> Discord profile </button>
      {#if data.session.user.id == data.user.user_id}
        <a
          href="/account"
          class="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Manage
        </a>
      {/if}
    </div>
  </div>
</div>

<!-- Graph of ranking against time -->

<h2>Events Played</h2>

<h2>Pinned Plays</h2>

<h2>Top Plays</h2>
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
      {#each data.userScores as score}
        <tr>
          <td>{score.score}</td>
          <td>{score.accuracy}</td>
          <td>{score.max_combo}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

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
        <h1 class="modal-title fs-5" id="exampleModalLabel">Manage account</h1>
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
