export interface Option {
  id: number;
  option: string;
  vote: number;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  answers: string[];
  allowMultiple: boolean;
}

export interface Categories {
  id: number;
  category: string;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  endDate: string;
  categoryId: number;
  categories: Categories;
  pollQuestion: Question[];
  category?: string;
}
