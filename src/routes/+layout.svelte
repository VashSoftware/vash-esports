<script lang="ts">
  import "../app.pcss";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<main class="d-flex flex-column min-vh-100">
  <nav class="navbar navbar-expand-lg bg-dark-subtle justify-content-center">
    <div class="container row p-0">
      <div class="col">
        <a class="navbar-brand fs-3" href="/"><b>Vash Esports</b></a>
      </div>
      <div class="col text-center">
        <form method="post">
          <input type="search" class="form-control" placeholder="Search"/>
        </form>
      </div>
      <div class="col p-0">
        <ul class="navbar-nav align-items-center justify-content-end">
          {#if data.isLoggedIn}
            <li class="nav-item">
              <a class="nav-link" href="/events">Events</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/matches">Matches</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/rankings">Rankings</a>
            </li>
            <li class="nav-item ms-2">
              <a class="nav-link" href="/users/1"
                ><img
                  class="rounded"
                  height={64}
                  src={data.userPictureUrl}
                  alt="User"
                /></a
              >
            </li>
          {:else}
            <li class="nav-item">
              <a class="nav-link" href="/login">
                <button class="btn btn-primary">Login</button>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/register"> Register </a>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <slot />
  </div>
  <footer class="container-fluid mt-auto bg-dark-subtle">
    <div class="row text-center">
      <div>
        <a class="text-decoration-none" href="/terms">Terms</a>
        •
        <a class="text-decoration-none" href="/privacy">Privacy</a>
        •
        <a class="text-decoration-none" href="/wiki">Wiki</a>
        •
        <a class="text-decoration-none" href="/status">Status</a>
      </div>
      <p class="text-center">
        Made by <a href="https://github.com/VashSoftware">Vash Software</a>
      </p>
    </div>
  </footer>
</main>
