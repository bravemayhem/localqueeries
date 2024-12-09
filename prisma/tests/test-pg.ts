import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function testConnection(type: 'development' | 'production') {
  console.log(`Testing ${type} connection...`)
  
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
    
  } catch (error) {
    console.error('Connection failed:', error)
    throw error
  } finally {
    await client.end()
    console.log('Connection closed')
  }
}

// Run tests
async function main() {
  try {
    await testConnection('development')
    console.log('\n-------------------\n')
    await testConnection('production')
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

main()