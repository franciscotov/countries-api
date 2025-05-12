/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Country, conn } = require('../../src/db.js');

const agent = session(app);
const country = {
  id:"AAA",
  activities: [],
  name: 'Argentina',
  img: 'img.jpg',
  continent : 'Americas',
  capital: 'Buenos Aires',
  subRegion: 'South Americas', 
  area: 4000,
  population: 45000000
}, country2 = { 
  id:"BBB",
  activities: [],
  name: 'Brazil',
  img: 'imgBrazil.jpg',
  continent : 'Americas',
  capital: 'Brasilia',
  subRegion: 'South Americas',
  area: 400000,
  population: 209500000 
}, country3 = {
  id:"EEE",
  activities: [],
  name: 'Spain',
  img: 'imgSpain.jpg',
  continent : 'Europe',
  capital: 'Madrid',
  subRegion: 'Southern Europe',
  area: 400000,
  population: 46438422
}, wrongCountry = {
  id:1,
  img: 'imgSpain.jpg',
  continent : 'Europe',
  capital: 'Madrid',
  subRegion: 'Southern Europe',
  area: 400000,
  population: 46438422
}



describe('Country routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err); 
  }));
  beforeEach(() => Country.sync({ force: false })
    .then(() => {
      // Country.create(country);
      // Country.create(country2);
      // Country.create(country3);
      return Promise.all([Country.create(country), Country.create(country2), Country.create(country3)])
    }));
  describe('GET /countries', () => {
    it('should get 200', () =>
      agent.get('/countries').expect(200) 
    );
    it('should be json', () =>
      agent.get('/countries').expect('Content-Type', /json/)
    );
    it('should have three elements', () =>
      agent.get('/countries').then(res => expect(res.body).to.have.length(3))
    );
    it('should be an array', () =>
      agent.get('/countries').then(res => expect(res.body).to.be.an('array'))
    );
    it('should be an array', () =>
      agent.get('/countries').then(res => expect(res.body[0]).to.be.an('object'))
    );
    it('should be an array', () =>
      agent.get('/countries').then(res => expect(res.body[0].id).to.be.an('string'))
    );
    it('should have an property id', () =>
      agent.get('/countries').then(res => expect(res.body[0]).to.have.a.property('id'))
    );
    // colocarque debe tener una respuesta maxima de 10
  });
  // expect({b: 2}).to.have.a.property('b');
  describe('GET /countries/:id', () => {
    it('should get 200', () =>
      agent.get('/countries/AAA').expect(200)
    );
    it('should be json', () =>
      agent.get('/countries/AAA').expect('Content-Type', /json/)
    );
    it('should be an object', () =>
      agent.get('/countries/AAA').then(res => expect(res.body).to.be.an('object'))
    );
    it('should be an array', () =>
      agent.get('/countries/AAA').then(res => expect(res.body.id).to.be.an('string'))
    );
    it('should have an property id', () =>
      agent.get('/countries/AAA').then(res => expect(res.body).to.have.a.property('id'))
    );
  });
  describe('GET /countries?name="nameCountry"', () => {
    it('should get 200', () =>
      agent.get('/countries?name=Argentina').expect(200) 
    );
    it('should be json', () =>
      agent.get('/countries?name=Brazil').expect('Content-Type', /json/)
    );
    it('should be an array', () =>
      agent.get('/countries?name=Brazil').then(res => expect(res.body).to.be.an('array'))
    );
    it('should be an object', () =>
      agent.get('/countries?name=brazil').then(res => expect(res.body[0]).to.be.an('object')) 
    );
    it('should be equal to country2', () =>
      agent.get('/countries?name=brazil').then(res => expect(res.body[0]).to.deep.equal(country2))
    );
    it('should have an property id', () =>
      agent.get('/countries?name=brazil').then(res => expect(res.body[0]).to.have.a.property('id'))
    );
  });
});
