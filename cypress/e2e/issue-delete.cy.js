// Selectors
const selectors = {
  issueDetailsModal: '[data-testid="modal:issue-details"]',
  deleteConfirmationModal: '[data-testid="modal:confirm"]',
  issueDeleteButton: '[data-testid="icon:trash"]',
  deleteConfirmationButton: "button.sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ",
  deleteCancellationButton: "button.sc-bwzfXH.ewzfNn.sc-kGXeez.bLOzZQ",
  issueContainer: "div.sc-hrWEMg.efIbEb",
  issueDetailsCloseButton: '[data-testid="icon:close"]',
};

// Variables
const issueTitle = "This is an issue of type: Task.";

// Functions
const deleteIssue = () => {
  cy.get(selectors.issueDetailsModal).should("be.visible");

  cy.get(selectors.issueDeleteButton).click();
  cy.get(selectors.deleteConfirmationModal).should("be.visible");

  // Assert that "Delete issue" button exists inside confirmation modal and click on it
  cy.get(selectors.deleteConfirmationModal).within(() => {
    cy.get(selectors.deleteConfirmationButton).contains("Delete issue").should("exist").should("be.visible").click();
  });

  // Assert that the confirmation modal is closed and issue is deleted successfully
  cy.get(selectors.deleteConfirmationModal).should("not.exist");
  cy.get(selectors.issueContainer).within(() => {
    cy.contains(issueTitle).should("not.exist");
  });
};

const cancelDeleteIssue = () => {
  cy.get(selectors.issueDetailsModal).should("be.visible");

  cy.get(selectors.issueDeleteButton).click();
  cy.get(selectors.deleteConfirmationModal).should("be.visible");

  // Assert that "Cancel" button exists inside confirmation modal and click on it
  cy.get(selectors.deleteConfirmationModal).within(() => {
    cy.get(selectors.deleteCancellationButton).should("exist").should("be.visible").click();
  });

  // Ensure that issue details modal is still visible before clicking close button
  cy.get(selectors.issueDetailsModal).should("be.visible");
  cy.get(selectors.issueDetailsCloseButton).should("exist").should("be.visible").first().click();

  // Verify that the issue still remains
  cy.get(selectors.issueContainer).should("contain", issueTitle);
};

describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
        cy.get(selectors.issueDetailsModal).should("be.visible");
      });
  });

  /*** Test Case 1: Issue Deletion ***/
  it("Should delete the issue", () => {
    deleteIssue();
  });

  /*** Test Case 2: Issue Deletion Cancellation ***/
  it("Should cancel the issue deletion", () => {
    cancelDeleteIssue();
  });
});
