export function tooltip(node) {
  import("bootstrap").then((Bootstrap) => {
    new Bootstrap.Tooltip(node);
  });
}
