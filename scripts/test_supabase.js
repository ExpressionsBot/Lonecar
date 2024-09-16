import { createClient } from '@supabase/supabase-js'

// Parse command-line arguments
const args = process.argv.slice(2)
const supabaseUrl = args[0]
const supabaseKey = args[1]

if (!supabaseUrl || !supabaseKey) {
  console.error('Please provide Supabase URL and key as command-line arguments')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

const MESSAGES_TABLE = 'conversations'

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')

  try {
    // Test connection
    const { data, error } = await supabase.from(MESSAGES_TABLE).select('count(*)')
    if (error) throw error
    console.log('Successfully connected to Supabase')
    console.log(`Number of records in ${MESSAGES_TABLE}: ${data[0].count}`)

    // Test insertion
    const testMessage = {
      sender: 'test_user',
      content: 'This is a test message',
      session_id: 'test_session'
    }

    const { data: insertData, error: insertError } = await supabase
      .from(MESSAGES_TABLE)
      .insert(testMessage)
      .select()

    if (insertError) throw insertError
    console.log('Successfully inserted test message:', insertData[0])

    // Test retrieval
    const { data: retrieveData, error: retrieveError } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .eq('id', insertData[0].id)
      .single()

    if (retrieveError) throw retrieveError
    console.log('Successfully retrieved test message:', retrieveData)

    // Clean up (delete test message)
    const { error: deleteError } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq('id', insertData[0].id)

    if (deleteError) throw deleteError
    console.log('Successfully deleted test message')

  } catch (error) {
    console.error('Error during Supabase test:', error)
  }
}

testSupabaseConnection()