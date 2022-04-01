import { Magazine } from "../Models/Magazine";
import * as fs from "fs";
import * as https from "https";
import { AuthorService } from "./AuthorService";
import { Author } from "../Models/Author";

export class MagazineService {
    private static _instance: MagazineService;

    private magazines: Magazine[];
    private fileLocation: string
    private authorService: AuthorService

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

    public getAllMagazines(): Magazine[] {
        const booksCopy = this.magazines.map(book => book);
        return booksCopy;
    }

    public getMagazinesByAuthorEmail(email: string) {
        const magazinesByAutherEmail: Magazine[] = this.magazines.filter(book => {
            const authors = book.authors;
            let hasAuthor = false;
            authors.forEach(author => {
                if (author.email === email)
                    hasAuthor = true
            });
            return hasAuthor;
        });

        return magazinesByAutherEmail;
    }

}