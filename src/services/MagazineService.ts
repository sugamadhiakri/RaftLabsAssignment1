import { Magazine } from "../Models/Magazine";
import * as fs from "fs";
import { AuthorService } from "./AuthorService";
import { Author } from "../Models/Author";

export class MagazineService {
    private static _instance: MagazineService;

    private magazines: Magazine[];
    private authorService: AuthorService;

    private constructor() {
        this.magazines = [];
        this.authorService = AuthorService.instance;
        this._importMagazines();
    }


    public static get instance(): MagazineService {
        if (MagazineService._instance == null) {
            MagazineService._instance = new MagazineService();
        }

        return MagazineService._instance;
    }

    private async _importMagazines() {

        const file = fs.readFileSync("./Data/Magazines.csv");
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

            const magazine: Magazine = {
                title: elements[0],
                isbn: elements[1],
                authors: authors,
                publishedAt: elements[3]
            };

            this.magazines.push(magazine);
        }

    }

    private _updateDatabase(magazine: Magazine) {
        const authors = this.authorService.toStringAuthors(magazine.authors);

        const magazineString = magazine.title + ";" + magazine.isbn + ";" + authors + ";" + magazine.publishedAt;

        fs.writeFileSync("./Data/Magazine.csv", magazineString);
    }

    public getAllMagazines(): Magazine[] {
        if (!this.magazines) {
            console.log("Magazines is empty.");
            return null;
        }
        const magazinesCopy = this.magazines.map(magazine => magazine);
        return magazinesCopy;
    }

    public getMagazinesByAuthorEmail(email: string) {
        const magazinesByAutherEmail: Magazine[] = this.magazines.filter(magazine => {
            const authors = magazine.authors;
            let hasAuthor = false;
            authors.forEach(author => {
                if (author.email === email)
                    hasAuthor = true;
            });
            return hasAuthor;
        });

        return magazinesByAutherEmail;
    }

    public getMagazinesByIsbn(isbn: string) {
        const magazinesByIsbn: Magazine[] = this.magazines.filter(magazine => {
            return isbn === magazine.isbn;
        });

        return magazinesByIsbn;
    }

    public addMagazine(bookcsv: string) {
        const magazineDetail = bookcsv.split(";");
        const title = magazineDetail[0];
        const isbn = magazineDetail[1];
        const publishedAt = magazineDetail[3];
        const authorEmails = magazineDetail[2].split(",");
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

        if (!!title && !!isbn && !!publishedAt && !!authors) {
            console.log("Add failed because invalid input");
            return;
        }

        const magazine: Magazine = {
            title: title,
            isbn: isbn,
            authors: authors,
            publishedAt: publishedAt
        };

        this.magazines.push(magazine);
        this._updateDatabase(magazine);
    }

}