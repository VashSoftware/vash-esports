<script lang="ts">
  import RegisterButton from "../../../components/registerButton.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
</script>

<svelte:head>
  <title>{data.event.name} | Vash Esports</title>
  <meta name="description" content={data.event.description} />
  <meta name="og:url" content={$page.url.href} />
  <meta name="og:title" content={data.event.name} />
  <meta name="og:description" content={data.event.description} />
  <meta name="og:image" content={data.eventBanner.data.publicUrl} />

  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="row pb-5" style="position: relative;">
  <img
    src={data.eventBanner.data.publicUrl}
    alt="Match map cover"
    style="filter: blur(2px); object-fit: cover"
  />

  <div
    class="row align-items-center"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-shadow: 0 0 16px #000000;"
  >
    <div class="col mx-5">
      <h4>
        <a href="/organisations/{data.event.organisations.id}"
          >{data.event.organisations.name}</a
        >
      </h4>
      <h1>{data.event.name}</h1>
    </div>

    <div class="col text-end">
      <RegisterButton event={data.event} teams={data.teams} />
      <button
        class="btn btn-lg btn-secondary"
        on:click={() => goto($page.url.pathname + "/manage")}>Manage</button
      >
    </div>
  </div>
</div>

<div class="my-3">
  <h2>Information</h2>
  <p>{data.event.description}</p>

  <div class="row row-cols-4">
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Bracket Type</h6>
              <h5 class="card-text">Double Elimination</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"
              />
              <path
                fill="currentColor"
                d="M12 11c-2 0-2-.63-2-1s.7-1 2-1s1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3c2 0 2 .68 2 1s-.62 1-2 1c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92c0-1.12-.52-3-4-3"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Entry Fee</h6>
              <h5 class="card-text">Free</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 16 16"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M8 2.002a1.998 1.998 0 1 0 0 3.996a1.998 1.998 0 0 0 0-3.996M12.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M5 7.993A1 1 0 0 1 6 7h4a1 1 0 0 1 1 1v3a3.02 3.02 0 0 1-.146.927A3.001 3.001 0 0 1 5 11V8zM4 8c0-.365.097-.706.268-1H2a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 0 3.436 2.319A3.983 3.983 0 0 1 4 10.999zm8 0v3c0 .655-.157 1.273-.436 1.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Max Team Size</h6>
              <h5 class="card-text">1</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1q2.075 0 3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15q0-.825-.587-1.412T12 13q-.825 0-1.412.588T10 15q0 .825.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6z"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">Max Registrations</h6>
              <h5 class="card-text">∞</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-3">
        <div class="row g-0">
          <div
            class="col-md-3 d-flex align-items-center justify-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3em"
              height="3em"
              viewBox="0 0 24 24"
              {...$$props}
            >
              <path
                fill="currentColor"
                d="M7.698 10.362a1.943 1.943 0 0 0-.7-.516c-.281-.126-.61-.189-.988-.189s-.704.063-.982.189s-.51.298-.692.516c-.182.219-.32.477-.413.777a3.248 3.248 0 0 0-.139.96c0 .341.047.658.14.952c.092.293.23.549.412.767c.183.219.413.39.692.512c.278.122.605.184.982.184s.707-.062.988-.184c.281-.123.515-.293.7-.512c.186-.218.323-.474.413-.767c.09-.294.135-.61.135-.952a3.33 3.33 0 0 0-.135-.96a2.13 2.13 0 0 0-.413-.777m-.965 2.81c-.147.248-.387.372-.723.372c-.329 0-.567-.124-.713-.372c-.147-.249-.22-.606-.22-1.073s.073-.824.22-1.073c.146-.248.384-.372.713-.372c.336 0 .576.124.723.372c.147.249.22.606.22 1.073c0 .467-.073.824-.22 1.073m11.89-.83l-.09-4.39a4.54 4.54 0 0 1 .69-.054c.234 0 .468.018.701.054l-.09 4.39c-.21.035-.41.053-.601.053a3.496 3.496 0 0 1-.61-.054m1.319 1.4c0 .221-.018.443-.054.664a4.206 4.206 0 0 1-.655.054a4.141 4.141 0 0 1-.664-.054a4.088 4.088 0 0 1-.054-.655c0-.216.018-.437.054-.665a4.088 4.088 0 0 1 .655-.054c.215 0 .437.018.664.054c.036.228.054.446.054.656m-3.223-4.03c.21 0 .422.017.638.053v4.461c-.192.066-.445.13-.759.193a5.246 5.246 0 0 1-1.863.023a1.72 1.72 0 0 1-.74-.305c-.213-.156-.382-.383-.507-.683c-.126-.299-.189-.697-.189-1.193V9.765a3.873 3.873 0 0 1 .638-.054c.209 0 .421.018.637.054v2.46c0 .245.02.447.058.606a.886.886 0 0 0 .18.377a.66.66 0 0 0 .3.197c.12.039.26.058.422.058c.222 0 .407-.02.557-.062V9.765a3.822 3.822 0 0 1 .628-.054m-4.362 2.683c.054.15.08.332.08.548a1.401 1.401 0 0 1-.542 1.117a2 2 0 0 1-.642.333c-.252.08-.536.12-.853.12a5.298 5.298 0 0 1-.395-.013a3.123 3.123 0 0 1-.346-.045a4.048 4.048 0 0 1-.327-.076a3.934 3.934 0 0 1-.35-.116a2.577 2.577 0 0 1 .085-.49a3.074 3.074 0 0 1 .175-.48c.198.078.384.136.561.175c.177.04.36.059.552.059c.084 0 .175-.008.274-.023a.995.995 0 0 0 .274-.08a.647.647 0 0 0 .21-.153a.353.353 0 0 0 .086-.247c0-.144-.044-.247-.13-.31a1.26 1.26 0 0 0-.364-.166l-.556-.162c-.336-.095-.597-.237-.786-.426c-.188-.189-.283-.471-.283-.848c0-.455.163-.811.49-1.068c.326-.258.77-.386 1.332-.386c.234 0 .464.02.692.062a4.4 4.4 0 0 1 .691.189a2.453 2.453 0 0 1-.09.485a2.333 2.333 0 0 1-.17.44a3.58 3.58 0 0 0-.476-.158a2.18 2.18 0 0 0-.548-.067c-.203 0-.362.031-.476.094a.319.319 0 0 0-.17.301c0 .132.04.224.121.278c.081.054.196.105.346.153l.511.153c.168.048.32.106.454.175c.134.068.25.154.345.255c.096.102.171.228.225.377M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.628 0 12-5.373 12-12S18.628 0 12 0m0 22.8C6.035 22.8 1.2 17.965 1.2 12C1.2 6.035 6.035 1.2 12 1.2S22.8 6.035 22.8 12c0 5.965-4.835 10.8-10.8 10.8"
              />
            </svg>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h6 class="card-title">osu! Version</h6>
              <h5 class="card-text">Stable</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <h3>Prizes</h3>
  <div class="row text-center">
    <div class="col col-3">
      <h3>2nd place</h3>
      <ul>
        <li>100$</li>
        <li>2 years osu!supporter</li>
      </ul>
    </div>
    <div class="col col-6">
      <h2>1st place</h2>
      <ul>
        <li>100$</li>
        <li>2 years osu!supporter</li>
      </ul>
    </div>
    <div class="col col-3">
      <h4>3rd place</h4>
      <ul>
        <li>100$</li>
        <li>2 years osu!supporter</li>
      </ul>
    </div>
  </div>
</div>

<div class="my-3">
  <h2>Participants ({data.event.participants.length})</h2>
  <div class="row">
    <div class="row row-cols-4">
      {#each data.event.participants as participant, i}
        <a href="/teams/{participant.teams.id}">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  src={data.participantIcons[i].data.publicUrl}
                  class="img-fluid rounded-start"
                  alt="Team Icon"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{participant.teams.name}</h5>
                  {#each participant.teams.team_members as teamMember}
                    <span class="badge rounded-pill text-bg-secondary mx-3"
                      >{teamMember.user_profiles.name}</span
                    >
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>

<div class="my-3">
  <h2>Rounds</h2>
  {#each data.event.rounds as round}
    <div class="card">
      <div class="card-body">
        <div class="card-title d-flex justify-content-between mx-1">
          <h3>Grand Finals</h3>
          <a
            href="/map-pools/{round.map_pools.id}"
            role="button"
            class="btn btn-primary">Go to Map Pool</a
          >
        </div>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Team 1</th>
                <th>Team 2</th>
                <th>Start Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each round.matches as match}
                <tr role="button" on:click={() => goto(`/matches/${match.id}`)}>
                  <td>{match.match_participants[0].participants.teams.name}</td>
                  <td>{match.match_participants[1].participants.teams.name}</td>
                  <!-- TODO: Turn start time into a countdown when within 24 hours and show date on hover tooltip -->
                  <td>{new Date(match.start_time).toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/each}
</div>
