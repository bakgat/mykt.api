export class JSONError  extends Error {
    status: Number;
    message: string;
    errors: Array<any>;
    constructor(error?: any, status?: Number) {
        super();
        if (status) {
            this.status = status;
            this.errors = error && error.errors ? error.errors : [error];
            switch (status) {
                case 404:
                    this.message = 'Uh oh! I still haven\'t found what you\'re looking for.';
                    break;
                case 500:
                    this.message = 'Uh oh! I did something wrong';
                    break;
                default:
                    this.message = 'Uh oh! Something went wrong, but I don\'t know what... :(';
                    break;
            }
        } else {
            this.parse(error);
        }
    }
    private parse(err) {
        if (err.name == 'ValidationError') {
            this.status = 400;
            this.message = 'Uh oh! I believe that your request contains some validation errors.';
            this.errors = err.errors;
        } else {
            this.status = 500;
            this.message = 'Uh oh! I did something wrong';
            this.errors = [err];
        }
    }
}