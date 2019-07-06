import {expect} from 'chai';

import * as cheesefork from '../src/cheesefork';

// https://mochajs.org/#arrow-functions
/* tslint:disable:only-arrow-functions */

describe('Cheesefork API', function() {
  it('Should correctly convert URLs into names', function() {
    expect(
        cheesefork.catalogNameFromUrl(
            'https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201802.min.js'))
        .to.equal('Spring 2019 (CheeseFork)');
    expect(
        cheesefork.catalogNameFromUrl(
            'https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201801.min.js'))
        .to.equal('Winter 2018/19 (CheeseFork)');
  });

  it('Should correctly convert test dates', function() {
    expect(cheesefork.parseCheeseForkTestDate('בתאריך 02.02.2020 יום א'))
        .to.deep.equal(new Date(2020, 1, 2));
  });
});

function getFlag(name: string): string {
  const karma = (window as any).__karma__;
  if (!karma) {
    return '';
  }
  const args = karma.config.args;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--' + name) {
      return args[i + 1];
    }
  }
  return '';
}

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

    return cheesefork.getCatalogs(getFlag('github-token')).then((catalogs) => {
      expect(catalogs.length).to.be.above(2);
      for (const [name, url] of catalogs) {
        expect(url).to.include('https://');
        expect(name).to.include('CheeseFork');
      }
    });
  });
});
