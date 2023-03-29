export interface Game {
  id: number;
  type: number;
  details: string;
  state: string;
  timestamps: {
    start: number;
    end?: number;
  };
}
