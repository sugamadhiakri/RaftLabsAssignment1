import { BookService } from "./services/BookService";
import { MagazineService } from "./services/MagazineService";
import { ReadableService } from "./services/ReadableService";
import * as readline from "readline";
import { exit } from "process";

const bookService = BookService.instance;
const magazineService = MagazineService.instance;
const readableservice = ReadableService.instance;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const displayMenu = () => {
    console.log("\n\nWelcome to Books and Magagines Store.\n");
    console.log("Menu: ");
    console.log("1 to get all the books.");
    console.log("2 to get all the magazines.");
    console.log("3 [isbn] to get book or magazine by isbn.");
    console.log("4 [email] to get book and magazine by author's email.");
    console.log("5 to get book and magazine sorted by their title.");
    console.log("6 [title];[isbn];[email,email];[description] to add book.");
    console.log("7 [title];[isbn];[email,email];[publishedAt] to add magazine.");
    console.log("8 to end the app.");
};



const takeInput = async () => {
    rl.question(">", async answer => {
        switch (answer[0]) {

            case '1':
                displayAllBooks();
                main();
                break;

            case '2':
                displayAllMagazines();
                main();
                break;

            case '3':
                displayBookorMagazineByIsbn(answer.substring(2));
                main();
                break;

            case '4':
                displayBooksAndMagazineByAuthorEmail(answer.substring(2));
                main();
                break;

            case '5':
                displayBooksAndMagazinesSortedByTitle();
                main();
                break;

            case '6':
                addBook(answer.substring(2));
                main();
                break;

            case '7':
                addMagazine(answer.substring(2));
                main();
                break;

            case '8':
                console.log("Thank You!");
                exit();

            default:
                console.log("Invalid Answer! Please try again");
                main();
        }
    });
};

const displayAllBooks = () => {
    const books = bookService.getAllBooks();
    console.log(books);
};

const displayAllMagazines = () => {
    const magazines = magazineService.getAllMagazines();
    console.log(magazines);
};

const displayBookorMagazineByIsbn = (isbn: string) => {
    const book = bookService.getBooksByIsbn(isbn);
    const magazine = magazineService.getMagazinesByIsbn(isbn);

    if (book) {
        console.log(book);
        return;
    }

    if (magazine) {
        console.log(magazine);
        return;
    }

    console.log("No Book or Magazine found with that isbn.");
    return;
};

const displayBooksAndMagazineByAuthorEmail = (email: string) => {
    const booksAndMagazines = readableservice.getBookAndMagazineByAuthorEmail(email);
    console.log(booksAndMagazines);
    if (!booksAndMagazines)
        console.log("Either you got Author's email wrong or this author has no poublication in our database.");
};

const displayBooksAndMagazinesSortedByTitle = () => {
    const booksAndMagazinesSortedByTitle = readableservice.getBooksAndMagazineSortedByTitle();
    console.log(booksAndMagazinesSortedByTitle);
};

const addBook = (bookDetail: string) => {
    bookService.addBook(bookDetail);
};

const addMagazine = (magazineDetail: string) => {
    magazineService.addMagazine(magazineDetail);
};

const main = () => {
    displayMenu();
    takeInput();
};

main();


