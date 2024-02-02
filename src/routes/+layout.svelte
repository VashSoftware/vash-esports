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
        <form method="post" class="d-flex">
          <div class="input-group">
            <input type="search" class="form-control" placeholder="Search" />
            <!-- <button type="submit" class="btn btn-secondary"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                {...$$props}
              >
                <path
                  fill="currentColor"
                  d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"
                />
              </svg></button
            > -->
          </div>
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
