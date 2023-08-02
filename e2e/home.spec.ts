import { expect, test } from "@playwright/test"

import { HomePage } from "./pages/home.page"

test.describe("Bearmentor Home page E2E Test", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.open()
    await expect(page).toHaveURL("/")
    await expect(page).toHaveTitle(/Bearmentor/)
  })

  test("user should be able to see Available Mentors", async () => {
    await expect(homePage.availableMentorsSection).toBeVisible()
  })

  test("user should be able to see Featured Mentees", async () => {
    await expect(homePage.featuredMenteesSection).toBeVisible()
  })
})
