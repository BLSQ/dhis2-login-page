# dhis2-login-page

This repository provides a script that will help you set a custom CSS theme for the login page of a DHIS2 instance in adequation with BLSQ defined layout.

## Prerequisites

You need to have at least node.js v16.

## How To Generate a Default Stylesheet

    $ npx @blsq/dhis2-theme create // default: theme.json

It will create a `theme.json` that you can customize at will.

## Theme Variables

Variables are in the file created at the last step (default: theme.json).

- `backgroundImage`: Can be empty or filled with a css `url()`. HTTP/HTTPS images will be kept untouched but local files will be inlined in the resulting css
- `backgroundColor`: Background color of the whole login page
- `textColor`: Text color of the login page
- `displayFlag`: Display the flag according the dhis2 setting (default: false)
- `leftPanelWidth`: Width of the left panel containing the login form

## How to Update Your DHIS2 Instance

    $ npx @blsq/dhis2-theme publish theme.json -o build -s "https://sandbox.bluesquare.org" -u admin -p $PASSWORD
