import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function main() {
  console.log('Starting connection test...')
  
  // Debug: Print current directory and env file path
  console.log('Current directory:', __dirname)
  console.log('Env file path:', path.resolve(__dirname, '../.env'))
  
  // Check environment variables
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!connectionString) {
    console.error('Error: No database connection string found in environment variables')
    console.error('Available env vars:', Object.keys(process.env).filter(key => !key.startsWith('npm_')))
    process.exit(1)
  }
  
  console.log('Using connection URL:', connectionString.replace(/:[^:@]*@/, ':****@'))
  
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase connections
    }
  })

  try {
    console.log('Attempting to connect to database...')
    await client.connect()
    
    const result = await client.query('SELECT 1 as test')
    console.log('Connection successful:', result.rows)
  } catch (error) {
    console.error('Connection failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    process.exit(1)
  } finally {
    console.log('Disconnecting...')
    await client.end()
    console.log('Disconnected')
  }
}

// Run the main function
if (require.main === module) {
  console.log('Script started')
  main()
  console.log('Main function called')
}

// Export for potential reuse
export { main }