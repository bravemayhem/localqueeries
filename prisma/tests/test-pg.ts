import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function testConnection(type: 'development' | 'production') {
  console.log(`\nTesting ${type} connection...`)
  
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('Error: DATABASE_URL not found in environment variables')
    process.exit(1)
  }
  
  console.log('Using connection URL:', connectionString.replace(/:[^:@]*@/, ':****@'))
  
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Attempting to connect...')
    await client.connect()
    
    // Test query
    const result = await client.query('SELECT NOW() as time')
    console.log(`Connection successful! Database time: ${result.rows[0].time}`)
    
    // Test prepared statement
    await client.query('PREPARE test_stmt AS SELECT $1::text')
    console.log('Prepared statement created successfully')
    
    // Cleanup
    await client.query('DEALLOCATE test_stmt')
    console.log('Prepared statement cleaned up')
    
    return true
  } catch (error) {
    console.error(`Connection failed for ${type}:`, error)
    return false
  } finally {
    await client.end()
    console.log('Connection closed')
  }
}

// Run tests
async function main() {
  console.log('Starting database connection tests...')
  
  try {
    const devSuccess = await testConnection('development')
    console.log('\n-------------------\n')
    
    if (devSuccess) {
      console.log('Development connection successful, testing production...')
      const prodSuccess = await testConnection('production')
      
      if (devSuccess && prodSuccess) {
        console.log('\nAll connection tests passed successfully! 🎉')
        process.exit(0)
      } else {
        console.error('\nSome connection tests failed')
        process.exit(1)
      }
    } else {
      console.error('\nDevelopment connection failed, skipping production test')
      process.exit(1)
    }
  } catch (error) {
    console.error('\nTest execution failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { testConnection }