import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jpnxkiylzjraoyqbdwtu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbnhraXlsempyYW95cWJkd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODM5MTYsImV4cCI6MjA5NDc1OTkxNn0._oehtvDoFd6nZpsGv9djlAdZpjG-v08iptA7pxOmXO8'

export const supabase = createClient(supabaseUrl, supabaseKey)