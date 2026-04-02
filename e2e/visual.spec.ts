import { expect, test } from "@playwright/test";

test("@visual homepage matches baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app")).toBeVisible();
  await expect(page).toHaveScreenshot("homepage.png");
});
