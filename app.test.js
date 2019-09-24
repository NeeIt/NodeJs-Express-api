let app = require('./app').app;
let mocha = require('mocha');
let asset = require('chai');
let expect = asset.expect;
let req = require('supertest');

let api = '/api'
describe('requests test', groups);
function groups() {
    this.timeout(7000);
    context('POST', group1);
    context('GET', group2);
    context('PUT', group3);
    context('DELETE', group4);
}
function group1() {
    it('should add new user', (done) => {
        req(app).get(api+"/users").send('name=Tom;age=23').set('Accept','application/json').then(user=>{
            expect(user).to.be.an('object');
            console.log(user);
            done();
        })
    })
}
function group2() {
    it('should get an user', () => {

    })
    it('should get all user', () => {

    })
}
function group3() {
    it('should update an user', () => {

    })
}
function group4() {
    it('should delete an user', () => {

    })
}
