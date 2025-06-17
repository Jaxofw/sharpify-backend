import { createClient } from '@supabase/supabase-js'

import { DB } from '../config'

if (!DB.url || !DB.key) {
  throw new Error(
    'Supabase Url or Key is not defined in the environment variables.'
  )
}

const supabase = createClient(DB.url, DB.key)

export default supabase
