<script lang="ts">
  import { enhance } from "$app/forms";
  import type { LayoutData } from "./$types";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { browser } from "$app/environment";

  export let data: LayoutData;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(async () => {
    if (!browser) return;

    await import("bootstrap");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    subscription.unsubscribe();

    data.supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        async (payload) => {
          const notifications = await data.supabase
            .from("notifications")
            .select("*, user_profiles!inner(user_id), match_invites(id)")
            .eq("user_profiles.user_id", session?.user.id)
            .is("dismissed_at", null)
            .order("created_at", { ascending: false });

          data.notifications = notifications.data;

          const ongoingMatch = await data.supabase
            .from("matches")
            .select(
              "id, ongoing, match_participants(match_participant_players(team_members(user_profiles(user_id)))), match_queue(*)"
            )
            .eq("ongoing", true)
            .eq(
              "match_participants.match_participant_players.team_members.user_profiles.user_id",
              (await supabase.auth.getUser()).data.user.id
            )
            .maybeSingle();

          data.ongoingMatch = ongoingMatch.data;
        }
      )
      .subscribe();
  });

  let searchQuery = "";

  let searchResults = [];

  async function search(event: Event) {
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

<svelte:head>
  <title>{getNotificationsCount()}Vash Esports</title>
</svelte:head>

{#if data.ongoingMatch && $page.url.pathname !== `/matches/${data.ongoingMatch.id}/play`}
  {#if !data.ongoingMatch.match_queue[0].position}
    <a href="/matches/{data.ongoingMatch.id}/play" class="banner-link">
      <div class="banner">
        <div class="banner-content text-center">
          Active Match: Stan vs Stan 3
        </div>
      </div>
    </a>
  {:else}
    <div class="banner-link">
      <div class="banner">
        <div class="d-flex justify-content-center gap-2">
          <div class="banner-content text-center">
            Queueing for: Stan vs Stan 3
          </div>

          <button
            type="button"
            class="btn btn-sm"
            style="background-color: #212529;"
            data-bs-toggle="modal"
            data-bs-target="#queuePositionModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>{/if}
{/if}

<main class="d-flex flex-column min-vh-100">
  <nav class="navbar navbar-expand-lg bg-dark-subtle justify-content-center">
    <div
      class="container d-flex flex-column justify-content-between flex-md-row p-0"
    >
      <div class="d-flex flex-column flex-md-row align-items-center">
        <a class="navbar-brand fs-3" href="/"><b>Vash Esports</b></a>
        <div class="btn btn-warning btn-sm" style="pointer-events: none;">
          PRIVATE ALPHA
        </div>
      </div>
      <div class="d-flex">
        <div class="position-relative">
          <div class="input-group">
            <input
              type="search"
              class="form-control my-3"
              placeholder="Search"
              bind:value={searchQuery}
              on:input={search}
            />
          </div>
          <ul class="list-group position-absolute w-100">
            {#if searchQuery.length > 0}
              {#each searchResults as searchResult}
                <li class="list-group-item">
                  <a href="/matches/{searchResult.id}">{searchResult.name}</a>
                </li>
              {/each}
            {/if}
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
              <h2 class="mx-4 my-3">
                Notifications {#if data.notifications.length > 0}({data
                    .notifications.length}){/if}
              </h2>
              <li><hr class="dropdown-divider" /></li>
              {#each data.notifications as notification, i}
                {#if notification.type == "message"}
                  <li
                    class="dropdown-item d-flex align-items-center justify-content-between"
                  >
                    <div class="me-5">
                      <h5>
                        {notification.title}
                      </h5>
                      <p>{notification.body}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
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
                        <button type="submit" class="btn btn-success"
                          >Go
                        </button>
                      </form>
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
                    </div>
                  </li>
                {:else if notification.type == "match_invite"}
                  <li
                    class="dropdown-item d-flex align-items-center justify-content-between"
                  >
                    <div class="me-5">
                      <h5>
                        {notification.title}
                      </h5>
                      <p>{notification.body}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <form
                        action="/?/acceptMatchInvite"
                        method="post"
                        use:enhance
                      >
                        <input
                          type="hidden"
                          name="match-invite-id"
                          value={notification.match_invites[0]?.id}
                        />

                        <button type="submit" class="btn btn-success"
                          >Accept
                        </button>
                      </form>
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
                    </div>
                  </li>
                {/if}
                {#if i !== data.notifications.length - 1}
                  <li><hr class="dropdown-divider" /></li>
                {/if}
              {/each}
            </ul>
          </li>
          <li class="nav-item ms-2">
            <a class="nav-link" href="/users/{data.userProfile.data[0]?.id}"
              ><img
                class="rounded-circle"
                height={64}
                src={data.userProfile.data[0]?.picture_url}
                alt="User"
              /></a
            >
          </li>
        {:else}
          <li class="nav-item mx-3">
            <div class="dropdown" style="position: relative;">
              <button
                class="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Log in / Register
              </button>
              <ul
                class="dropdown-menu my-4"
                style="width: 400px; position: absolute; left: 50%; transform: translateX(-50%);"
              >
                <div
                  class="justify-content-center text-center align-items-center"
                >
                  <h1 class="my-4">Log in / Register</h1>

                  <p>Or log in with one of these providers:</p>
                  <div class="d-flex justify-content-center gap-2">
                    <form action="/?/logInOauth" method="post" use:enhance>
                      <button
                        name="provider"
                        value="google"
                        class="btn btn-primary"
                        style="color: black; border-color: white; background-color: white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 24 24"
                          {...$$props}
                        >
                          <path
                            fill="currentColor"
                            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"
                          />
                        </svg>
                      </button>
                    </form>
                    <form action="/?/logInOauth" method="post" use:enhance>
                      <button
                        name="provider"
                        value="discord"
                        class="btn btn-primary"
                        style="color: white; border-color: #5E6FEB; background-color: #5E6FEB"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 24 24"
                          {...$$props}
                        >
                          <path
                            fill="currentColor"
                            d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>

                  <form action="/?/logInEmail" method="post" use:enhance>
                    <div class="col">
                      {#if form?.error}
                        <div class="alert alert-danger" role="alert">
                          {form.error.message}
                        </div>
                      {/if}
                      <div class="mb-3">
                        <div class="my-3">
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

                        <div class="my-3">
                          <label for="" class="form-label"
                            >Password
                            <input
                              type="password"
                              name="password"
                              class="form-control"
                              placeholder=""
                              aria-describedby="helpId"
                              style="width: 100%;"
                              bind:value={password}
                            /></label
                          >
                        </div>

                        <div class="text-center my-3">
                          <button
                            type="submit"
                            class="btn btn-primary"
                            on:click={signIn}>Log in</button
                          >

                          <button
                            type="submit"
                            class="btn btn-secondary"
                            on:click={signIn}>Register</button
                          >
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </ul>
            </div>
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

<div
  class="modal fade"
  id="queuePositionModal"
  tabindex="-1"
  aria-labelledby="queuePositionModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body">
        <div class="text-center my-5">
          <h3>No. {data.ongoingMatch?.match_queue[0].position} in the Queue</h3>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        {#if !data.ongoingMatch?.match_queue[0].position}
          <a href="/matches/{data.ongoingMatch?.id}/play"
            ><button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .banner {
    background: linear-gradient(to right, #ff7e5f, #feb47b, #ff7e5f, #feb47b);
    background-size: 200% 100%;
    color: white;
    font-weight: bold;
    padding: 10px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    font-size: 1.2em;
    animation: gradientAnimation 3s linear infinite; /* Adjust speed as necessary */
  }

  a.banner-link {
    color: inherit; /* Inherits the color from the parent element */
    text-decoration: none; /* Removes underline from links */
    display: block; /* Ensure the anchor tag takes full height and width */
  }

  .banner-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
