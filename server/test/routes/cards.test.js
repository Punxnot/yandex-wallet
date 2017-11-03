const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const userJson = require('../data_users');

const should = chai.should();
chai.use(chaiHttp);

describe('Cards routes tests', () => {
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

    it('it should get 401 with cards route match', done => {
        chai.request(server)
            .get('/api/cards')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    describe('/GET cards', () => {
        it('it should GET all the cards in db', done => {
            chai.request(server)
                .get('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('cardNumber');
                    res.body[0].should.have.property('currency');
                    res.body[0].should.have.property('exp');
                    res.body[0].should.have.property('balance');
                    res.body[0].should.have.property('name');
                    done();
                });
        });

        it('it should GET card from db with id', done => {
            chai.request(server)
                .get('/api/cards/59e9ce16131a183238cc784e')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql('59e9ce16131a183238cc784e');
                    res.body.should.have.property('cardNumber').eql('5469259469067206');
                    res.body.should.have.property('currency').eql('RUB');
                    res.body.should.have.property('exp').eql('04/18');
                    res.body.should.have.property('balance').eql(15000);
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
                    done();
                });
        });

        it('it should GET 400 status with invalid id', done => {
            chai.request(server)
                .get('/api/cards/555f5d5fd5f5df')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('id is invalid');
                    done();
                });
        });

        it('it should GET 404 status with not real id', done => {
            chai.request(server)
                .get('/api/cards/59e952a6372cf01550abe904')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('card with id=59e952a6372cf01550abe904 not found');
                    done();
                });
        });
    });

    describe('/POST new card', () => {
        it('it should not POST new card with empty body', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('properties required');
                    done();
                });
        });

        it('it should not POST new card with empty cardNumber', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: ''
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('properties required');
                    done();
                });
        });

        it('it should not POST new card with non valid cardNumber', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: '15133306216010173046',
                    currency: 'RUB',
                    exp: '04/18',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('card validation failed: cardNumber: valid cardNumber required');
                    done();
                });
        });

        it('it should not POST new card with non valid exp date', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: '5483874041820682',
                    currency: 'USD',
                    exp: '01/10',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('card validation failed: exp: non expired card required');
                    done();
                });
        });

        it('it should not POST new card with existing cardNumber', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: '5469259469067206',
                    currency: 'EUR',
                    exp: '04/30',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('card validation failed: cardNumber: Error, expected `cardNumber` to be unique. Value: `5469259469067206`')
                    done();
                });
        });
        
        it('it should not POST new card with invalid currency', done => {
             chai.request(server)
                 .post('/api/cards')
                 .set('Authorization', 'JWT ' + token)
                 .send({
                   cardNumber: '5483874041820682',
                   currency: 'JPY',
                   exp: '04/30',
                   name: 'ALYSSA LIVINGSTON',
                 })
                 .end((err, res) => {
                   res.should.have.status(400);
                   res.body.should.have.property('message').eql('card validation failed: currency: valid currency is required');
                   done();
                 });
        });

        it('it should POST new card with balance', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: '5483874041820682',
                    currency: 'RUB',
                    exp: '04/30',
                    name: 'ALYSSA LIVINGSTON',
                    balance: 10000
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('cardNumber').eql('5483874041820682');
                    res.body.should.have.property('currency').eql('RUB');
                    res.body.should.have.property('balance').eql(10000);
                    res.body.should.have.property('exp').eql('04/30');
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
                    res.body.should.have.property('userId').eql(userJson[0]._id.toString());

                    done();
                });
        });

        it('it should POST new card with zero balance', done => {
            chai.request(server)
                .post('/api/cards')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardNumber: '5483874041820682',
                    currency: 'EUR',
                    exp: '04/30',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('cardNumber').eql('5483874041820682');
                    res.body.should.have.property('currency').eql('EUR');
                    res.body.should.have.property('balance').eql(0);
                    res.body.should.have.property('exp').eql('04/30');
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
                    res.body.should.have.property('userId').eql(userJson[0]._id.toString());
                    
                    done();
                });

        });
    });

    describe('/DELETE card', () => {
        it('it should not DELETE card with empty id', done => {
            chai.request(server)
                .delete('/api/cards/')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(405);
                    done();
                });
        });

        it('it should not DELETE card with invalid id', done => {
            chai.request(server)
                .delete('/api/cards/a')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not DELETE card with not real id', done => {
            chai.request(server)
                .delete('/api/cards/59e9ce16131a183238cc7844')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should DELETE card with real id', done => {
            chai.request(server)
                .delete('/api/cards/59e9ce16131a183238cc784e')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});