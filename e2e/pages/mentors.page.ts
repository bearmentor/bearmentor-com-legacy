import { Locator, Page } from "@playwright/test"

export class MentorsPage {
  readonly page: Page
  readonly mentorListName: Locator
  readonly searchBar: Locator

  constructor(page: Page) {
    this.page = page
    this.mentorListName = page.getByTestId("userCardName")
    this.searchBar = page.getByRole("searchbox")
  }

  async open() {
    await this.page.goto("/mentors")
  }

  async searchMentor(keyword: string) {
    await this.searchBar.fill(keyword)
    await this.page.keyboard.press("Enter")
    await this.page.waitForLoadState("networkidle")
  }
}
