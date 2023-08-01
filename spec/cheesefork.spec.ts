import { expect } from "chai";

import * as cheesefork from "../src/cheesefork";

describe("Cheesefork parser", function () {
  it("Should correctly convert test dates", function () {
    expect(
      cheesefork._private.parseTestDate("בתאריך 02.02.2020 יום א"),
    ).to.deep.equal(new Date(2020, 1, 2));
    expect(cheesefork._private.parseTestDate("13-02-2022")).to.deep.equal(
      new Date(2022, 1, 13),
    );
  });

  it("Should parse days of the week", function () {
    expect(cheesefork._private.parseDayOfWeek("ג")).to.equal(2);
    expect(cheesefork._private.parseDayOfWeek("ש")).to.equal(6);
    expect(cheesefork._private.parseDayOfWeek("שלישי")).to.equal(2);
    expect(cheesefork._private.parseDayOfWeek("שבת")).to.equal(6);
  });

  it("Should parse pre-202002 hours", function () {
    expect(cheesefork._private.parseHour("12:3 - 14:3")).to.deep.equal([
      12 * 60 + 30,
      14 * 60 + 30,
    ]);
    expect(cheesefork._private.parseHour("12 - 14:3")).to.deep.equal([
      12 * 60,
      14 * 60 + 30,
    ]);
    expect(cheesefork._private.parseHour("12:3 - 14")).to.deep.equal([
      12 * 60 + 30,
      14 * 60,
    ]);
    expect(cheesefork._private.parseHour("12 - 14")).to.deep.equal([
      12 * 60,
      14 * 60,
    ]);
  });

  it("Should parse post-202002 hours", function () {
    expect(cheesefork._private.parseHour("12:30 - 14:30")).to.deep.equal([
      12 * 60 + 30,
      14 * 60 + 30,
    ]);
    expect(cheesefork._private.parseHour("12:00 - 14:30")).to.deep.equal([
      12 * 60,
      14 * 60 + 30,
    ]);
    expect(cheesefork._private.parseHour("12:30 - 14:00")).to.deep.equal([
      12 * 60 + 30,
      14 * 60,
    ]);
    expect(cheesefork._private.parseHour("12:00 - 14:00")).to.deep.equal([
      12 * 60,
      14 * 60,
    ]);
    expect(cheesefork._private.parseHour("17:15 - 18:45")).to.deep.equal([
      17 * 60 + 15,
      18 * 60 + 45,
    ]);
  });
});

describe("Cheesefork Utilities", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testCases: Array<[string, any]> = [
    ["var courses_from_rishum = [1]", [1]],
    ["var courses_from_rishum = [[1,2]]", [[1, 2]]],
    ['var courses_from_rishum = [{"hello":"world"}]', [{ hello: "world" }]],
    ['var courses_from_rishum = JSON.parse("[1]")', [1]],
    [
      String.raw`var courses_from_rishum = JSON.parse("[{\"hello\":\"world\"}]")`,
      [{ hello: "world" }],
    ],
    [
      `var courses_from_rishum = JSON.parse('[{"hello":"world"}]')`,
      [{ hello: "world" }],
    ],
  ];

  const deserialize = cheesefork._private.deserialize;

  testCases.forEach((testCase) =>
    it(`Should correctly deserialize cheesefork-style JSON: ${testCase[0]}`, function () {
      const data = testCase[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const want = testCase[1];

      const got = deserialize(data);
      expect(got).to.deep.equal(want);
    }),
  );
});

describe("Cheesefork API", function () {
  it("Should correctly convert URLs into names", function () {
    expect(
      cheesefork.catalogNameFromUrl(
        "https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201802.min.js",
      ),
    ).to.equal("Spring 2019 (CheeseFork)");
    expect(
      cheesefork.catalogNameFromUrl(
        "https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201801.min.js",
      ),
    ).to.equal("Winter 2018/19 (CheeseFork)");
  });
});

function getFlag(name: string): string {
  // eslint-disable-next-line
  const karma = (window as any).__karma__ as unknown as any;
  if (!karma) {
    return "";
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const args = karma.config.args as string[];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--" + name) {
      return args[i + 1];
    }
  }
  return "";
}

describe("Cheesefork API Integration test", function () {
  it("Should fetch reasonable-looking catalogs", function () {
    this.timeout(10000);
    if (typeof XMLHttpRequest === "undefined") {
      // We intend to test the correct usage of XMLHttpRequest in the browser;
      // node doesn't have XMLHttpRequest, and emulating it won't be useful,
      // so we just skip. This test only runs in karma.
      this.skip();
      return null;
    }

    return cheesefork.getCatalogs(getFlag("github-token")).then((catalogs) => {
      expect(catalogs.length).to.be.above(2);
      for (const [name, url] of catalogs) {
        expect(url).to.include("https://");
        expect(name).to.include("CheeseFork");
      }

      const firstUrl = catalogs[0][1];
      const secondUrl = catalogs[1][1];
      /* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
      expect(
        firstUrl < secondUrl,
        `Wrong sort order: ${firstUrl} came before ${secondUrl}`,
      ).to.be.true;
    });
  });

  const catalogsToTest = [
    "201701",
    "201901",
    "202001",
    "202002",
    "202101",
    "202102",
  ];

  catalogsToTest.forEach((catalogID) =>
    it(`Should successfully parse catalog ${catalogID}`, function () {
      this.timeout(10000);
      if (typeof XMLHttpRequest === "undefined") {
        // We intend to test the correct usage of XMLHttpRequest in the browser;
        // node doesn't have XMLHttpRequest, and emulating it won't be useful,
        // so we just skip. This test only runs in karma.
        this.skip();
        return null;
      }

      return new Promise((resolve, reject) => {
        const catalogURL = `https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_${catalogID}.min.js`;

        const req = new XMLHttpRequest();
        req.open("GET", catalogURL, true);

        req.onload = () => {
          if (req.status !== 200) {
            reject(Error(`HTTP ${req.status}: ${req.statusText}`));
            return;
          }
          resolve(req.responseText);
        };
        req.send();
      }).then((cheeseForkData: string) => {
        const faculties = cheesefork.parse(cheeseForkData);
        expect(faculties.length).to.be.greaterThan(5);
      });
    }),
  );
});
