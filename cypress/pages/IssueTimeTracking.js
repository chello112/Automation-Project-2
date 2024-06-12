class IssueTimeTracking {
  constructor() {
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.estimationInput = 'input[placeholder="Number"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.closeModalButton = '[data-testid="icon:close"]';
    this.doneButtonInTimeTrackingModal = 'button:contains("Done")';
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailsModal);
  }

  getCloseModalButton() {
    return cy.get(this.closeModalButton);
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
    cy.contains("Time spent (hours").next().click().type(timeSpentInHours);
    cy.contains("Time remaining (hours)").next().click().type(timeRemainingInHours);
    cy.get(this.doneButtonInTimeTrackingModal).click();
  }
}

export default new IssueTimeTracking();
