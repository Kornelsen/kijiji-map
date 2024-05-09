export type TInput<T> = {
  name: string;
  value: T;
};

export type TScraperOptions = {
  id: number;
  [key: string]: TScraperOptions | number;
};
