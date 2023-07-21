const filteredLogs = [
  "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information."
]

const filterBrowserLogs = (log) => {
  for (const arg of log.args) {
    if (typeof arg === "string" && filteredLogs.some(l => arg.includes(l))) {
      return false;
    }
  }
  return true;
}

export default {
  files: "test/**/*_test.js",
  nodeResolve: true,
  filterBrowserLogs,
  mimeTypes: {},
  plugins: []
}
