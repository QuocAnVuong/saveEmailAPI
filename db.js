const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb+srv://An:TKixmskFnW5p57f4@cluster0.beuoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
      .then(client => {
        dbConnection = client.db("OutlookMail")
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}