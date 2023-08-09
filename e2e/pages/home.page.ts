import { Locator, Page } from "@playwright/test"

export class HomePage {
  readonly page: Page
  readonly mentorsButton: Locator
  readonly loginButton: Locator
  readonly availableMentorsSection: Locator
  readonly featuredMenteesSection: Locator

  constructor(page: Page) {
    this.page = page
    this.mentorsButton = page.getByRole("link", { name: /discover mentors/i })
    this.loginButton = page.getByRole("link", { name: /login to continue/i })
    this.availableMentorsSection = page.getByRole("heading", {
      name: /available mentors/i,
    })
    this.featuredMenteesSection = page.getByRole("heading", {
      name: /featured mentees/i,
    })
  }

  async open() {
    await this.page.goto("/")
  }

  async goToMentorsPage() {
    await this.mentorsButton.click()
  }

  async goToLoginPage() {
    await this.loginButton.click()
  }
}
