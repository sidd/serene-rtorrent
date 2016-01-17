// handler for unhandled promise rejections,
// only needed in node
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', function (reason, p) {
    console.error(p)
  })
}
