import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import createApp from './app.js'
import { connectDatabase } from './config/database.js'
import { ensureDefaultAdminUser } from './models/userModel.js'
import { ensureUploadDirectories } from './utils/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, 'config.env') })

async function bootstrap() {
  await connectDatabase()
  await ensureDefaultAdminUser()
  await ensureUploadDirectories()

  const app = createApp()
  const port = Number(process.env.PORT ?? 5000)

  const server = app.listen(port, () => {
    console.log(`Ember backend listening on http://localhost:${port}`)
  })

  server.on('error', (error) => {
    if (error?.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Set a different PORT in Backend/config.env and restart the server.`)
      process.exitCode = 1
      return
    }

    console.error('Backend server failed to start.', error)
    process.exitCode = 1
  })
}

bootstrap().catch((error) => {
  console.error('Failed to start backend server.', error)
  process.exitCode = 1
})
