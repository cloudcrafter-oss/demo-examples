const fs = require('fs')
const path = require('path')

class StorageService {
  constructor(storagePath) {
    this.storagePath = storagePath || './storage'
    this.ensureStorageDirectory()
  }

  ensureStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true })
    }
  }

  generateFilename(filename) {
    if (filename) {
      return `${filename}.json`
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `${timestamp}.json`
  }

  getFilePath(filename) {
    return path.join(this.storagePath, this.generateFilename(filename))
  }

  saveData(data, filename) {
    const filepath = this.getFilePath(filename)
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
    return filepath
  }

  getData(filename) {
    const filepath = this.getFilePath(filename)
    if (!fs.existsSync(filepath)) {
      throw new Error('File not found')
    }
    const data = fs.readFileSync(filepath, 'utf8')
    return JSON.parse(data)
  }
}

module.exports = StorageService 