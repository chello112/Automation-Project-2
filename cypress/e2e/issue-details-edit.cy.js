describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]').trigger("mouseover").trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should("contain", "Lord Gaben");

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should("have.text", "Pickle Rick");

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]').clear().type(title).blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should("have.text", title);
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should check the dropdown priority", () => {
    const expectedLength = 5;
    const expectedPriorities = ["Lowest", "Low", "Medium", "High", "Highest"];
    let priorities = [];

    getIssueDetailsModal().within(() => {
      cy.get(priorityDropdownSelector).then((currentlySelected) => {
        priorities.push(currentlySelected.text().trim());
        cy.get(priorityDropdownSelector).click();
        cy.get('[data-testid^="select-option"]')
          .each((option) => {
            priorities.push(option.text().trim());
          })
          .then(() => {
            expect(priorities).to.have.length(expectedLength);
            expect(priorities).to.have.members(expectedPriorities);
          });
      });
    });
  });

  it("Should check that the reporter's name has only characters in it", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          const regex = /^[A-Za-z\s]+$/;
          expect(reporterName.trim()).to.match(regex);
        });
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const priorityDropdownSelector = '[data-testid="select:priority"]';
});
