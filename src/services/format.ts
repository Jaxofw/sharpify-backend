import { GameProps, SportProps } from '../types/games'
import { Play23GameProps } from '../types/play23'

export const formatData = (games: Play23GameProps[]): GameProps[] => {
  return games.map((game) => ({
    id: game.IdGame,
    sport: getSportName(game.Sport),
    total: game.Odds[2],
    teams: {
      away: {
        id: game.VisitorNumber,
        name: game.VisitorTeam,
        odds: {
          spread: {
            odds: game.Odds[0],
            money: getOddValue(game.action[1]),
            tickets: getOddValue(game.action[0]),
          },
          total: {
            money: getOddValue(game.action[5]),
            tickets: getOddValue(game.action[4]),
          },
          money: {
            odds: game.Odds[4],
            money: getOddValue(game.action[9]),
            tickets: getOddValue(game.action[8]),
          },
        },
      },
      home: {
        id: game.HomeNumber,
        name: game.HomeTeam,
        odds: {
          spread: {
            odds: game.Odds[5],
            money: getOddValue(game.action[3]),
            tickets: getOddValue(game.action[2]),
          },
          total: {
            money: getOddValue(game.action[7]),
            tickets: getOddValue(game.action[6]),
          },
          money: {
            odds: game.Odds[9],
            money: getOddValue(game.action[11]),
            tickets: getOddValue(game.action[10]),
          },
        },
      },
    },
    start_time: game['ScheduledStart:'],
  }))
}

const getSportName = (name: string): SportProps => {
  const trimmedName = name.trim()

  switch (trimmedName) {
    case 'CFB':
      return 'NCAAF'
    case 'CBB':
      return 'NCAAB'
    default:
      return trimmedName as SportProps
  }
}

const getOddValue = (value: number | boolean): number => {
  return typeof value === 'number' ? value : 0
}
