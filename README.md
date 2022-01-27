# dhis2-login-page

This repository provides a script that will help you set a custom CSS theme for the login page of a DHIS2 instance in adequation with BLSQ defined layout.

## How To Install

    $ npm install

## How To Generate Your Stylesheet

Customize `theme.scss` to your needs (and `styles.scss` if needed)

    $ npm run build


## How to Update Your DHIS2 Instance

    $ npm run push "https://sandbox.bluesquare.org" "admin:$PASSWORD"
