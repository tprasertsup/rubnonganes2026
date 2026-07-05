# RSVP form backend (Google Apps Script)

`Code.gs` receives RSVP submissions from `index.html` and appends each one as
a row in a Google Sheet.

## Why the form was failing

The form was posting to a script that errored with:

```
Cannot read properties of null (reading 'appendRow')
```

That happens when the script calls `SpreadsheetApp.getActiveSpreadsheet()`
from a standalone Apps Script project (one not bound to a specific Sheet) —
there is no "active" spreadsheet in that context, so it returns `null`, and
calling `.appendRow` on `null` throws. `Code.gs` fixes this by opening the
sheet explicitly with `SpreadsheetApp.openById(SPREADSHEET_ID)`, and also
auto-creates the `Responses` tab (with headers) if it doesn't exist yet.

## Setup

1. Create a Google Sheet (or reuse an existing one) to store responses.
2. Copy its ID out of the URL: `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.
3. Go to [script.google.com](https://script.google.com) → **New project**.
4. Delete the default `Code.gs` contents and paste in this repo's `apps-script/Code.gs`.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the ID from step 2.
6. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the resulting `/exec` URL.
8. In `index.html`, set `GOOGLE_SCRIPT_URL` (near the bottom, in the `<script>` block) to that URL.

## Redeploying after edits

Apps Script web apps keep serving the code from the deployment's saved
version, not your latest edits. After changing `Code.gs`, go to
**Deploy → Manage deployments → Edit (pencil icon) → Version: New version →
Deploy** for the changes to take effect at the same `/exec` URL.
