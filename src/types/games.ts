export type SportProps =
  | 'NFL'
  | 'NCAAF'
  | 'NBA'
  | 'NCAAB'
  | 'MLB'
  | 'NHL'
  | 'SOC'

export type GameProps = {
  id: number
  sport: SportProps
  total: string
  teams: MatchupProps
  start_time: string
}

export type MatchupProps = {
  home: TeamProps
  away: TeamProps
}

export type TeamProps = {
  name: string
  odds: TeamOddsProps
}

export type TeamOddsProps = Record<OddTypeProps, OddsProps>

export type OddTypeProps = 'spread' | 'total' | 'money'

export type OddsProps = {
  odds?: OddsValueProps
  money: OddsValueProps
  tickets: OddsValueProps
}

export type OddsValueProps = number | string
