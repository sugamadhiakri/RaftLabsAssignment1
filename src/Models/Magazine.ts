import { Readable } from "./Readable";
import { Author } from "./Author";

export interface Magazine extends Readable {
    title: string;
    isbn: string;
    authors: Author[];
    publishedAt: string;
}