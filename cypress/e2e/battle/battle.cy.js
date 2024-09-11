describe("Star Wars Battle Game", () => {
  beforeEach(() => {
    cy.visit("/");
    // Wait for the resource selector dialog to appear
    cy.get('[data-cy="resource-selector-title"]').should("be.visible");
  });

  it("should start a new game", () => {
    cy.get('[data-cy="resource-select"]').should("be.visible");
    cy.get('[data-cy="property-select"]').should("be.visible");

    // Select a resource and property
    cy.get('[data-cy="resource-select"]').click();
    cy.get('[data-cy="people-option"]').click();
    cy.get('[data-cy="property-select"]').click();
    cy.get('[data-cy="mass-option"]').click();

    // Start the game
    cy.get('[data-cy="start-game-button"]')
      .should("be.visible")
      .and("not.be.disabled")
      .click();

    cy.get('[data-cy="main-container"]').should("be.visible");
    cy.get('[data-cy="app-logo"]').should("be.visible");
    cy.get('[data-cy="score-card"]').should("be.visible");
    cy.get('[data-cy="battle-container"]').should("be.visible");
    cy.get('[data-cy="game-controls"]').should("be.visible");
  });

  it("should play a round", () => {
    cy.get('[data-cy="start-game-button"]').click();

    // Check initial state
    cy.get('[data-cy="left-card"]').should("be.visible");
    cy.get('[data-cy="right-card"]').should("be.visible");

    // Play a round
    cy.get('[data-cy="next-round-button"]').click();

    // Check that cards are displayed
    cy.get('[data-cy="left-card"]').should("be.visible");
    cy.get('[data-cy="right-card"]').should("be.visible");
  });

  it("should update scores after completing a round", () => {
    cy.get('[data-cy="start-game-button"]').click();

    // Get initial scores
    cy.get('[data-cy="left-score"]')
      .invoke("text")
      .then((initialLeftScore) => {
        cy.get('[data-cy="right-score"]')
          .invoke("text")
          .then((initialRightScore) => {
            // Click next round button
            cy.get('[data-cy="next-round-button"]').click();

            // Wait for the new cards to appear, indicating the round is complete
            cy.get('[data-cy="left-card"]').should("be.visible");
            cy.get('[data-cy="right-card"]').should("be.visible");

            cy.get('[data-cy="next-round-button"]').should("not.be.disabled");

            // Check if either score has changed or both have changed (in case of a draw)
            cy.get('[data-cy="left-score"]')
              .invoke("text")
              .then((newLeftScore) => {
                cy.get('[data-cy="right-score"]')
                  .invoke("text")
                  .then((newRightScore) => {
                    const leftScoreChanged = newLeftScore !== initialLeftScore;
                    const rightScoreChanged =
                      newRightScore !== initialRightScore;

                    // Assert that at least one score has changed, or both have changed in case of a draw
                    expect(leftScoreChanged || rightScoreChanged).to.be.true;

                    if (leftScoreChanged && rightScoreChanged) {
                      // It's a draw
                      expect(parseInt(newLeftScore.split(": ")[1])).to.equal(
                        parseInt(initialLeftScore.split(": ")[1]) + 1,
                      );
                      expect(parseInt(newRightScore.split(": ")[1])).to.equal(
                        parseInt(initialRightScore.split(": ")[1]) + 1,
                      );
                    } else if (leftScoreChanged) {
                      // Left player won
                      expect(parseInt(newLeftScore.split(": ")[1])).to.equal(
                        parseInt(initialLeftScore.split(": ")[1]) + 1,
                      );
                      expect(newRightScore).to.equal(initialRightScore);
                    } else {
                      // Right player won
                      expect(newLeftScore).to.equal(initialLeftScore);
                      expect(parseInt(newRightScore.split(": ")[1])).to.equal(
                        parseInt(initialRightScore.split(": ")[1]) + 1,
                      );
                    }
                  });
              });
          });
      });
  });

  it("should end the game", () => {
    cy.get('[data-cy="start-game-button"]').click();

    cy.get('[data-cy="end-game-button"]').click();

    cy.contains('[data-cy="end-game-title"]', "Game Over").should("be.visible");
    cy.get('[data-cy="final-left-score"]').should("be.visible");
    cy.get('[data-cy="final-right-score"]').should("be.visible");

    // Test closing the dialog
    cy.get('[data-cy="close-button"]').click();
    cy.contains('[data-cy="end-game-title"]', "Game Over").should("not.exist");
  });
});
