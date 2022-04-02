import { Magazine } from "../Models/Magazine";
import * as fs from "fs";
import { AuthorService } from "./AuthorService";
import { Author } from "../Models/Author";

export class MagazineService {
    private static _instance: MagazineService;

    private magazines: Magazine[];
    private authorService: AuthorService;

    private constructor() {
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
            const authors: Author[] = []
            emails.forEach(email => {
                const author: Author = this.authorService.getAuthorByEmail(email);
                authors.push(author);
            });


            const magazine: Magazine = {
                title: elements[0],
                isbn: elements[1],
                authors: authors,
                publishedAt: elements[3]
            }

            this.magazines.push(magazine);
        }

    }

    private _updateDatabase(magazine: Magazine) {
        const authors = this.authorService.toStringAuthors(magazine.authors);

        const magazineString = magazine.title + ";" + magazine.isbn + ";" + authors + ";" + magazine.publishedAt;

        fs.writeFileSync("./Data/Magazine.csv", magazineString);
    }

    public getAllMagazines(): Magazine[] {
        const magazinesCopy = this.magazines.map(magazine => magazine);
        return magazinesCopy;
    }

    public getMagazinesByAuthorEmail(email: string) {
        const magazinesByAutherEmail: Magazine[] = this.magazines.filter(magazine => {
            const authors = magazine.authors;
            let hasAuthor = false;
            authors.forEach(author => {
                if (author.email === email)
                    hasAuthor = true
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

    public addMagazine(title: string, isbn: string, authorEmails: string[], publishedAt: string) {
        const authors: Author[] = [];
        authorEmails.forEach(authorEmail => {
            const authorObj = this.authorService.getAuthorByEmail(authorEmail);
            authors.push(authorObj);
        });

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