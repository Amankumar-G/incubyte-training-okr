export type keyResult = {
  id: string;
  isCompleted: boolean;
  description: string;
  progress: number;
};

export type keyResultFormType = Omit<keyResult, 'id' | 'isCompleted'>;

export type OkrType = {
  id: string;
  title: string;
  keyResults: keyResult[];
};
