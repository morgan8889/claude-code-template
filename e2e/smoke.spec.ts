import { expect, test } from "@playwright/test";

test("homepage renders the delivery pipeline proof", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app")).toContainText("Delivery Pipeline Proof");
  await expect(page.locator(".ticket-id")).toHaveText("OCR-4");
  await expect(page.locator(".pipeline-summary")).toContainText("14%");
  // Every defined stage renders as a list item.
  await expect(page.locator(".pipeline-stages .stage")).toHaveCount(7);
});
