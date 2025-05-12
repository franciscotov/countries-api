const { Country, conn, Activity } = require('../../src/db.js');
const { expect } = require('chai');

describe('Country model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err); 
    }));
  describe('Validators', () => {
    beforeEach(() => Country.sync({ force: false }));
    describe('id', () => {
      it('should throw an error if id is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires a valid id')))
          .catch(() => done()); 
      });
      it('should work when its a valid id', () => {
        Country.create({ id: 'ARG' });
      });
    });
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Country.create({ name: 'Argentina' });
      });
    });

    describe('image', () => {
      it('should throw an error if img is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires a valid img')))
          .catch(() => done());
      });
      it('should work when its a valid img', () => {
        Country.create({ img: 'image.jpg' });
      });
    });
    describe('continent', () => {
      it('should throw an error if continent is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires a valid continent')))
          .catch(() => done());
      });
      it('should work when its a valid continent', () => {
        Country.create({ continent: 'Americas' });
      });
    });
    describe('capital', () => {
      it('should throw an error if capital is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires a valid capital')))
          .catch(() => done());
      });
      it('should work when its a valid capital', () => {
        Country.create({ continent: 'Buenos Aires' });
      });
    });
    describe('minimum to create country', () => {
      it('should throw an error if object is null', (done) => {
        Country.create({})
          .then(() => done(new Error('It requires name, img, continent and capital')))
          .catch(() => done());
      });
      it('error requires name', (done) => {
        Country.create({ id: 'ARG' })
        .then(() => done('No debería haberse creado'))
        .catch(() => done());
      });
      it('error requires img', (done) => {
        Country.create({ 
          id: 'ARG',
          name: 'Buenos Aires' 
        })
        .then(() => done('No debería haberse creado'))
        .catch(() => done());
      });
      it('error requires continent', (done) => { 
        Country.create({
          id: 'ARG',
          name: 'Buenos Aires',
          img: 'img.jpg'
         })
        .then(() => done('No debería haberse creado'))
        .catch(() => done());
      });
      it('error requires a valid img', (done) => {
        Country.create({ 
          id: 'ARG',
          name: 'Buenos Aires',
          img: 43
         })
        .then(() => done('No debería haberse creado, img should be string'))
        .catch(() => done());
      });
      it('error requires capital', (done) => {
        Country.create({
          id: 'ARG', 
          name: 'Buenos Aires',
          img: 'img.formatoinvalido',
          continent : 'Americas'
         })
        .then(() => done('No debería haberse creado'))
        .catch(() => done());
      });
    });
    
  });
});

describe('Activity model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err); 
    }));
  describe('Validators', () => {
    beforeEach(() => Activity.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Activity.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Activity.create({ name: 'Argentina' }); 
      });
    });
  });
});
