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

Wait until the generation process is done. Then you can find the `en-waf-documentation.pdf` file in the `tmp/` directory.
