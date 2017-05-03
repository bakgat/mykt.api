import * as mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
    title: string,
    isbn: string,
    summary: string,
    authors: [string],
    publishers: [string],
    publishedDate: string,
    pageCount: number,
    language: string,
    imageLinks: {
        smallThumbnail: string,
        thumbnail: string,
    },
    age: {
        min: number,
        max: number
    },
    tags: [string],
    groups: [string],
    notes: string
}

export const BookSchema = new mongoose.Schema({
    title: String,
    isbn: String,
    summary: String,
    authors: [String],
    publishers: [String],
    publishedDate: String,
    pageCount: Number,
    language: String,
    imageLinks: {
        smallThumbnail: String,
        thumbnail: String,
    },
    age: {
        min: Number,
        max: Number
    },
    tags: [String],
    groups: [String],
    notes: String
});

var _model = mongoose.model<IBook>('books', BookSchema);
export const Book = _model;

/*
{
 "kind": "books#volumes",
 "totalItems": 1,
 "items": [
  {
   "kind": "books#volume",
   "id": "sDyQ48ZtJUkC",
   "etag": "LuY+lYCrgHs",
   "selfLink": "https://www.googleapis.com/books/v1/volumes/sDyQ48ZtJUkC",
   "volumeInfo": {
    "title": "Is zoenen ook seks ? / druk 1",
    "authors": [
     "Dirk Musschoot"
    ],
    "publisher": "NBD Biblion Publishers",
    "publishedDate": "2003",
    "description": "Antwoorden op vragen over allerlei zaken die met de verschillen tussen jongens en meisjes, verliefdheid en seks te maken hebben. Met kleurenfoto's en gekleurde tekeningen. Vanaf ca. 10 jaar.",
    "industryIdentifiers": [
     {
      "type": "ISBN_13",
      "identifier": "9789059540125"
     },
     {
      "type": "ISBN_10",
      "identifier": "9059540123"
     }
    ],
    "readingModes": {
     "text": false,
     "image": true
    },
    "pageCount": 45,
    "printType": "BOOK",
    "maturityRating": "NOT_MATURE",
    "allowAnonLogging": false,
    "contentVersion": "1.1.1.0.preview.1",
    "imageLinks": {
     "smallThumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
     "thumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    "language": "nl",
    "previewLink": "http://books.google.be/books?id=sDyQ48ZtJUkC&pg=PT29&dq=9789059540125&hl=&cd=1&source=gbs_api",
    "infoLink": "http://books.google.be/books?id=sDyQ48ZtJUkC&dq=9789059540125&hl=&source=gbs_api",
    "canonicalVolumeLink": "https://books.google.com/books/about/Is_zoenen_ook_seks_druk_1.html?hl=&id=sDyQ48ZtJUkC"
   },
   "saleInfo": {
    "country": "BE",
    "saleability": "NOT_FOR_SALE",
    "isEbook": false
   },
   "accessInfo": {
    "country": "BE",
    "viewability": "PARTIAL",
    "embeddable": true,
    "publicDomain": false,
    "textToSpeechPermission": "ALLOWED",
    "epub": {
     "isAvailable": false
    },
    "pdf": {
     "isAvailable": false
    },
    "webReaderLink": "http://books.google.be/books/reader?id=sDyQ48ZtJUkC&hl=&printsec=frontcover&output=reader&source=gbs_api",
    "accessViewStatus": "SAMPLE",
    "quoteSharingAllowed": false
   }
  }
 ]
}*/