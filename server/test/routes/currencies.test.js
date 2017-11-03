const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const userJson = require('../data_users');

const should = chai.should();
chai.use(chaiHttp);

describe('Currency route test', () => {
  let token;
  
  before(done => {
    chai.request(server)
    .post('/api/auth/signin')
    .send({
      email: userJson[0].email,
      password: userJson[0].password
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });
  
  it('it should get 401 with currency route match', done => {
    chai.request(server)
    .get('/api/currency')
    .set('Authorization', 'JWT ')
    .end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });
  
  it('it should GET currencies', done => {
    chai.request(server)
    .get('/api/currency')
    .set('Authorization', 'JWT ' + token)
    .end((err, res) => {
      res.should.have.status(200);
      res.type.should.eql('application/json');
      res.body.should.be.a('object');
      res.body.should.have.property('timestamp');
      res.body.should.have.property('RUB');
      res.body.should.have.property('USD');
      res.body.should.have.property('EUR');
      done();
    });
  });
  
});