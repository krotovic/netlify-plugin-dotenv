# netlify-plugin-dotenv
Netlify Build plugin that reads environment variables from .env file

## Usage

You can just add this plugin to your Netlify configuration 
by including in your config file like this:

```toml
# netlify.toml

[[plugins]]
  package = "netlify-plugin-dotenv"
```

> **Note:** Unfortunatelly this plugin wasn't accepted to be part of
the official Netlify plugins so you can't install it from the dashboard.
And you **have to** install it as dependency of your project by adding it into `package.json` file.

### Options

| name | default | description |
| ---- | ------- | ----------- |
| variable | none | You can specify what environment variable will be used for resolving the file. If you specify `BRANCH` the filename will become `.env.${process.env.BRANCH}`. |

```toml
# netlify.toml

[[plugins]]
  package = "netlify-plugin-dotenv"
  [plugins.inputs]
    variable = "BRANCH"
```

This plugin will read and parse files in the following order:

1. `.env.master` for `BRANCH=master` and variable = BRANCH
1. `.env`

Using this order will result in overwriting environment variables from bottom up.
So if you have some default variable `FOO` defined in both `.env` and `.env.production` it will resolve using variable from the latter one.
