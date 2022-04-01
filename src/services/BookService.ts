import { Book } from "../Models/Book";
import * as fs from "fs";
import { AuthorService } from "./AuthorService";
import { Author } from "../Models/Author";

export class BookService {
    private static _instance: BookService;

    private books: Book[];
    private authorService: AuthorService;

    private constructor() {
        this.authorService = AuthorService.instance;
        this._importBooks();
    }


    public static get instance(): BookService {
        if (BookService._instance == null) {
            BookService._instance = new BookService();
        }

        return BookService._instance;
    }

    private async _importBooks() {

        const file = fs.readFileSync("./Data/Books.csv");
        const data: string = file.toString();

        // split by new line
        const all: string[] = data.split("\n");

        for (let i = 1; i < all.length; i++) {
            const row: string = all[i];
            const elements: string[] = row.split(";");

            // add the authors
            const emails: string[] = elements[2].split(",");
            const authors: Author[] = []
            emails.forEach(email => {
                const author: Author = this.authorService.getAuthorByEmail(email);
                authors.push(author);
            });


            const book: Book = {
                title: elements[0],
                isbn: elements[1],
                authors: authors,
                description: elements[3]
            }

            this.books.push(book);
        }

    }

    public getAllBooks(): Book[] {
        const booksCopy = this.books.map(book => book);
        return booksCopy;
    }

    public getBooksByAuthorEmail(email: string) {
        const booksByAutherEmail: Book[] = this.books.filter(book => {
            const authors = book.authors;
            let hasAuthor = false;
            authors.forEach(author => {
                if (author.email === email)
                    hasAuthor = true
            });
            return hasAuthor;
        });

        return booksByAutherEmail;
    }

}