import * as mocha from 'mocha';
import * as chai from 'chai';
import * as mongoose from 'mongoose';
import { auth } from '../../src/auth/index';
import { JSONError } from '../../src/shared/jsonerror';

const expect = chai.expect;

describe('Login for Staff', () => {
    it('should create a JWT', () => {
        return auth.login('frauke.taecke@klimtoren.be', 'password')
            .then(result => {
                expect(result).to.exist;
                expect(result).to.have.all.keys([
                    'token',
                    'user',
                    'expires'
                ]);
                expect(result.token).to.be.an('string');
            });
    });
    it('should throw invalid credentials', () => {
        return auth.login('frauke.taecke@klimtoren.be', 'wrong')
            .catch(err => {
                expect(err).to.exist;
                expect(err.status).to.equal(401);
            });
    });
});