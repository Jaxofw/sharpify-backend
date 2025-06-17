import db from '../db/client'
import { GameProps, SportProps, TeamOddsProps, TeamProps } from '../types/games'

const color = {
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  cyan: (msg: string) => `\x1b[36m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
}

function logResult(type: string, msg: string, error?: unknown) {
  if (error) {
    console.error(color.red(`[${type}]: ERROR ${msg}`), error)
  } else {
    console.log(color.green(`[${type}]: ${msg}`))
  }
}

export const addMatchup = async (game: GameProps) => {
  try {
    await addSport(game.sport)
    await addTeam(game.teams.home, game.sport)
    await addTeam(game.teams.away, game.sport)
    await addGame(game)
    await addOdds(game.id, game.teams.home.name, game.teams.home.odds)
    await addOdds(game.id, game.teams.away.name, game.teams.away.odds)
    await addOverUnder(game.id, game.total)
  } catch (error) {
    logResult('ERROR', '', error)
  }
}

const addSport = async (name: SportProps) => {
  try {
    const { data, error } = await db
      .from('sports')
      .select('name')
      .eq('name', name)

    if (error || (data && data.length > 0)) return

    const { error: insertError } = await db.from('sports').insert([{ name }])
    if (insertError) throw insertError

    logResult('SPORT', `Added ${name}`)
  } catch (error) {
    logResult('SPORT', `Adding ${name}`, error)
  }
}

const addTeam = async (team: TeamProps, sport: SportProps) => {
  try {
    const { data, error } = await db
      .from('teams')
      .select('name')
      .eq('name', team.name)
      .eq('sport', sport)

    if (error || (data && data.length > 0)) return

    const { error: insertError } = await db.from('teams').insert([
      {
        name: team.name,
        sport,
      },
    ])
    if (insertError) throw insertError

    logResult('TEAM', `Added ${team.name}`)
  } catch (error) {
    logResult('TEAM', `Adding ${team.name}`, error)
  }
}

const addGame = async (game: GameProps) => {
  try {
    const { data, error } = await db
      .from('games')
      .select('id')
      .eq('id', game.id)
    if (error || (data && data.length > 0)) return

    const { error: insertError } = await db.from('games').insert([
      {
        id: game.id,
        home_team: game.teams.home.name,
        away_team: game.teams.away.name,
        sport: game.sport,
        start_time: game.start_time,
      },
    ])
    if (insertError) throw insertError

    logResult(
      'MATCHUP',
      `Added ${game.teams.home.name} vs ${game.teams.away.name}`
    )
  } catch (error) {
    logResult(
      'MATCHUP',
      `Adding ${game.teams.home.name} vs ${game.teams.away.name}`,
      error
    )
  }
}

const addOdds = async (
  gameId: number,
  teamName: string,
  odds: TeamOddsProps
) => {
  try {
    const categories = [
      {
        category: 'spread',
        ...odds.spread,
      },
      {
        category: 'total',
        ...odds.total,
        odds: null,
      },
      {
        category: 'money',
        ...odds.money,
      },
    ]

    for (const { category, odds, money, tickets } of categories) {
      const query = db
        .from('splits')
        .select('id')
        .eq('category', category)
        .eq('game_id', gameId)
        .eq('team_name', teamName)

      if (odds !== null && odds !== undefined) {
        query.eq('odds', odds)
      } else {
        query.is('odds', null)
      }

      if (money !== null && money !== undefined) {
        query.eq('money', money)
      } else {
        query.is('money', null)
      }

      if (tickets !== null && tickets !== undefined) {
        query.eq('tickets', tickets)
      } else {
        query.is('tickets', null)
      }

      const { data: selectData, error: selectError } = await query

      if ((selectData && selectData.length > 0) || selectError) continue

      const insertObj = {
        category,
        game_id: gameId,
        team_name: teamName,
        odds,
        money,
        tickets,
      }

      const { error: insertError } = await db.from('splits').insert([insertObj])

      if (insertError) throw insertError

      logResult(
        'ODDS',
        `Added ${category} odds for game ${gameId}, team ${teamName}`
      )
    }
  } catch (error) {
    logResult('ODDS', `Adding odds for game ${gameId}, team ${teamName}`, error)
  }
}

const addOverUnder = async (gameId: number, over_under: string) => {
  try {
    const { data, error } = await db
      .from('totals')
      .select('id')
      .eq('game_id', gameId)
      .eq('over_under', over_under)

    if (error || (data && data.length > 0)) return

    const { error: insertError } = await db.from('totals').insert([
      {
        game_id: gameId,
        over_under,
      },
    ])
    if (insertError) throw insertError

    logResult('TOTAL', `Added total line ${over_under} for game ID ${gameId}`)
  } catch (error) {
    logResult('TOTAL', `Adding total line for game ID ${gameId}`, error)
  }
}
