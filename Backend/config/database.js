import fs from 'fs/promises'
import { ensureDataFiles, ordersFilePath, productsFilePath, readCollection, usersFilePath } from '../models/dataStore.js'

const DATA_FILES = [usersFilePath, productsFilePath, ordersFilePath]

export async function connectDatabase() {
  await ensureDataFiles()

  for (const filePath of DATA_FILES) {
    await fs.access(filePath)
    await readCollection(filePath, [])
  }

  console.log('DB connection successful')
}
