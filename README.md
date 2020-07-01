# netlify-plugin-dotenv
Netlify Build plugin that reads environment variables from .env file

## Usage

You can just add this plugin to your Netlify configuration 
either by installing in the dashboard or including in your 
config file like this:

```toml
# netlify.toml

[[plugins]]
package = "dotenv"
```

## Options

You can configure this plugin to use different resolution 
method. It supports resolving by git branch (_branch_) like `.env.master`
or by build context (_context_) like `.env.branch-preview`.
Or simply use `.env` file (_none_). The default method is __branch__.

If the plugin can't find the file it won't fail the build.

Configure it in your config file like so:

```toml
# netlify.toml

[[plugins]]
package = "dotenv"
  [plugins.inputs]
  method = "branch" # branch, context, none
```
