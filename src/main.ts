import { fetchGames } from './api/play23'

setInterval(fetchGames, 30 * 1000) // Fetch every 30 seconds
