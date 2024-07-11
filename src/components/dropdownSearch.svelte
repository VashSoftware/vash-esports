<script lang="ts">
  export let text;
  export let searchKey;
  export let selectKey;
  export let filters = {};
  export let supabase;

  let items = [];
  let selectedItem = null;

  async function search(event: Event) {
    let foundItems = await supabase
      .from(searchKey)
      .select(selectKey)
      .ilike(
        "name",
        `%${event ? (event.target as HTMLInputElement).value : ""}%`
      )
      .limit(10);

    foundItems = foundItems.data.filter((item) => {
      for (let key in filters) {
        if (item[key] !== filters[key]) {
          return false;
        }
      }
      return true;
    });

    items = foundItems;
  }
</script>

<input
  type="hidden"
  name={searchKey}
  value={searchKey == "teams"
    ? selectedItem?.team_members[0]?.user_profiles.id
    : selectedItem?.id}
/>
<div class="dropdown w-100">
  <button
    class="btn btn-secondary dropdown-toggle w-100"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    on:click={search}
  >
    {selectedItem ? selectedItem?.name : text}
  </button>
  <ul class="dropdown-menu w-100">
    <li>
      <input
        type="text"
        class="form-control"
        placeholder="Type to search"
        on:input={search}
      />
    </li>

    <li><hr class="dropdown-divider" /></li>

    {#each items as item}
      <li>
        <button
          type="button"
          class="dropdown-item"
          on:click={() => {
            selectedItem = item;
            console.dir(selectedItem?.team_members);
          }}>{item.name}</button
        >
      </li>
    {/each}
  </ul>
</div>
