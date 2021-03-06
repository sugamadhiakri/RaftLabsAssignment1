import { Readable } from "../Models/Readable";
import { Book } from "../Models/Book";
import { Magazine } from "../Models/Magazine";
import { BookService } from "./BookService";
import { MagazineService } from "./MagazineService";

export class ReadableService {
    private static _instance: ReadableService;

    private readables: Readable[];
    private bookService: BookService;
    private magazineService: MagazineService;


    private constructor() {
        this.bookService = BookService.instance;
        this.magazineService = MagazineService.instance;
        this.readables = [];
    }

    public static get instance(): ReadableService {
        if (ReadableService._instance == null) {
            ReadableService._instance = new ReadableService();
        }

        return ReadableService._instance;
    }

    public getBooksAndMagazineSortedByTitle() {
        // Setup readables
        const books: Book[] = this.bookService.getAllBooks();
        const magazines: Magazine[] = this.magazineService.getAllMagazines();
        this.readables = [...books, ...magazines];

        const sortedBooksAndMagazines = this.readables.sort((s1, s2) => {
            if (s1.title.toLocaleLowerCase() > s2.title.toLocaleLowerCase()) return 1;
            if (s1.title.toLocaleLowerCase() < s2.title.toLocaleLowerCase()) return -1;
            return 0;
        });

        return sortedBooksAndMagazines;
    }

    public getBookAndMagazineByAuthorEmail(email: string) {
        const booksByAuthorEmail = this.bookService.getBooksByAuthorEmail(email);
        const magazinesByAuthorEmail = this.magazineService.getMagazinesByAuthorEmail(email);

        return [...booksByAuthorEmail, ...magazinesByAuthorEmail];
    }

}