#!/usr/bin/env node
const fs = require('fs');
const commander = require('commander');
const axios = require('axios').default;

const program = new commander.Command();

async function main(baseURL, {username, password}) {
  axios.defaults.baseURL = baseURL;
  axios.defaults.auth = {username, password};
  
  if (!fs.existsSync('./build/styles.css')) {
    throw new Error("build not found. Run `npm run build`.");
  }
  const file = fs.readFileSync('./build/styles.css');

  console.log('Publish custom CSS...');

  try {
    const response = await axios({
      method: 'post',
      url: '/api/33/files/style',
      headers: {
        'Content-Type': 'text/css'
      },
      data: file
    });
    console.log(response.data.message);
  } catch (err) {
    throw new Error("Check your credentials or network");
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
      console.error(err.message);
    }
  }
}


program
  .argument('<server>', 'DHIS2 Server')
  .option('-u, --username <username>', 'Username', 'admin')
  .requiredOption('-p, --password <password>', 'Password')
  .action(main)
  .parse(process.argv);