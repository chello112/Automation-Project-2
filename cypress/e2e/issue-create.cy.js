/***  I HIGHLY RECOMMEND TESTING THE TEST CASES ONE BY ONE USING `it.only`.
  RUNNING ALL THE TESTS SIMULTANEOUSLY MAY CAUSE THEM TO FAIL FOR UNKNOWN REASONS ***/
import { faker } from "@faker-js/faker";

// Selectors
const selectors = {
  modal: '[data-testid="modal:issue-create"]',
  titleInput: 'input[name="title"]',
  descriptionInput: ".ql-editor",
  createButton: 'button[type="submit"]',
  successMessage: "Issue has been successfully created.",

  backlogList: '[data-testid="board-list:backlog"]',
  listIssue: '[data-testid="list-issue"]',

  issueTypeDropdown: '[data-testid="select:type"]',
  issueTypeOptions: {
    Task: '[data-testid="select-option:Task"]',
    Bug: '[data-testid="select-option:Bug"]',
    Story: '[data-testid="select-option:Story"]',
  },
  issueTypeIcons: {
    TaskIcon: '[data-testid="icon:task"]',
    BugIcon: '[data-testid="icon:bug"]',
    StoryIcon: '[data-testid="icon:story"]',
  },
  reporterDropdown: '[data-testid="select:reporterId"]',
  reporterOptions: {
    LordGaben: '[data-testid="avatar:Lord Gaben"]',
    PickleRick: '[data-testid="select-option:Pickle Rick"]',
    BabyYoda: '[data-testid="avatar:Baby Yoda"]',
  },
  reporterImages: {
    LordGabenImg: '[data-testid="avatar:Lord Gaben"]',
    PickleRickImg: '[data-testid="avatar:Pickle Rick"]',
    BabyYodaImg: '[data-testid="avatar:Baby Yoda"]',
  },
  assigneesDropdown: '[data-testid="select:userIds"]',
  assigneeOptions: {
    LordG: '[data-testid="avatar:Lord Gaben"]',
    PickleR: '[data-testid="select-option:Pickle Rick"]',
    BabyY: '[data-testid="avatar:Baby Yoda"]',
  },
  assigneeImages: {
    LordGabenImg: '[data-testid="avatar:Lord Gaben"]',
    PickleRickImg: '[data-testid="avatar:Pickle Rick"]',
    BabyYodaImg: '[data-testid="avatar:Baby Yoda"]',
  },
  priorityDropdown: '[data-testid="select:priority"]',
  priorityOptions: {
    Highest: '[data-testid="select-option:Highest"]',
    High: '[data-testid="select-option:High"]',
    Low: '[data-testid="select-option:Low"]',
    Lowest: '[data-testid="select-option:Lowest"]',
  },
  priorityIcons: {
    HighestIcon: '[data-testid="icon:arrow-up"]',
    HighIcon: '[data-testid="icon:arrow-up"]',
    LowIcon: '[data-testid="icon:arrow-down"]',
    LowestIcon: '[data-testid="icon:arrow-down"]',
  },
};

// Arrow function to fulfill all fields and submit the issue
const fulfillAllFieldsAndSubmitIssue = (title, description, issueType, priority, reporter) => {
  cy.get(selectors.issueTypeDropdown).then(($dropdown) => {
    const currentValue = $dropdown.text().trim();

    // Check if the current value is not the same as the issueType
    if (currentValue !== issueType) {
      cy.get(selectors.issueTypeDropdown).click();
      // Ensure the dropdown options are visible and interactable before selecting
      cy.get(selectors.issueTypeOptions[issueType], { timeout: 10000 }).should("be.visible").click();
    }
  });
  cy.wait(500); // These execution pauses are added because the system sometimes leaves some fields empty

  cy.get(selectors.titleInput).type(title);
  cy.get(selectors.titleInput).should("not.have.value", "");
  cy.wait(500);

  cy.get(selectors.descriptionInput).type(description);
  cy.get(selectors.descriptionInput).should("not.have.text", "");
  cy.wait(500);

  cy.get(selectors.reporterDropdown).click();
  cy.get(selectors.reporterOptions[reporter]).trigger("click");
  cy.get(selectors.reporterImages[`${reporter}Img`]).should("be.visible");
  cy.wait(500);

  cy.get(selectors.priorityDropdown).click();
  cy.get(selectors.priorityOptions[priority]).trigger("click");
  cy.get(selectors.priorityIcons[`${priority}Icon`]).should("be.visible");
  cy.wait(500);

  cy.get(selectors.createButton).click();
};

// Test suite
describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  /*** Test Case 1: Custom Issue Creation ***/
  it("Should create a custom issue with static data", () => {
    const title = "Bug";
    const description = "My bug description";
    const issueType = "Bug";
    const priority = "Highest";
    const reporter = "PickleRick";

    cy.get(selectors.modal).within(() => {
      fulfillAllFieldsAndSubmitIssue(title, description, issueType, priority, reporter);
    });

    cy.get(selectors.modal).should("not.exist");
    cy.contains(selectors.successMessage).should("be.visible");

    cy.reload(); // Reload the page in order to display recently created issue

    // Assert than only one list with name "Backlog" is visible and do next assertions inside of it
    cy.get(selectors.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get(selectors.listIssue).should("have.length", "5").first().find("p").contains(title);
      });
  });

  /*** Test Case 2: Random Data Plugin Issue Creation ***/
  it("Should create a custom issue with random data", () => {
    const randomTitle = faker.lorem.word();
    const randomDescription = faker.lorem.words(10);
    const issueType = "Task";
    const priority = "Low";
    const reporter = "BabyYoda";

    cy.get(selectors.modal).within(() => {
      fulfillAllFieldsAndSubmitIssue(randomTitle, randomDescription, issueType, priority, reporter);
    });

    // Verify that after successful issue creation, modal should be closed and success message visible
    cy.get(selectors.modal).should("not.exist");
    cy.contains(selectors.successMessage).should("be.visible");

    cy.reload(); // Reload the page in order to display recently created issue

    // Assert than only one list with name "Backlog" is visible and do next assertions inside of it
    cy.get(selectors.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get(selectors.listIssue).should("have.length", "5").first().find("p").contains(randomTitle);
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      // Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            //cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible"); => it does not work for some reason
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should("contain", "This field is required");
    });
  });
});
