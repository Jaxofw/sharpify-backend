export type Play23ResponseProps = {
  data: Play23GameProps[]
}

export type Play23SportProps =
  | 'NFL'
  | 'CFB'
  | 'NBA'
  | 'CBB'
  | 'MLB'
  | 'NHL'
  | 'SOC'

export type Play23GameProps = {
  IdGame: number
  Sport: Play23SportProps
  Open: number
  'ScheduledStart:': string
  VisitorNumber: number
  VisitorTeam: string
  HomeNumber: number
  HomeTeam: string
  Odds: string[]
  action: (number | boolean)[]
}
