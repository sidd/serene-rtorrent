module.exports = {
  getTorrents () {
    return {
      type: 'TORRENTS',
      payload: {
        promise: Promise.resolve({
          1: {
            id: 1,
            title: 'This.Is.A.Movie.2009-LOL',
            progress: '52.1%',
            seeds: {
              connected: 1,
              total: 5
            },
            peers: {
              connected: 2,
              total: 3
            }
          }
        })
      }
    }
  }
}
