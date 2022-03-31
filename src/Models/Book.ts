import { Author } from "./Author";

export interface Book {
    title: string;
    isbn: string;
    authors: Author[];
    description: string;
}