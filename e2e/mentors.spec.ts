import { expect, test } from "@playwright/test"

import { DataUser, dataUsers } from "~/data"

import { MentorsPage } from "./pages/mentors.page"

test.describe("Bearmentor Mentors page E2E Test", () => {
  let mentorsPage: MentorsPage

  test.beforeEach(async ({ page }) => {
    mentorsPage = new MentorsPage(page)
    await mentorsPage.open()
    await expect(page).toHaveURL("/mentors")
    await expect(page).toHaveTitle(/Bearmentor/)
  })

  test("user should be able to see mentors list", async () => {
    // Filtering users with "MENTOR" tag and extracting their names
    const mentorNames: string[] = dataUsers
      .filter((user: DataUser) => user.tags?.includes("MENTOR"))
      .map((user: DataUser) => user.name)

    // Iterate over mentorNames and call mentorsPage.mentorListName() for each name
    for (const mentorName of mentorNames) {
      const mentorElement = await mentorsPage.mentorListName(mentorName)
      await expect(mentorElement).toBeVisible()
    }
  })

  test("user should be able to search a mentor", async () => {
    await mentorsPage.searchMentor("haidar")
    const mentorNameElement = await mentorsPage.mentorListName("M Haidar Hanif")
    await expect(mentorNameElement).toBeVisible()
  })
})
