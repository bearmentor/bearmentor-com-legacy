import { Locator, Page } from "@playwright/test"

export class HomePage {
  readonly page: Page
  readonly mentorsButton: Locator
  readonly loginButton: Locator
  readonly availableMentorsList: Locator
  readonly featuredMenteesList: Locator

  constructor(page: Page) {
    this.page = page
    this.mentorsButton = page.getByRole("link", { name: /discover mentors/i })
    this.loginButton = page.getByRole("link", { name: /login to continue/i })
    this.availableMentorsList = page.locator(
      ".font-semibold.tracking-tight.text-2xl",
    )
    this.featuredMenteesList = page.locator("(//h3[@class='text-base'])")
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
