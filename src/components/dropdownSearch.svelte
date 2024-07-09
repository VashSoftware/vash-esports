<script lang="ts">
  export let text;
  export let searchKey;
  export let supabase;

  let items = [];
  let selectedItem = null;

  async function search(event: Event) {
    const foundItems = await supabase
      .from(searchKey)
      .select("*")
      .ilike("name", `%${(event.target as HTMLInputElement).value}%`)
      .limit(10);

    items = foundItems.data;
  }
</script>

<input type="hidden" name={searchKey} value={selectedItem?.id} />
<div class="dropdown w-100">
  <button
    class="btn btn-secondary dropdown-toggle w-100"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
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
          on:click={() => (selectedItem = item)}>{item.name}</button
        >
      </li>
    {/each}
  </ul>
</div>
