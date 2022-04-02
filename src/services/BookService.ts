import { Book } from "../Models/Book";
import * as fs from "fs";
import { AuthorService } from "./AuthorService";
import { Author } from "../Models/Author";
import { title } from "process";

export class BookService {
    private static _instance: BookService;

    private books: Book[];
    private authorService: AuthorService;

    private constructor() {
        this.books = [];
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

            const authors: Author[] = emails.map((email: string) => {
                return this.authorService.getAuthorByEmail(email);
            });

            const book: Book = {
                title: elements[0],
                isbn: elements[1],
                authors: authors,
                description: elements[3]
            };

            this.books.push(book);
        }
    }

    private _updateDatabase(book: Book) {
        const authors = this.authorService.toStringAuthors(book.authors);

        const bookString = book.title + ";" + book.isbn + ";" + authors + ";" + book.description;

        fs.writeFileSync("./Data/Books.csv", bookString);
    }


    public getAllBooks(): Book[] {
        if (!this.books) {
            console.log("No Books available.");
            return null;
        }

        const booksCopy = this.books.map(book => book);
        return booksCopy;
    }

    public getBooksByAuthorEmail(email: string) {
        const booksByAutherEmail: Book[] = this.books.filter(book => {
            const authors = book.authors;
            let hasAuthor = false;
            authors.forEach(author => {
                if (author.email === email)
                    hasAuthor = true;
            });
            return hasAuthor;
        });

        return booksByAutherEmail;
    }

    public getBooksByIsbn(isbn: string) {
        const booksByIsbn: Book[] = this.books.filter(book => {
            return book.isbn === isbn;
        });

        return booksByIsbn;
    }

    public addBook(bookcsv: string) {
        const bookDetail = bookcsv.split(";");
        const title = bookDetail[0];
        const isbn = bookDetail[1];
        const description = bookDetail[3];
        const authorEmails = bookDetail[2].split(",");
        let authors: Author[];
        try {
            authors = authorEmails.map(email => {
                const author: Author = this.authorService.getAuthorByEmail(email);
                if (!author) {
                    throw new Error("Aurhor Does Not exist");
                }
                return author;
            });
        } catch (err) {
            console.log(err.message());
            return;
        }

        if (!title || !isbn || !description || !authors) {
            console.log("Add failed because invalid input");
            return;
        }

        const book: Book = {
            title: title,
            isbn: isbn,
            authors: authors,
            description: description
        };

        this.books.push(book);
        this._updateDatabase(book);
    }
}