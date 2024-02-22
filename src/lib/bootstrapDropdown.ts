export function dropdown(node) {
  import("bootstrap").then((Bootstrap) => {
    new Bootstrap.Dropdown(node);
  });
}
