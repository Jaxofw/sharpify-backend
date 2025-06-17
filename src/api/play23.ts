import { API } from '../config'
import { formatData } from '../services/format'
import { GameProps } from '../types/games'
import { Play23ResponseProps } from '../types/play23'

import { addMatchup } from './supabase'

const SPORTS = ['NFL', 'CFB', 'NBA', 'CBB', 'MLB', 'NHL', 'SOC']

const fetchGamesBySport = async (sport: string): Promise<GameProps[]> => {
  const { url, key } = API

  if (!url || !key) {
    console.error(
      'Play23 Api Url or Key is not defined in the environment variables.'
    )
    return []
  }

  const params = {
    apikey: key,
    proxy: 'Odds',
    method: 'GetPublicAction',
    prmSport: sport,
  }

  const query = new URLSearchParams(params).toString()

  try {
    const response = await fetch(`${url}?${query}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const { data }: Play23ResponseProps = await response.json()
    if (!data?.length) return []

    const games: GameProps[] = formatData(data)

    return games
  } catch (error) {
    console.error(`Error fetching sport ${sport}:`, error)
    return []
  }
}

export const fetchGames = async () => {
  const allGames = await Promise.all(
    SPORTS.map((sport) => fetchGamesBySport(sport))
  )

  const games = allGames.flat()

  if (!games.length) {
    console.log('\x1b[33m%s\x1b[0m', '[INFO]: No games found.')
    return
  }

  await Promise.all(games.map((game) => addMatchup(game)))

  console.log(
    '\x1b[32m%s\x1b[0m',
    `[INFO]: Fetched ${games.length} games from Play23 API at ${new Date().toISOString()}`
  )
}
