<script lang="ts">
  export let data;

  export let form;

  let email = "";
  let password = "";

  async function signIn() {
    await data.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }
</script>

<div class="row justify-content-center text-center align-items-center">
  <h1 class="py-5">Login</h1>
  <form class="d-flex col-4" method="post">
    <div class="col">
      {#if form?.error}
        <div class="alert alert-danger" role="alert">
          {form.error.message}
        </div>
      {/if}
      <div class="mb-3">
        <div class="pt-3 pb-3">
          <label class="form-label"
            >E-mail
            <input
              type="text"
              name="email"
              class="form-control"
              placeholder=""
              aria-describedby="helpId"
              bind:value={email}
            />
          </label>
        </div>

        <div class="pt-3 pb-3">
          <label for="" class="form-label"
            >Password <input
              type="password"
              name="password"
              class="form-control"
              placeholder=""
              aria-describedby="helpId"
              bind:value={password}
            /></label
          >
        </div>

        <div class="text-center pt-3">
          <button type="submit" class="btn btn-primary" on:click={signIn}
            >Log in</button
          >
        </div>
      </div>
    </div>
  </form>
</div>
