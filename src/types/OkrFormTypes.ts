export type keyResult = {
  id: string;
  isCompleted: boolean;
  description: string;
  progress: number;
};

export type OkrType = {
  id: string;
  objective: string;
  keyResults: keyResult[];
};
