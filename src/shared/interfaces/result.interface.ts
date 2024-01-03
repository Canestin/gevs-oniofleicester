export enum StatusType {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
}

export interface ResultsByConstituency {
  constituency: string;
  result: Array<ResultsByCandidate>;
}

export type ResultsByCandidate = {
  name: string;
  party: string;
  vote: number;
};

export interface Results {
  status: 'Completed' | 'Pending';
  winner: string;
  seats: Seats;
}

export type Seats = Array<{
  party: string;
  seat: number;
}>;
