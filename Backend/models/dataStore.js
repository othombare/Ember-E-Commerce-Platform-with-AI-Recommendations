import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import seedProducts from '../data/seedProducts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.join(__dirname, '..', 'data')

export const usersFilePath = path.join(dataDirectory, 'users.json')
export const productsFilePath = path.join(dataDirectory, 'products.json')
export const ordersFilePath = path.join(dataDirectory, 'orders.json')

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export async function ensureJsonFile(filePath, defaultValue) {
  const exists = await pathExists(filePath)
  if (exists) {
    return
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2))
}

export async function ensureDataFiles() {
  await fs.mkdir(dataDirectory, { recursive: true })
  await ensureJsonFile(usersFilePath, [])
  await ensureJsonFile(productsFilePath, seedProducts)
  await ensureJsonFile(ordersFilePath, [])
}

export async function readCollection(filePath, fallbackValue = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallbackValue
  } catch {
    return fallbackValue
  }
}

export async function writeCollection(filePath, records) {
  await fs.writeFile(filePath, JSON.stringify(records, null, 2))
}
