<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;

  async function signOut() {
    await data.supabase.auth.signOut();
  }
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
    <div class="d-flex justify-content-end gap-3 align-items-center">
      <a href="https://osu.ppy.sh/users/11212255" class="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3em"
          height="3em"
          viewBox="0 0 24 24"
          {...$$props}
        >
          <path
            fill="currentColor"
            d="M7.698 10.362a1.94 1.94 0 0 0-.7-.516q-.421-.189-.988-.189c-.567 0-.704.063-.982.189s-.51.298-.692.516q-.273.328-.413.777q-.139.448-.139.96q0 .511.14.952q.139.44.412.767q.274.329.692.512t.982.184c.565 0 .707-.062.988-.184q.422-.184.7-.512q.279-.327.413-.767q.135-.44.135-.952a3.3 3.3 0 0 0-.135-.96a2.1 2.1 0 0 0-.413-.777m-.965 2.81q-.22.372-.723.372q-.494 0-.713-.372q-.22-.373-.22-1.073c0-.7.073-.824.22-1.073q.22-.372.713-.372q.503 0 .723.372q.22.373.22 1.073t-.22 1.073m11.89-.83l-.09-4.39a4.5 4.5 0 0 1 .69-.054q.351 0 .701.054l-.09 4.39q-.315.053-.601.053a3.5 3.5 0 0 1-.61-.054m1.319 1.4q0 .332-.054.664a4 4 0 0 1-.655.054a4 4 0 0 1-.664-.054a4 4 0 0 1-.054-.655q0-.323.054-.665a4 4 0 0 1 .655-.054q.323 0 .664.054q.054.341.054.656m-3.223-4.03q.315 0 .638.053v4.461q-.288.099-.759.193a5.3 5.3 0 0 1-1.863.023a1.7 1.7 0 0 1-.74-.305q-.32-.234-.507-.683q-.189-.449-.189-1.193V9.765a4 4 0 0 1 .638-.054q.313 0 .637.054v2.46q0 .367.058.606a.9.9 0 0 0 .18.377a.66.66 0 0 0 .3.197q.18.058.422.058q.332 0 .557-.062V9.765a4 4 0 0 1 .628-.054m-4.362 2.683q.08.225.08.548a1.4 1.4 0 0 1-.542 1.117q-.265.212-.642.333q-.378.12-.853.12a5 5 0 0 1-.395-.013a3 3 0 0 1-.346-.045a4 4 0 0 1-.327-.076a4 4 0 0 1-.35-.116a2.6 2.6 0 0 1 .085-.49a3 3 0 0 1 .175-.48q.296.117.561.175q.265.06.552.059q.126 0 .274-.023a1 1 0 0 0 .274-.08a.7.7 0 0 0 .21-.153a.35.35 0 0 0 .086-.247q0-.216-.13-.31a1.3 1.3 0 0 0-.364-.166l-.556-.162q-.503-.143-.786-.426q-.282-.283-.283-.848q0-.682.49-1.068q.489-.386 1.332-.386q.35 0 .692.062q.341.063.691.189a2.5 2.5 0 0 1-.09.485a2.3 2.3 0 0 1-.17.44a4 4 0 0 0-.476-.158a2.2 2.2 0 0 0-.548-.067q-.305 0-.476.094a.32.32 0 0 0-.17.301q0 .197.121.278t.346.153l.511.153q.252.072.454.175t.345.255t.225.377M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.628 0 12-5.373 12-12S18.628 0 12 0m0 22.8C6.035 22.8 1.2 17.965 1.2 12S6.035 1.2 12 1.2S22.8 6.035 22.8 12S17.965 22.8 12 22.8"
          />
        </svg></a
      >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3em"
          height="3em"
          viewBox="0 0 24 24"
          {...$$props}
        >
          <path
            fill="currentColor"
            d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
          />
        </svg>
      </div>
      {#if data.session.user.id == data.user?.user_id}
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

<h2>Top Plays ({data.userScores.length})</h2>
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
      {#each data.userScores.slice(0, 10) as score}
        <tr>
          <td>
            <a href="/matches/{score.match_maps.match_id}">
              {score.score}
            </a>
          </td>

          <td
            ><a href="/matches/{score.match_maps.match_id}">{score.accuracy}</a
            ></td
          >
          <td
            ><a href="/matches/{score.match_maps.match_id}">{score.max_combo}</a
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<form action="?/updateAccount" method="post">
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
            Manage account
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="name"
              value={data.user?.name}
              name="username"
            />
          </div>
          <div class="mb-3">
            <label for="profile-pic" class="form-label">Profile Picture</label>

            {#if data.userPictureUrl}
              <img src={data.userPictureUrl} height="64" alt="User" />
            {/if}

            <input
              type="file"
              class="form-control"
              id="profile-pic"
              name="profilePicture"
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              value={data.session.user.email}
              name="email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Enter new password"
              name="password"
            />
          </div>

          <div class="mb-3">
            <label for="actions" class="form-label">Actions</label>
            <div>
              <form action="?/signOut" method="post" use:enhance>
                <button
                  type="submit"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  on:click={signOut}
                  >Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</form>
