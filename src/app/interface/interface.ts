/**
 * Eine Antwortoption einer Frage inklusive aktueller Stimmenzahl.
 */
export interface Option {
  id: number;
  option: string;
  vote: number;
}

/**
 * Eine Frage einer Umfrage mit Antwortoptionen und Auswahlmodus.
 */
export interface Question {
  id: number;
  question: string;
  options: Option[];
  answers: string[];
  allowMultiple: boolean;
}

/**
 * Eine Umfragekategorie.
 */
export interface Categories {
  id: number;
  category: string;
}

/**
 * Eine Umfrage mit Metadaten, Kategorie und zugehörigen Fragen.
 */
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
