<script lang="ts">
  import { enhance } from "$app/forms";
  import type { LayoutData } from "./$types";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";

  export let data: LayoutData;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    import("bootstrap/js/dist/dropdown");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => subscription.unsubscribe();
  });

  let searchQuery = "";

  let searchResults = [];

  async function search(event: Event) {
    // const foundMatches = data.matches.filter((match) =>
    //   match.id.includes((event.target as HTMLInputElement).value)
    // );

    const foundEvents = data.events.filter((vashEvent) =>
      vashEvent.name
        .toLowerCase()
        .includes((event.target as HTMLInputElement).value.toLowerCase())
    );

    const foundUsers = data.users.filter((user) =>
      user.name
        .toLowerCase()
        .includes((event.target as HTMLInputElement).value.toLowerCase())
    );

    const foundTeams = data.teams
      .filter((team) =>
        team.name
          .toLowerCase()
          .includes((event.target as HTMLInputElement).value.toLowerCase())
      )
      .filter((team) => team.is_personal_team === false);

    const foundOrganisations = data.organisations.filter((organisation) =>
      organisation.name
        .toLowerCase()
        .includes((event.target as HTMLInputElement).value.toLowerCase())
    );
    searchResults = [
      // ...foundMatches,
      ...foundEvents,
      ...foundUsers,
      ...foundTeams,
      ...foundOrganisations,
    ];
  }

  function getNotificationsCount() {
    return data.notifications?.length > 0
      ? `(${data.notifications.length}) `
      : "";
  }
</script>

<svelte:head>
  <title>{getNotificationsCount()}Vash Esports</title>
</svelte:head>

<main class="d-flex flex-column min-vh-100">
  <nav class="navbar navbar-expand-lg bg-dark-subtle justify-content-center">
    <div
      class="container d-flex flex-column justify-content-between flex-md-row p-0"
    >
      <div class="d-flex align-items-center">
        <a class="navbar-brand fs-3" href="/"><b>Vash Esports</b></a>
        <div class="btn btn-danger btn-sm" style="pointer-events: none;">
          PRE-ALPHA
        </div>
      </div>
      <div class="d-flex">
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
      <ul class="navbar-nav d-flex align-items-center">
        <li class="nav-item">
          <a
            class="nav-link"
            href="/events"
            class:active={$page.url.pathname === "/events"}>Events</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="/matches"
            class:active={$page.url.pathname === "/matches"}>Matches</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="/rankings"
            class:active={$page.url.pathname === "/rankings"}>Rankings</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="/map-pools"
            class:active={$page.url.pathname === "/map-pools"}>Map Pools</a
          >
        </li>
        {#if session}
          <li
            class="nav-item mx-2 ms-3 dropdown d-flex flex-column align-items-center"
          >
            <svg
              class="dropdown-toggle"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-offset="10,20"
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

            {#if data.notifications?.length > 0}
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {data.notifications.length}
                <span class="visually-hidden">unread messages</span>
              </span>
            {/if}

            <ul
              class="dropdown-menu dropdown-menu-end"
              style="min-width: 350px; width: fit-content; "
            >
              <h1>Notifications</h1>
              {#each data.notifications as notification, i}
                <li
                  class="dropdown-item d-flex m-2 align-items-center justify-content-between"
                >
                  <div>
                    <h5>
                      {notification.title}
                    </h5>
                    <p>{notification.body}</p>
                  </div>
                  <a class="btn btn-primary" href={notification.href}>Go</a>
                  <form
                    action="/?/dismissNotification"
                    method="post"
                    use:enhance
                  >
                    <input
                      type="hidden"
                      name="notification-id"
                      value={notification.id}
                    />

                    <button type="submit" class="btn-close"></button>
                  </form>
                </li>
                {#if i !== data.notifications.length - 1}
                  <li><hr class="dropdown-divider" /></li>
                {/if}
              {/each}
            </ul>
          </li>
          <li class="nav-item ms-2">
            <a class="nav-link" href="/users/{data.userProfile.data?.id}"
              ><img
                class="rounded-circle"
                height={64}
                src={data.userProfile.data?.picture_url}
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
  </nav>

  <div class="container">
    <slot />
  </div>

  <footer class="container-fluid mt-auto bg-dark-subtle">
    <div class="container">
      <div class="row text-center my-3">
        <div class="col-12 col-md text-center text-md-start">
          <stripe-buy-button
            buy-button-id="buy_btn_1OmnmQK4YdEKZm47w7jpTVA9"
            publishable-key="pk_live_51KvfIRK4YdEKZm472sIZDQb4WIyCSWkXfzBwwGbgMJtE0siYmYvUME8510RaUi7TVnxRvXJxGEDsrniLLx1r72Gr00tmk9MPx7"
          >
          </stripe-buy-button>
        </div>
        <div class="col-12 col-md text-center">
          <div class="d-flex justify-content-center align-items-center gap-2">
            <a class="text-decoration-none" href="/terms">Terms</a> •
            <a class="text-decoration-none" href="/privacy">Privacy</a> •
            <a class="text-decoration-none" href="/wiki">Wiki</a> •
            <a class="text-decoration-none" href="/status">Status</a>
          </div>
          <div>Made by <a href="https://vash.software">Vash Software</a></div>
        </div>
        <div
          class="col-12 col-md d-flex justify-content-center justify-content-md-end align-items-center gap-4"
        >
          <a href="https://discord.gg/n3mZgWk">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
              />
            </svg>
          </a>
          <a href="https://x.com/VashEsports">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
              />
            </svg>
          </a>
          <a href="https://youtube.com/channel/UCmSUuMGHkVIDVDEt-NmbKWg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
              />
            </svg>
          </a>
          <a href="https://twitch.tv/VashEsports">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"
              />
            </svg>
          </a>
          <a href="https://github.com/VashSoftware/vash-esports">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</main>
