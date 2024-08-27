export function tab(node) {
  import("bootstrap").then((Bootstrap) => {
    return new Bootstrap.Tab(node);
  });
}
