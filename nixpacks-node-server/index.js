const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/env', (req, res) => {
  const dummyEnvVar = process.env.DUMMY_ENV_VAR
  if(!dummyEnvVar) {
    res.status(500).send('DUMMY_ENV_VAR not set')
  }

  res.send(`DUMMY_ENV_VAR: ${dummyEnvVar}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})