import {expect} from 'chai';

import * as cheesefork from '../src/cheesefork';

// https://mochajs.org/#arrow-functions
/* tslint:disable:only-arrow-functions */

describe('Cheesefork API', function() {
  it('Should correctly convert URLs into names', function() {
    expect(
        cheesefork.catalogNameFromUrl(
            'https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201802.min.js'))
        .to.equal('Spring 2018 (CheeseFork)');
  });
});

describe('Cheesefork API Integration test', function() {
  it('Should fetch reasonable-looking catalogs', function() {
    this.timeout(10000);
    if (typeof XMLHttpRequest === 'undefined') {
      // We intend to test the correct usage of XMLHttpRequest in the browser;
      // node doesn't have XMLHttpRequest, and emulating it won't be useful,
      // so we just skip. This test only runs in karma.
      this.skip();
      return null;
    }

    return cheesefork.getCatalogs().then((catalogs) => {
      expect(catalogs.length).to.be.above(2);
      for (const [name, url] of catalogs) {
        expect(url).to.include('https://');
        expect(name).to.include('CheeseFork');
      }
    });
  });
});
