import { Readable } from "./Readable";
import { Author } from "./Author";

export interface Book extends Readable {
    title: string;
    isbn: string;
    authors: Author[];
    description: string;
}