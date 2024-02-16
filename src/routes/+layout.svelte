<script lang="ts">
  import "../app.pcss";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  let searchQuery = "";

  let searchResults = [];

  async function search(event: Event) {
    // const foundMatches = data.matches.filter((match) =>
    //   match.id.includes((event.target as HTMLInputElement).value)
    // );

    // const foundEvents = data.events.filter((vashEvent) =>
    //   vashEvent.name.includes(event.target.value)
    // );

    const foundUsers = data.users.filter((user) =>
      user.name.includes(event.target.value)
    );

    const foundTeams = data.teams.filter((team) =>
      team.name.includes(event.target.value)
    );

    const foundOrganisations = data.organisations.filter((organisation) =>
      organisation.name.includes(event.target.value)
    );

    searchResults = [
      // ...foundMatches,
      // ...foundEvents,
      ...foundUsers,
      ...foundTeams,
      ...foundOrganisations,
    ];

    console.log(searchResults);
  }
</script>

<main class="d-flex flex-column min-vh-100">
  <nav class="navbar navbar-expand-lg bg-dark-subtle justify-content-center">
    <div class="container row p-0">
      <div class="col d-flex align-items-center">
        <a class="navbar-brand fs-3" href="/"><b>Vash Esports</b></a>
        <div class="btn btn-warning btn-sm" style="pointer-events: none;">
          ALPHA
        </div>
      </div>
      <div class="col text-center">
        <div class="position-relative">
          <div class="input-group">
            <input
              type="search"
              class="form-control"
              placeholder="Search"
              bind:value={searchQuery}
              on:input={search}
            />
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
          <ul class="list-group position-absolute w-100">
            {#if searchQuery.length > 0}
              {#each searchResults as searchResult}
                <li class="list-group-item">
                  <a href="/matches/{searchResult.id}">{searchResult.name}</a>
                </li>
              {/each}{/if}
          </ul>
        </div>
      </div>
      <div class="col p-0">
        <ul class="navbar-nav align-items-center justify-content-end">
          {#if data.session?.user}
            <li class="nav-item">
              <a class="nav-link" href="/events">Events</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/matches">Matches</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/rankings">Rankings</a>
            </li>
            <li class="nav-item mx-2 ms-3">
              <div class="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <g fill="none">
                    <path
                      d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                    />
                    <path
                      fill="currentColor"
                      d="M15 19a2 2 0 0 1-1.85 1.995L13 21h-2a2 2 0 0 1-1.995-1.85L9 19zM12 2a7 7 0 0 1 6.996 6.76L19 9v3.764l1.822 3.644a1.1 1.1 0 0 1-.869 1.586l-.115.006H4.162a1.1 1.1 0 0 1-1.03-1.487l.046-.105L5 12.764V9a7 7 0 0 1 7-7"
                    />
                  </g>
                </svg>

                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="nav-item ms-2">
              <a class="nav-link" href="/users/1"
                ><img
                  class="rounded-circle"
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
    <div class="container">
      <div class="row text-center my-3">
        <div class="col"></div>
        <div class="col d-flex justify-content-center align-items-center">
          <a class="text-decoration-none mx-2" href="/terms">Terms</a>
          •
          <a class="text-decoration-none mx-2" href="/privacy">Privacy</a>
          •
          <a class="text-decoration-none mx-2" href="/wiki">Wiki</a>
          •
          <a class="text-decoration-none mx-2" href="/status">Status</a>
        </div>
        <div class="col d-flex align-items-center justify-content-end">
          <a href="https://github.com/VashSoftware/vash-esports"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="white"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg></a
          >
        </div>
      </div>
    </div>
  </footer>
</main>
