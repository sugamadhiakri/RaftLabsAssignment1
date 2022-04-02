import { Author } from "../Models/Author";
import * as fs from "fs";
import { listenerCount } from "process";

export class AuthorService {
    private static _instance: AuthorService;

    private authors: Author[];

    private constructor() {
        this._importAuthors();
    }


    public static get instance(): AuthorService {
        if (AuthorService._instance == null) {
            AuthorService._instance = new AuthorService();
        }

        return AuthorService._instance;
    }

    private async _importAuthors() {

        const data: string = fs.readFileSync("./Data/Authors.csv").toString();

        // split by new line
        const all: string[] = data.split("\n");

        for (let i = 1; i < all.length; i++) {
            const row: string = all[i];
            const elements: string[] = row.split(",");
            const author: Author = {
                email: elements[0],
                firstName: elements[1],
                lastName: elements[2]
            }

            this.authors.push(author);
        }
    }

    public getAuthorByEmail(email: string) {

        this.authors.forEach(author => {
            if (author.email === email) return author;
        });

        return null;
    }

    public toStringAuthors(authors: Author[]) {
        let stringValue = "";
        authors.forEach(author => {
            stringValue += author.email + ",";
        });
        return stringValue.substring(0, stringValue.length - 1);
    }
}