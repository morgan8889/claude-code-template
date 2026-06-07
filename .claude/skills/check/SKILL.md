---
name: check
description: Run repository validation gates before commit or PR.
---

# Check

Run the repo's available validation commands and summarize evidence:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm audit --audit-level=high
```

For UI changes, capture visual evidence and confirm the screenshot is not blank.
