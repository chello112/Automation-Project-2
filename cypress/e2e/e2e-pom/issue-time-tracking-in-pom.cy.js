import IssueTimeTracking from "../../pages/IssueTimeTracking";
import { faker } from "@faker-js/faker";

describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(IssueTimeTracking.firstIssueTitle).click();
      });
  });
  const timeEstimationInHours = faker.number.int({ min: 1, max: 100 });
  const timeSpentInHours = faker.number.int({ min: 1, max: 100 });
  const timeRemainingInHours = faker.number.int({ min: 1, max: 100 });

  it("Should successfully add, edit and remove time estimation", () => {
    IssueTimeTracking.addTimeEstimation(timeEstimationInHours);
    IssueTimeTracking.verifyEstimatedTime(timeEstimationInHours);

    IssueTimeTracking.editTimeEstimation(timeSpentInHours, timeRemainingInHours);
    IssueTimeTracking.verifyLoggedAndRemainingTime(timeSpentInHours, timeRemainingInHours, timeRemainingInHours);

    IssueTimeTracking.clearTimeFields();
    IssueTimeTracking.verifyNoTimeLogged();
  });
});
