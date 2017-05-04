import * as mongoose from 'mongoose';

import * as async from 'async';

let ObjectId = mongoose.Types.ObjectId;

export const collections = {
    roles: [
        { "_id": ObjectId("58de4f9910cb3b7a18e1171b"), "name": "admin", "permissions": ["student", "staff"] },
        { "_id": ObjectId("58de4f9c10cb3b7a18e1171c"), "name": "sa" },
        { "_id": ObjectId("58ec946510cb3b7a18e1171d"), "name": "teacher", "permissions": ["student:list", "student:get"] }
    ],
    groups: [
        { "_id": ObjectId("58d6e2e63e17d80fc4c5f411"), "name": "Kuifje", "level": "L1" },
        { "_id": ObjectId("58d6e3003e17d80fc4c5f412"), "name": "Lambik", "level": "L1" }
    ],
    staff: [
        { "_id": ObjectId("58da67d410cb3b7a18e11716"), "first_name": "Frauke", "last_name": "Taecke", "username": "frauke.taecke@klimtoren.be", "gender": "F", "roles": ["admin", "sa"], "groups": [], "password": "$2a$08$2LHSLPEsnwgr.VZ1VQqgdet241jh63aShCif1RNWhopoKw2K6CVZm" },
        { "_id": ObjectId("58da67e910cb3b7a18e11717"), "first_name": "Sophie", "last_name": "Haelemeersch", "username": "sophie.haelemeersch@klimtoren.be", "gender": "F", "password": "$2a$08$2LHSLPEsnwgr.VZ1VQqgdet241jh63aShCif1RNWhopoKw2K6CVZm", "roles": ["teacher"] }
    ],
    students: [
        { "_id": ObjectId("58d528003e17d80fc4c5f410"), "id": "5678", "first_name": "Rebekka", "last_name": "Buyse", "school_id": "0000002", "birthday": new Date("1968-04-30") },
        { "_id": ObjectId("58da34163e17d80fc4c5f416"), "first_name": "Karl", "last_name": "Van Iseghem", "school_id": "0000001", "id": "1234", "groups": [{ "_id": ObjectId("58da4c3f3e17d80fc4c5f42d"), "name": "Lambik", "start": new Date("2015-09-01"), "end": new Date("2016-06-30") }, { "_id": ObjectId("58da4c423e17d80fc4c5f42e"), "name": "Kuifje", "start": new Date("2016-09-01") }] }
    ],
    kivafiles: [
        {
            "_id": ObjectId("58fbb18b71ba420bb9f241d2"),
            "first_entry": {
                "date": new Date("2017-04-22T19:39:55.812Z"),
                "victim": {
                    "_id": ObjectId("58da34163e17d80fc4c5f416"),
                    "display_name": "Karl Van Iseghem",
                    "group": "Kuifje"
                },
                "summary": "Het verhaal dat verteld moet worden.",
                "estimated_times": "2x per week",
                "last_bully_date": new Date("2017-04-22T19:39:55.812Z"),
                "bully_timespan": "voorbije 6 maanden",
                "conclusion": "Supporters",
                "_id": ObjectId("58fbb18b71ba420bb9f241d3"),
                "bullies": [{ "_id": ObjectId("58d528003e17d80fc4c5f410"), "display_name": "Rebekka Buyse", "group": "Lambik" }],
                "announcer": { "type": "parent", "display_name": "Armand Van Iseghem" }
            },
            "evaluations": [], "follow_ups": [], "actions": [],
        }
    ],
    books: [
        {
            "_id": ObjectId("5909a1dd25ef9776e187759f"),
            "title": "Is zoenen ook seks ? / druk 1",
            "isbn": "9789059540125",
            "summary": "Antwoorden op vragen over allerlei zaken die met de verschillen tussen jongens en meisjes, verliefdheid en seks te maken hebben. Met kleurenfoto's en gekleurde tekeningen. Vanaf ca. 10 jaar.",
            "authors": ["Dirk Musschoot"],
            "publishers": ["NBD Biblion Publishers"],
            "publishedDate": "2003",
            "pageCount": 45,
            "language": "nl",
            "imageLinks": {
                "smallThumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                "thumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            "age": {
                "min": 10
            },
            tags: ["seksualiteit", "fantaseren"],
            groups: ["seks", "geboorte", "prentenboek"]
        }, {
            "_id": ObjectId("5909a40025ef9776e18775a0"),
            "title": "De Paraplu / druk 1",
            "isbn": "9789047702757",
            "summary": "Als een klein hondje op een regenachtige dag een paraplu vindt, steekt er een windvlaag op. De paraplu en het hondje worden meegevoerd tot ver boven de wolken. Het begin van een wonderbaarlijke reis om de wereld vol avonturen. De Schuberts overtreffen zichzelf met dit avontuurlijke, kleurrijke prentenboek vol onver wachte details. De paraplu is een verrassend, nieuw, tekstloos prentenboek - en een reis om keer op keer te maken.",
            "authors": ["Ingrid Schubert", "Dieter Schubert"],
            "publishers": ["Lemniscaat"],
            "publishedDate": "2014",
            "pageCount": 36,
            "language": "nl",
            "imageLinks": {
                "smallThumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                "thumbnail": "http://books.google.com/books/content?id=sDyQ48ZtJUkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            "age": {
                "min": 3
            },
            tags: ["wereldreizen", "fantaseren"],
            groups: ["prentenboek", "leeswelp"]
        }
    ]
}

export function run() {
    let uri = 'mongodb://localhost/mykt-test';
    mongoose.connect(uri, (err) => {
        if (err) {
            console.log(err.message);
            console.log(err);
        } else {
            console.log('Connected to MongoDB');

            var names = Object.keys(collections);
            var i = 0;
            async.each(names, (name, cb) => {
                if (mongoose.connection.collection(name)) {
                    var collection = mongoose.connection.collections[name];
                    collection.drop(err => {
                        if (err && err.message != 'ns not found') cb(err);
                        mongoose.connection.collection(name).insert(collections[name], () => {
                            if (++i === names.length) {
                                mongoose.connection.close();
                                console.log('Done and closed connection');
                                cb();
                            }
                        });
                    });

                } else {
                    mongoose.connection.collection(name).insert(collections[name], () => {
                        if (++i === names.length) {
                            mongoose.connection.close();
                            console.log('Done and closed connection');
                            cb();
                        }
                    });
                }

            }, err => {
                console.log(err);
            });

        }
    });

}
run();
