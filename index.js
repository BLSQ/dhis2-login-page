#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const commander = require('commander');
const Mustache = require('mustache');
const postcss = require('postcss').default;
const postcssSass = require('@csstools/postcss-sass');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const scssSyntax = require('postcss-scss');
const defaultTheme = require('./theme.default.json');


const axios = require('axios').default;
const program = new commander.Command();

async function publish(baseURL, {output, username, password}) {
  console.log(`Publish custom CSS on ${baseURL}`);
  axios.defaults.baseURL = baseURL;
  axios.defaults.auth = {username, password};
  
  try {
    const response = await axios({
      method: 'post',
      url: '/api/30/files/style',
      headers: {
        'Content-Type': 'text/css'
      },
      data: fs.readFileSync(path.resolve(output, 'theme.css'))
    });
    console.log(response.data.message);
  } catch (err) {
    if (err.response && [401, 403].includes(err.response.status)) {
      throw new Error("Check your credentials");
    } else if (err.response) {
      throw new Error(err.response.data)
    } else {
      throw err
    }
  }
  
  console.log('\nSet footers for locales...');
  for (const locale of ['', 'en', 'fr']) {
    try {
      const response = await axios({
        method: 'post',
        url: `/api/systemSettings/keyApplicationFooter?locale=${locale}`,
        headers: {
          'Content-Type': 'text/plain'
        },
        data: '&&nbsp; <a href="https://bluesquarehub.com/">Bluesquare</a>'
      });
      console.log(response.data.message);
    } catch (err) {
      if (err.response){
        throw new Error(err.response.data)
      } else {
        throw err
      }
    }
  }
}

async function build(themeFile, {output}) {
  console.log('Building theme...')
  
  const postcssPlugins = [postcssImport(), postcssSass(), postcssUrl({url: "inline", basePath: ".."})]
  const templateContent = fs.readFileSync(path.resolve(__dirname, 'theme.scss.mustache'), {encoding: 'utf-8'});
  const customTheme = JSON.parse(fs.readFileSync(path.resolve(themeFile), {encoding: 'utf-8'}));
  const config = {
    ...defaultTheme,
    ...customTheme
  };
  console.log('Theme Configuration: \n', JSON.stringify(config, null, 2));
  
  const css = Mustache.render(templateContent, config);
  
  const destCssFile = path.resolve(output, 'theme.css');
  const finalCss = await postcss(postcssPlugins)
    .process(css, {
      syntax: scssSyntax,
      from: path.resolve(output, 'theme.scss'),
      to: destCssFile
    });

  fs.mkdirSync(output, { recursive: true });
  console.log(`Write css to ${destCssFile}`);
  fs.writeFileSync(destCssFile, finalCss.css);
}

async function main(themeFile, {server, username, password, output}) {
  if (!server.startsWith("https://")) {
    throw new Error("Only https is accepted")
  }
  await build(themeFile, {output});
  if (server && username && password) {
    await publish(server, {username, password, output});
  } else {
    console.log('Not pushed. Provide the server URL, username and password to push theme on the instance');
  }
}

program
  .command("create")
  .argument("[target]", "Theme file", "theme.json")
  .action((target) => {
    console.log(`Copying default theme in ${target}...`)
    fs.writeFileSync(path.resolve(target), JSON.stringify(defaultTheme, null, 2), {encoding: 'utf-8'})
  })

program
  .command("publish")
  .argument('<theme>', 'Theme File')
  .option('-o, --output <output>', 'Output directory', './build')
  .option('-s, --server <server>', 'DHIS2 Server')
  .option('-u, --username <username>', 'Username', 'admin')
  .option('-p, --password <password>', 'Password')
  .action(main);

program.addHelpText('after', `

Default theme:
  {
    "backgroundColor": "rgba(67,97,238, 1)", // BLSQ Color
    "textColor": "white",
    "displayFlag": false,
    "leftPanelWidth": "420px",
    "backgroundImage": "url('./assets/background_example.png')" // local file will be inlined
  }

Example call:
  Create a theme.json
  $ npx @blsq/dhis2-theme create

  ¨Publish your theme
  $ npx @blsq/dhis2-theme publish my_theme.json -s https://sandbox.bluesquare.org -u admin -p district`);

program.parse(process.argv);