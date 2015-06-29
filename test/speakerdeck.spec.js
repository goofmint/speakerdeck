import { expect } from 'chai';
import Speakerdeck from '../src/speakerdeck';

describe('Speakerdeck', () => {
  let s;
  beforeEach(() => {
    s = new Speakerdeck();
  });

  it('should be return a user', (done) => {
    s.getUser('paulohp', (err, data) => {
      expect(data.display_name).to.equal('Paulo Pires');
      expect(err).to.be.a('null');
      done();
    });
  });

  it('should be return a user presentation', (done) => {
    s.getUserTalk({username: 'jeffersonlam', talk: 'reflections-from-52-weeks-52-projects'}, (err, data) => {
      expect(data.title).to.equal('Reflections from 52 weeks, 52 projects');
      expect(err).to.be.a('null');
      done();
    });
  });

  it('should be return a category list', (done) => {
    s.getCategories((err, data) => {
      expect(data).to.have.length(18);
      expect(err).to.be.a('null');
      done();
    });
  });

  it('should be search and return a array of results', (done) => {
    s.search({q: 'Angular.js', page: 1}, (err, data) => {
      expect(data.results).to.have.length(15);
      expect(err).to.be.a('null');
      done();
    });
  });
});
