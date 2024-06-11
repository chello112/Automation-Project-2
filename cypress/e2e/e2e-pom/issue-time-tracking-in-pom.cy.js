import IssueModal from "../../pages/IssueModal";
import IssueTimeTracking from "../../pages/IssueTimeTracking";
import { faker } from "@faker-js/faker";

const EXPECTED_AMOUNT_OF_ISSUES = "5";
const issueDetails = {
  title: faker.lorem.word(),
  description: faker.lorem.words(10),
  type: "Bug",
  assignee: "Lord Gaben",
};

describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");

        IssueModal.createIssue(issueDetails);
        IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);

        IssueTimeTracking.getRecentlyCreatedIssue(issueDetails);
      });
  });
  const timeEstimationInHours = faker.number.int({ min: 1, max: 100 });
  const timeSpentInHours = faker.number.int({ min: 1, max: 100 });
  const timeRemainingInHours = faker.number.int({ min: 1, max: 100 });

  it("Should successfully add, edit and remove time estimation", () => {
    IssueTimeTracking.addTimeEstimation(timeEstimationInHours);
    IssueTimeTracking.verifyEstimatedTime(timeEstimationInHours);

    IssueTimeTracking.editTimeEstimation(timeSpentInHours, timeRemainingInHours);
  });
});
