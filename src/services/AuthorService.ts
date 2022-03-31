import { Author } from "../Models/Author";
import * as fs from "fs";

export class AuthorService {
    private static _instance: AuthorService;

    private authors: Author[];
    private fileLocation: string

    private constructor() {
        this.fileLocation = "\\src\\data\\authors.csv";
        this._importAuthors();
    }


    public static get instance(): AuthorService {
        if (AuthorService._instance == null) {
            AuthorService._instance = new AuthorService();
        }

        return AuthorService._instance;
    }

    private _importAuthors() {
        const data = fs.readFileSync(this.fileLocation);
        console.log(data);
    }
}