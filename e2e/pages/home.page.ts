import type { Locator, Page } from "@playwright/test"

export class HomePage {
  readonly page: Page
  readonly mentorsButton: Locator
  readonly signinButton: Locator
  readonly availableMentorsSection: Locator
  readonly featuredMenteesSection: Locator

  constructor(page: Page) {
    this.page = page
    this.mentorsButton = page.getByRole("link", { name: /discover mentors/i })
    this.signinButton = page.getByRole("link", { name: /sign in to continue/i })
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

  async goToSignInPage() {
    await this.signinButton.click()
  }
}
