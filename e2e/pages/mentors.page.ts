import { Locator, Page } from "@playwright/test"

export class MentorsPage {
  readonly page: Page
  readonly mentorListName: Locator
  readonly searchBar: Locator
  readonly loadingProgress: Locator

  constructor(page: Page) {
    this.page = page
    this.mentorListName = page.locator(".font-semibold.tracking-tight.text-2xl")
    this.searchBar = page.locator("#search")
    this.loadingProgress = page.locator(".dark.nprogress-busy")
  }

  async open() {
    await this.page.goto("/mentors")
  }

  async searchMentor(keyword: string) {
    await this.searchBar.fill(keyword)
    await this.page.keyboard.press("Enter")
  }
}
