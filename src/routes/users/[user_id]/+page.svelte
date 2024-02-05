<script lang="ts">
  export let data;
</script>

<div class="row align-items-center py-5">
  <img src="image source" class="img-fluid rounded-top" alt="" />

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
      {#each data.user.user_badges as badge}
        <img src="https://assets.ppy.sh/profile-badges/ceso-2021.png" alt="" />
      {/each}
      {#each data.user.user_badges as badge}
      <img src="https://assets.ppy.sh/profile-badges/ceso-2021.png" alt="" />
    {/each}
    {#each data.user.user_badges as badge}
    <img src="https://assets.ppy.sh/profile-badges/ceso-2021.png" alt="" />
  {/each}
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
      <a href="/account" class="btn btn-secondary"> Manage </a>
    </div>
  </div>
</div>

<!-- Graph of ranking against time -->

<h2>Events Played</h2>

<h2>Pinned Plays</h2>

<h2>Top Plays</h2>
