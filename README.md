# AllTools

**Free Tools. One Place.**

AllTools is a free, open-source collection of simple online utilities. The first version is built with plain HTML, CSS, and JavaScript, so it can run on GitHub Pages without a build step or database.

## Live demo

After enabling GitHub Pages, your site will be available at:

`https://YOUR-USERNAME.github.io/alltools/`

Replace `YOUR-USERNAME` with your GitHub username.

## Features

- Search and category filters
- Responsive layout for desktop and mobile
- Light and dark themes
- Word counter
- Case converter
- Random password generator using the browser's Web Crypto API
- Length, weight, and temperature converter
- JSON formatter and validator
- No account required

## Run locally

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a modern browser.

No package installation or build command is required.

## Project structure

```text
alltools/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/tools.js
│   └── images/
└── tools/
    └── index.html
```

## Add a tool

1. Add its card information to `toolDefinitions` in `assets/js/tools.js`.
2. Add its interface to the `templates` object in `renderTool()`.
3. Create a setup function for its behavior.
4. Call that setup function from `renderTool()`.
5. Test it on desktop and mobile before submitting a pull request.

## Privacy

The included tools process their input locally in the browser. AllTools does not currently include analytics, accounts, or a backend. Do not add third-party services that upload user content without clearly explaining that behavior.

## Contributing

Contributions are welcome! Please open an issue to discuss a significant change before submitting a pull request. Keep tools accessible, mobile-friendly, privacy-conscious, and free to use.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
