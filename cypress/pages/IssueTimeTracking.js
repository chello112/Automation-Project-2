class IssueTimeTracking {
  constructor() {
    this.firstIssueTitle = "This is an issue of type: Task.";
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.estimationInput = 'input[placeholder="Number"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.closeModalButton = '[data-testid="icon:close"]';
    this.doneButtonInTimeTrackingModal = 'button:contains("Done")';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.timeInputField = 'input[placeholder="Number"]';
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailsModal);
  }

  getTimeTrackingModal() {
    return cy.get(this.timeTrackingModal);
  }

  getEstimationInput() {
    return cy.get(this.estimationInput);
  }

  getStopwatchIcon() {
    return cy.get(this.stopwatchIcon);
  }

  getRecentlyCreatedIssue(issueDetails) {
    cy.get(this.backlogList).within(() => {
      cy.get(this.issuesList).first().find("p").contains(issueDetails.title).click();
    });
  }

  addTimeEstimation(timeEstimationInHours) {
    this.getIssueDetailModal().within(() => {
      this.getEstimationInput().click().clear().type(timeEstimationInHours).should("have.value", timeEstimationInHours);
    });
  }

  verifyEstimatedTime(timeEstimationInHours) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.stopwatchIcon)
        .next()
        .contains(timeEstimationInHours + "h estimated");
    });
  }

  editTimeEstimation(timeSpentInHours, timeRemainingInHours) {
    this.getStopwatchIcon().click();
    this.getTimeTrackingModal().within(() => {
      cy.contains("Time spent (hours)").parent().find(this.timeInputField).clear().type(timeSpentInHours);
      cy.contains("Time remaining (hours)").parent().find(this.timeInputField).clear().type(timeRemainingInHours);
      cy.get(this.doneButtonInTimeTrackingModal).click();
    });
  }

  verifyLoggedAndRemainingTime(timeSpentInHours, timeRemainingInHours) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.stopwatchIcon)
        .next()
        .should("contain", timeSpentInHours + "h logged")
        .and("contain", timeRemainingInHours + "h remaining");
    });
  }

  clearTimeFields() {
    this.getEstimationInput().click().clear();
    this.getStopwatchIcon().click();
    this.getTimeTrackingModal().within(() => {
      cy.contains("Time spent (hours)").parent().find(this.timeInputField).clear().should("have.value", "");
      cy.contains("Time remaining (hours)").parent().find(this.timeInputField).clear().should("have.value", "");
      cy.get(this.doneButtonInTimeTrackingModal).click();
    });
  }

  verifyNoTimeLogged() {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon().parent().should("contain", "No time logged");
    });
  }
}

export default new IssueTimeTracking();
