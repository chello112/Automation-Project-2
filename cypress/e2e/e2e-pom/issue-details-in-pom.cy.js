import IssueDetailsModal from "../../pages/issueDetailsModal";
const { faker } = require("@faker-js/faker");

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(IssueDetailsModal.firstIssueTitle).click();
      });
  });

  const comment = faker.lorem.words(10);
  const newComment = faker.lorem.words(20);

  it("Should successfully create, edit and delete a comment", () => {
    IssueDetailsModal.addNewComment(comment);
    IssueDetailsModal.editComment(comment, newComment);
    IssueDetailsModal.deleteComment(newComment);
  });
});
