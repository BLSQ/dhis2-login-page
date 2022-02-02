# dhis2-login-page

This repository provides a script that will help you set a custom CSS theme for the login page of a DHIS2 instance in adequation with BLSQ defined layout.

## How To Generate a Default Stylesheet

    $ npx @blsq/dhis2-theme create

It will create a `theme.json` that you can customize at will.

## How to Update Your DHIS2 Instance

    $ npx @blsq/dhis2-theme publish theme.json -o build -s "https://sandbox.bluesquare.org" -u admin -p $PASSWORD
