import { Selector } from "testcafe";

fixture`TTime`.page`localhost:8080`;

test("Spring 2019 has 2820 schedules", async (t) => {
  await t //
    .click("#settings-tab")
    .click("#catalog-preset-dropdown-button")
    .click(Selector("a").withText("Spring 2019 (CheeseFork)"))
    .click(Selector("button").withText("Apply"))
    .click("#settings-tab")
    .click(Selector("a").withText("Add sample courses"))
    .click("#schedules-tab")
    .click("#generate-schedules")
    .expect(Selector("#num-schedules").innerText)
    .eql("2820");
});
