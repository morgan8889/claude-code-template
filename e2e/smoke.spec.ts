import { expect, test } from "@playwright/test";

test("homepage renders the delivery pipeline proof", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app")).toContainText("Delivery Pipeline Proof");
  await expect(page.locator(".ticket-id")).toHaveText("OCR-4");
  // Assert the summary surfaces a percent value without coupling to the
  // current stage-data ratio (1/7 ≈ 14% today).
  await expect(page.locator(".pipeline-summary")).toContainText(/\d+%/);
  // Every defined stage renders as a list item.
  await expect(page.locator(".pipeline-stages .stage")).toHaveCount(7);
});
