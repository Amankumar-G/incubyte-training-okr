export type keyResult = {
  id: string;
  isCompleted: boolean;
  description: string;
  progress: number;
};

export type OkrDtoType = {
  objective: string;
  keyResults: keyResult[];
};
