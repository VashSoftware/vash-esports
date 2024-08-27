<script lang="ts">
  export let text;
  export let searchKey;
  export let selectKey;
  export let searchColumn;
  export let itemDisplayFn = (item) => item[searchColumn];
  export let filters = [];
  export let supabase;
  export let selectRowFn = (item) => item;
  export let searchFn = async (event) => {};

  let items = [];
  let selectedItem = null;

  async function search(event: Event) {
    searchFn(event);

    let foundItems = await supabase
      .from(searchKey)
      .select(selectKey)
      .ilike(searchColumn, `%${(event.target as HTMLInputElement).value}%`)
      .is("deleted_at", null);

    foundItems = foundItems.data.filter((item) => {
      for (let filter of filters) {
        if (!filter(item)) {
          return false;
        }
      }

      let allValuesAreNull = true;
      for (let key in item) {
        if (key == "id") {
          continue;
        }

        if (item[key] !== null) {
          allValuesAreNull = false;
          break;
        }
      }

      return !allValuesAreNull;
    });

    items = foundItems.slice(0, 10);
  }
</script>

<input type="hidden" name={searchKey} />
<div class="dropdown w-100">
  <button
    class="btn btn-secondary dropdown-toggle w-100"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    on:click={search}
  >
    {selectedItem ? itemDisplayFn(selectedItem) : text}
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
          on:click={async (event) => {
            selectedItem = item;

            await selectRowFn(item);
          }}>{itemDisplayFn(item)}</button
        >
      </li>
    {/each}
  </ul>
</div>
