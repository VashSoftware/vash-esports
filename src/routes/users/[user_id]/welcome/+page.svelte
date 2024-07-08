<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { PUBLIC_OSU_CLIENT_ID } from "$env/static/public";

  export let data;
</script>

<form action="?/createUser" method="post" use:enhance>
  <div class="row my-4 justify-content-between align-items-center">
    <div class="col"></div>
    <div class="col text-center">
      <h1 class="my-2">Welcome to Vash Esports!</h1>
      <p>Please fill out the fields to get started.</p>
    </div>

    <div class="col text-end">
      <form action="?/logOut" method="post" use:enhance>
        <button class="btn btn-danger mx-3">Log out</button>
      </form>
    </div>
  </div>

  <div class="d-flex justify-content-center">
    <div style="max-width: 350px;">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">osu! Account</label>
        <div class="text-center row mx-0">
          {#if !data.user.user_platforms?.find((platform) => platform.platform_id == 1)}
            <a
              href={`https://osu.ppy.sh/oauth/authorize?client_id=${PUBLIC_OSU_CLIENT_ID}&redirect_uri=http://localhost:5173/auth/callback/osu&response_type=code&scope=public identify`}
              class="btn"
              style="background-color: #EA67A4; border-color: #EA67A4;"
            >
              Connect osu! Account
            </a>
          {:else}
            <button
              class="btn"
              style="background-color: #EA67A4; border-color: #EA67A4;"
              disabled
              >Connected
            </button>
          {/if}
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          name="name"
          value={data.userProfile.data[0].name}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          required
        />
      </div>
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="exampleCheck1"
          required
        />
        <label class="form-check-label" for="exampleCheck1"
          >I agree to the <a href="/terms">Terms of Service</a> and
          <a href="/privacy">Privacy Policy</a>.</label
        >
      </div>
    </div>
  </div>

  <div class="text-center">
    <button
      class="btn btn-success"
      disabled={!data.user.user_platforms.find(
        (platform) => platform.platform_id == 1
      )}>Submit</button
    >
  </div>
</form>
