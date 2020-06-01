# PDF generator

### Overview

This generator uses headless chrome to browse the Wallarm documentation and print it as pdf. 

### Preparing

A script works on Node.js so you have to install it. It would be perfect to use a Node.js version 13 or above.
Then you have to install required dependencies:

```shell script
$ npm install
```

### Generating process

Run this command in the project root directory:

```shell script
$ node pdf
```

Wait until the generation process is done. Then you can see a `index.pdf` and `docs.pdf` in the `tmp/` directory.
You need to manually merge this files. The reason two separated files are created is because margins and header/footer
in the index page and other pages are different. And there is no automatic merge due to broken ToC links during
the merging process. On Mac OS, it is super easy to copy and paste the index page into the main content.
