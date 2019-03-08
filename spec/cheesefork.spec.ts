import {expect} from 'chai';

import * as cheesefork from '../src/cheesefork';

describe('Cheesefork API', () => {
  it('Should correctly convert URLs into names', () => {
    expect(
        cheesefork.catalogNameFromUrl(
            'https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201802.min.js'))
        .to.equal('Cheesefork 201802');
  });
});

describe('Cheesefork API Integration test', () => {
  it('Should fetch reasonable-looking catalogs', () => {
    return cheesefork.getCatalogs().then((catalogs) => {
      expect(catalogs.length).to.be.above(2);
      for (const [name, url] of catalogs) {
        expect(url).to.include('https://');
        expect(name).to.include('Cheesefork');
      }
    });
  });
});
