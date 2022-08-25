import { mainPage } from "../../support/page_objects/mainPage";
import { isTestSuiteActive } from "../../support/page_objects/projectConstants";

export const genTest = (apiType, dbType) => {
    if (!isTestSuiteActive(apiType, dbType)) return;

    describe(`${apiType.toUpperCase()} api - Filter, Fields, Sort`, () => {
        before(() => {
            cy.fileHook();
            mainPage.tabReset();
            // open country table
            cy.openTableTab("Country", 25);
        });

        after(() => {
            cy.closeTableTab("Country");
        });

        describe(`Pagination`, () => {
            beforeEach(() => {
                cy.fileHook();
            })

            // check pagination
            it("Check country table - Pagination", () => {
                cy.get(".nc-pagination").should("exist");

                // verify > pagination option
                mainPage.getPagination(">").click();
                mainPage
                    .getPagination(2)
                    .should("have.class", "ant-pagination-item-active");

                // verify < pagination option
                mainPage.getPagination("<").click();
                mainPage
                    .getPagination(1)
                    .should("have.class", "ant-pagination-item-active");
            });
        });

        describe(`Row operations`, () => {
            beforeEach(() => {
                cy.fileHook();
            })

            // create new row using + button in header
            //
            it.skip("Add row using tool header button", () => {
                // add a row to end of Country table
                cy.get(".nc-add-new-row-btn").click();
                cy.get("#data-table-form-Country > input")
                    .first()
                    .type("Test Country");
                cy.contains("Save row").filter("button").click();

                cy.toastWait("updated successfully");

                // verify
                mainPage.getPagination(5).click();
                // kludge: flicker on load
                cy.wait(3000)
                mainPage
                    .getCell("Country", 10)
                    .contains("Test Country")
                    .should("exist");
            });

            // delete single row
            //
            it.skip("Delete Row", () => {
                // delete row added in previous step
                mainPage.getCell("Country", 10).rightclick();
                cy.getActiveMenu().contains("Delete Row").click();

                // cy.toastWait('Deleted row successfully')

                // verify
                mainPage.getCell("Country", 10).should("not.exist");
            });

            // create new row using right click menu option
            //
            it("Add row using rightclick menu option", () => {
                // Temporary
                mainPage.getPagination(5).click();

                mainPage.getCell("Country", 9).rightclick({ force: true });
                cy.getActiveMenu()
                    .contains("Insert new row")
                    .click({ force: true });
                mainPage
                    .getCell("Country", 10)
                    .dblclick()
                    .find("input")
                    .type("Test Country-1{enter}");

                mainPage.getCell("Country", 10).rightclick({ force: true });
                cy.getActiveMenu()
                    .contains("Insert new row")
                    .click({ force: true });
                mainPage
                    .getCell("Country", 11)
                    .dblclick()
                    .find("input")
                    .type("Test Country-2{enter}");

                // GUI-v2 Kludge:
                // to move cursor away from input field; enter key is not recognized
                mainPage.getCell("Country", 10).click()

                // verify
                mainPage
                    .getCell("Country", 10)
                    .contains("Test Country-1")
                    .should("exist");
                mainPage
                    .getCell("Country", 11)
                    .contains("Test Country-2")
                    .should("exist");
            });

            // delete selected rows (multiple)
            //
            it("Delete Selected", () => {
                cy.get(".ant-checkbox").should('exist')
                  .eq(10).click({ force: true });
                cy.get(".ant-checkbox").should('exist')
                  .eq(11).click({ force: true });

                mainPage.getCell("Country", 10).rightclick({ force: true });
                cy.getActiveMenu()
                    .contains("Delete Selected Rows")
                    .click({ force: true });

                // verify
                // mainPage.getCell("Country", 10).should("not.exist");
                // mainPage.getCell("Country", 11).should("not.exist");
                cy.get(
                  `:nth-child(10) > [data-title="Country"]`
                ).should("not.exist");
                cy.get(
                  `:nth-child(11) > [data-title="Country"]`
                ).should("not.exist");

                mainPage.getPagination(1).click();
            });
        });

        // GUI-v2 Kludge: Disable sort isn't disappearing after clear
        // describe(`Sort operations`, () => {
        //     beforeEach(() => {
        //         cy.fileHook();
        //     })
        //
        //     it("Enable sort", () => {
        //         mainPage.sortField("Country", "Z → A");
        //         cy.contains("Zambia").should("exist");
        //     });
        //
        //     it("Disable sort", () => {
        //         mainPage.clearSort();
        //         cy.contains("Zambia").should("not.exist");
        //     });
        // });

        describe("Field Operation", () => {
            beforeEach(() => {
                cy.fileHook();
            })

            it("Hide field", () => {
                mainPage.hideField("LastUpdate");
            });

            it("Show field", () => {
                mainPage.unhideField("LastUpdate");
            });
        });

        describe("Filter operations", () => {
            beforeEach(() => {
                cy.fileHook();
            })

            it("Create Filter", () => {
                mainPage.filterField("Country", "is equal", "India");
                // cy.get("td:contains(India)").should("exist");
                mainPage.getCell("Country", 1)
                    .contains("India")
                    .should("exist");
            });

            it("Delete Filter", () => {
                // remove sort and check
                mainPage.filterReset();
                mainPage.getCell("Country", 1)
                  .contains("India")
                  .should("not.exist");
                // cy.contains("td:contains(India)").should("not.exist");
            });
        });
    });
};

/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Raju Udava <sivadstala@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
