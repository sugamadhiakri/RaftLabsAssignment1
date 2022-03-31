import { Author } from "./Author";

export interface Magazine {
    title: string;
    isbn: string;
    authors: Author[];
    publishedAt: string;
}