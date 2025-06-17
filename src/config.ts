import dotenv from 'dotenv'

dotenv.config()

export const API = {
  url: process.env.API_URL,
  key: process.env.API_KEY,
}

export const DB = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
}
