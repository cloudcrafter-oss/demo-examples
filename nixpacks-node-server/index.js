const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const StorageService = require('./storage')

// Middleware to parse JSON bodies
app.use(express.json())

// Initialize storage service
const storage = new StorageService(process.env.STORAGE_PATH)

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

app.get('/all-env', (req, res) => {
  try {
    // Convert the process.env object to a more readable format
    const envVariables = JSON.stringify(process.env, null, 2)
    res.setHeader('Content-Type', 'application/json')
    res.send(envVariables)
  } catch (error) {
    res.status(500).send(`Error retrieving environment variables: ${error.message}`)
  }
})

// GET endpoint to retrieve stored data
app.get('/store/:filename', (req, res) => {
  try {
    const data = storage.getData(req.params.filename)
    res.json(data)
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
})

// Store data handler (used by both GET and POST)
const storeDataHandler = (req, res) => {
  try {
    // Get data from either query parameters (GET) or request body (POST)
    const data = req.method === 'GET' ? req.query : req.body
    const { filename, ...dataToStore } = data
    
    // If no data provided, return error
    if (Object.keys(dataToStore).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to store'
      })
    }

    const filepath = storage.saveData(dataToStore, filename)
    
    res.json({
      success: true,
      message: 'Data stored successfully',
      filepath: filepath,
      data: dataToStore,
      method: req.method
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error storing data: ${error.message}`
    })
  }
}

// Handle both GET and POST requests for storing data
app.route('/store')
  .get(storeDataHandler)
  .post(storeDataHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})