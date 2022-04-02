import * as http from "http";
import { AuthorService } from "./services/AuthorService";
import { BookService } from "./services/BookService";
import { MagazineService } from "./services/MagazineService";
import { ReadableService } from "./services/ReadableService";

const authorService = AuthorService.instance;
const bookService = BookService.instance;
const magazineService = MagazineService.instance;
const readableservice = ReadableService.instance;

