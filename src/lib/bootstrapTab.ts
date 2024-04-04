export function tab(node) {
  import("bootstrap").then((Bootstrap) => {
    new Bootstrap.Tab(node);
  });
}
