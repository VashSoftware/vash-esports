<script lang="ts" context="module">
  import { supabase } from "../../lib/supabaseClient";
  import { user } from "../../stores";
  import { goto } from "$app/navigation";

  let email: string;
  let password: string;
  let errorMessage: string | null = null;

  const login = async (event: SubmitEvent) => {
    errorMessage = null;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data) {
      user.set(data.user);
      goto("/");
    } else if (error) {
      errorMessage = error.message;
    }
  };
</script>

<div class="row justify-content-center">
  <form class="d-flex col-4" on:submit|preventDefault={login}>
    <div class="col">
      {#if errorMessage}
        <div class="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      {/if}
      <div class="mb-3">
        <div class="pt-3 pb-3">
          <label for="" class="form-label">E-mail</label>
          <input
            type="text"
            name=""
            id=""
            class="form-control"
            placeholder=""
            aria-describedby="helpId"
            bind:value={email}
          />
        </div>

        <div class="pt-3 pb-3">
          <label for="" class="form-label">Password</label>
          <input
            type="password"
            name=""
            id=""
            class="form-control"
            placeholder=""
            aria-describedby="helpId"
            bind:value={password}
          />
        </div>

        <div class="text-center pt-3">
          <button type="submit" class="btn btn-primary">Log in</button>
        </div>
      </div>
    </div>
  </form>
</div>
