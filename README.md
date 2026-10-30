# RTC Personal Portal

A static HTML/CSS/JavaScript demo for staff and students.

## Run locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser.

You can also use the VS Code Live Server extension.

## Demo staff login

- Username: `staff`
- Password: `123`

Staff can add students, mark attendance, lock an attendance date, read student messages, reply, and change the demo staff credentials. Students can log in using the name and password created by staff.

## Deploy with GitHub Pages

1. Push this folder's contents to the root of your GitHub repository.
2. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build/deployment source if prompted.
3. Open the **Actions** tab and wait for `RTC Portal CI/CD` to finish.
4. Your site will be published at `https://<your-github-username>.github.io/<repository-name>/`.

## Important security note

This is a front-end demonstration, not a production student-management system. It stores data in browser `localStorage`, and the demo staff login is not secure. Data is not shared between different browsers/devices and can be edited by users. Do not use real student records, real passwords, or sensitive information. A real deployment needs a backend API, database, server-side authentication, password hashing, authorization, and audit logging.
