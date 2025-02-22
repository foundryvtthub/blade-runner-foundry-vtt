<img src="" alt="Logo" style="max-width:100%;" />
<p align="center">Thank you for wanting to contribute to this project!</p>
<br>

# Contributing to Blade Runner RPG for Foundry VTT

This project depends on the Foundry VTT community. That is why we try to accept all contributions no matter how small, or how new you are to programming or Foundry. The below are mostly guidelines on how to contribute to the project.

### But I just have a question!

> **Note:** [Please don't file an issue to ask a question.](/../../issues) You'll get better help by using the resources below.

If you have usage questions the best place to get help is in the [#free-league channel on the official Foundry VTT Discord](https://discord.gg/foundryvtt).

Otherwise, discussion about the development of the Blade Runner RPG system can be [found in discussions](/../../discussions).

### Table of contents

1. [Localization](#globe_with_meridians-Localization)

2. [Get Started](#rocket-get-started)

3. [What's in the Box?](#package-whats-in-the-box)

4. [How do I Contribute?](hammer_and_wrench-how-do-i-contribute)

5. [Pull Requests](#dart-pull-requests)

## :globe_with_meridians: Localization

We are grateful for any and all localization support we can get. To localize the system you do not need to download or set up the system. To make it easier to help with localization we are using GitLocalize. All you need is a GitHub account. Then you can [head over to our GitLocalize page](https://gitlocalize.com/repo/XXXX) and start translating.

Once you are done, click the yellow button that says "Create Review Request" and GitLocalize will handle the rest on your behalf.

### But I don't see my language in the list!

> Don't worry!

Click the "Add Language" button and get started. :+1:

## :rocket: Get Started

> **Important!** You need to [have node.js LTS-version installed](https://nodejs.org/en/) with npm available.

**Fork** or [Clone](https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt.git) the project and open the project folder in your terminal:

### 1. Install dependencies.

```bash
# Install the dependencies.
npm install
```

### 2. Build dist folder.

```bash
# Build the dist folder where the system package lives.
npm run dev
```

### 3. Link dist folder in systems.

To make sure that Foundry VTT will be able to detect the system so you can debug properly, you need to connect your dist folder with a symbolic link or folder junction in the `systems/`-folder in `FoundryVTT/Data`. You should make sure you do not have a pre-existing forbidden-lands installation in the `systems/`-folder.

Configure a `pathconfig`-file in the project's root folder it should contain information that looks like this:

```json
{
  // On Linux / macOS
  "dataPath": "/absolute/path/to/your/FoundryVTT/Data"
}
```

```json
{
  // On Windows
  "dataPath": "\\absolute\\path\\to\\your\\FoundryVTT\\Data"
}
```

```json
{
  // Relative path
  "dataPath": "../../Data"
}
```

Once you have configured where your Foundry VTT Data-folder is, you can link the dist folder:

```bash
# Run the project linking command.
npm run link
# or
npm run link:force
```

If the above didn't work, try a direct command instead:

```bash
# Unix
ln -s dist/* /absolute/path/to/foundry/data/system-name

# cmd
mklink /J /absolute/path/to/link /absolute/path/to/this/repo/dist
```

### 4. Test that it all works and start editing!

You should now be able to open Foundry VTT and create a world using the Blade Runner RPG system.

If you do, congratulations:tada:! To begin editing the code:

```bash
# Run the command that builds the dist folder then watches it for changes.

npm run dev #This builds the dist directory and ports static files

npm run dev:watch #Same as above and watches for files changes.
```

You can cancel watching the files for changes by using the command `ctrl + c` in the terminal window.

> **It's not working!** If somewhere along the line something failed, or you are not seeing the Blade Runner RPG system in Foundry. Do not stress! Please reach out to us in either Discord or the Discussions here. See [But I just have a question!](#but-i-just-have-a-question)

### 5. .Husky

This project uses the [git hooks automator: Husky](https://typicode.github.io/husky/#/). Husky helps improve the workflow of the project by controlling commit messages for semver compatibility, and automates building, linting and formatting. For your own ease of use it is important you make sure that Husky is functioning correctly.

To do so make a test branch in the project and commit a new file using a commit message that will fail. E.g.

```bash
git checkout -b test-branch
touch test.file
git commit -am "feat: test commit"
```

You should now see Husky running. And if it works correctly the commit should pass and an emoji should be added to the commit message lke so `feat: ✨ test commit`.

If you have permission issues with Husky on Linux or macOS. Run the below commands to set the right executable permissions for Husky and git hooks.

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## :package: What's in the Box?

Following are some of the files and folders that you may be interested in editing, and some you shouldn't edit:

```
.
├── 📁 .github
├── 📁 .husky
├── 📁 archive
├── 📁 dist*
├── 📁 node_modules*
├── 📁 src
│   ├── 📁 actor
│   │   └── 📁 character
│   ├── 📁 components
│   │   └── 📁 roll
│   ├── 📁 item
│   ├── 📁 plugins
│   ├── 📁 styles
│   ├── 📁 system
│   ├── 📁 utils
│   ├── blade-runner.js
│   └── blade-runner.scss
├── 📁 static
│   ├── 📁 assets
│   │   └── 📁 icons
│   ├── 📁 fonts
│   ├── 📁 lang
│   ├── 📁 lib
│   ├── system.json
│   └── template.json
├── 📁 tools
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── CONTRIBUTING.md
├── esbuild.config.js
├── gulpfile.js
├── jsconfig.json
├── LICENSE
├── package.json
├── package-lock.json
├── pathconfig.example
└── README.md
```

0. `.github/`: This directory contains Github Actions CI files and Github Issue Templates.
1. `.husky/`: This is a git hooks enhancment tool. See [.Husky](#5._.husky)
2. `dist/` \*_Generated_: The directory contains the output of the build process. It is not part of the git repository.
3. `node_modules/` \*_Generated_: A directory generated when running the `npm install` command. It contains all the dependencies of the project.
4. `src/`: This is the directory you want to focus most of your attention on. It contains the following files and subdirectories:
   - `actor/` & `item/`: Javascript documents, sheets and templates for the actors (character) and items. The subfolders `templates/` contains all the html, or handlebars partials if you like. They are formatted as `.hbs`.
   - `plugins/`: Everything related to third-party modules goes there. _(e.g. Dice So Nice)_
   - `styles/`: The project uses SASS (SCSS). It is almost like CSS except it allows for modularization and more perks.
   - `system/`: Core Javascript modules for the game system.
   - `utils/`: Collection of utilitary methods used in the game system.
   - The main file `blade-runner.js` imports the scripts in the subdirectories and configures the system.
   - The main style file `blade-runner.scss` only imports the various partial files.
5. `static/`: The static directory contains assets and the system- and template.json files. This directory rarely sees changes. It contains the following subdirectories:
   - `assets/`: Pictures, icons, and other assets.
   - `fonts/`: Typography files.
   - `lang/`: Language files. You may opt to do localization directly on the files. _**Note:** This is not the preferred way of doing localization._
6. `tools/`: Other utilities not used by the game system.
7. `.editorconfig`, `.eslintrc`, `.gitattributes`, `.prettierrc`: These files achieve the same goal. They lint and format the code to comply with the style guide.
8. `.eslintignore`, `.gitignore`, `.prettierignore`: These are ignore files configured to ignore certain directories that do not require linting or configuring.
9. `CHANGELOG.md`: This file contains changes made up until the latest release. It is automatically generated when one of the admins bumps the version of the system.
10. `CONTRIBUTING.md`: You are reading it.
11. `esbuild.config.js`: The config file for javascript concatenation.
12. `.jsconfig.json` and `gulpfile.js`: These files contains the configuration for the scripts used to build and watch the project as well as releases.
13. `LICENSE`: The License file for the project.
14. `package-lock.json` and `package.json`: These files are used by `npm` to configure the project, and track dependencies.
15. `pathconfig.example`: Rename this file `pathconfig` and edit it to contain the absolute path to your `Foundry VTT/Data`-folder.
16. `README.md`: The Readme and project page.

## :hammer_and_wrench: How do I contribute?

> Glad you asked!

### Open issues

At any time the project has [a few open issues](/../../issues). If there is anything in there you think you would want to cut your teeth on, please do! Check [open pull requests](/../../pulls) first to see if there are anyone working on the issue. If you decide to tackle an issue, assign yourself to it, or comment on it, to indicate that you intend to work on it.

### Project page

Our [project page](/../../projects/1) contains a list of features and bugs that are suggested improvements to the system. Maybe there is something in there you would like to tackle.

### Raise an issue

Maybe you have found a bug, or maybe you have a feature in mind that you would like to see implemented. Head over to the [issue tracker](/../../issues) first, and see if it is already listed there. If it is not, go ahead and open an issue, if it is feel free to bump it or comment on it.

If you want to work on a bug or a feature yourself, please raise an issue first then assign yourself to it or indicate that you will be working on it. This way we don't end up with two people working on the same thing:bulb:

### Localization

Check the instructions for [localization with GitLocalize](#globe_with_meridians-Localization), as this helps you help us with localization.

### Spread the word

We are always looking for someone who can help with the project or one of the other projects in our organization. If you do not feel like you can contribute yourself, maybe you know someone who can:vulcan_salute:

## :dart: Pull Requests

When you are ready to submit a pull request, make sure you do a few things to help speed up the process.

1. Keep it tidy. Fewer commits with changes logically grouped together makes it easier to review them.
2. Make sure [Husky](#.husky) has done its job. E.g. check your commit messages to confirm that they follow [Conventional Commits Standards](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
3. Now you are ready to submit a Pull Request. The project contains two branches: `main`, and `localization`. When submitting a Pull Request make sure to point it to the `main` branch. Unless, you are pushing a **localization** change, then point to `localization` instead.
4. When creating the Pull Request consider prefacing the title with [an emoji that indicates the type of pull request](https://gitmoji.dev/).
5. Briefly describe the pull request and whether you have made any deletions or modifications that may be breaking.
6. That's it! Thank you so much for your help with improving this project:purple_heart:
