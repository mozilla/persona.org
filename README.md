persona.org
===========

Persona.org product page.

Not to be confused with the Persona service, repo at
https://github.com/mozilla/browserid

### Static Site built by [Wintersmith][]

To test locally:

    > npm install
    > npm start

Pages are found in `contents/`, as `.ejs` files.

To deploy:

    > npm install
    > node ./scripts/build.js

And it will build out the whole site into `build/`.


[Wintersmith]: https://github.com/jnordberg/wintersmith
