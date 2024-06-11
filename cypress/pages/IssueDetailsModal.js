class IssueDetailsModal {
  constructor() {
    this.firstIssueTitle = "This is an issue of type: Task.";
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.commentInputSelector = "Add a comment...";
    this.commentTextArea = 'textarea[placeholder="Add a comment..."]';
    this.saveButtonSelector = 'button:contains("Save")';
    this.commentSelector = '[data-testid="issue-comment"]';
    this.editButtonSelector = "Edit";
    this.deleteButtonSelector = "Delete";
    this.confirmDeleteButtonSelector = "button:contains('Delete comment')";
    this.commentEditTextareaSelector = '[data-testid="comment-edit-textarea"]';
    this.confirmModalSelector = '[data-testid="modal:confirm"]';
  }

  getIssueDetailsModal() {
    return cy.get(this.issueDetailsModal);
  }

  getCommentInputSection() {
    return cy.contains(this.commentInputSelector);
  }

  getSaveButton() {
    return cy.get(this.saveButtonSelector);
  }

  getCommentsList() {
    return cy.get(this.commentSelector);
  }

  getConfirmationModal() {
    return cy.get(this.confirmModalSelector);
  }

  addNewComment(comment) {
    this.getIssueDetailsModal().within(() => {
      this.getCommentInputSection().type(comment);
      this.getSaveButton().click().should("not.exist");
      this.getCommentsList().should("have.length", "2").first().find("p").contains(comment);
    });
  }

  editComment(comment, newComment) {
    this.getIssueDetailsModal().within(() => {
      this.getCommentsList()
        .first()
        .should("contain", comment)
        .contains(this.editButtonSelector)
        .click()
        .should("not.exist");
      cy.get(this.commentTextArea).should("contain", comment).clear().type(newComment);
      cy.get(this.saveButtonSelector).click().should("not.exist");
      this.getCommentsList().should("have.length", "2").first().find("p").contains(newComment);
    });
  }

  deleteComment(newComment) {
    this.getIssueDetailsModal()
      .find(this.commentSelector)
      .should("contain", newComment)
      .contains(this.deleteButtonSelector)
      .click();
    this.getConfirmationModal().find(this.confirmDeleteButtonSelector).click().should("not.exist");
    this.getCommentsList().should("have.length", "1");
    this.getIssueDetailsModal().should("not.contain", this.addNewComment);
  }
}

export default new IssueDetailsModal();
