Let us say your application, accessible at the `example.com` domain, uses the `X-AUTHENTICATION` header in a 32-hex-symbol format for user authentication and you want to reject tokens with an incorrect format.

To do so, set the **Create regexp-based attack indicator** rule and set it to **Virtual patch** as displayed in the screenshot, including:

* Regular expression: `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
* Request part: `header` - `X-AUTHENTICATION`

![Regex rule first example][img-regex-example1]