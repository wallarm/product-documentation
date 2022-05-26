[link-request-processing]:      request-processing.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.md
[link-sensitive-data-rule]:     sensitive-data-rule.md
[link-virtual-patch]:           vpatch-rule.md
[link-regex-rule]:              regex-rule.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# Adding Rules in the Application Profile

To add a new rule, go to the *Rules* tab.

Rules can be added to both existing and new branches. They can be created from scratch or based on one of the existing branches.

To add a rule to an existing branch, click *Add rule* (after hovering the mouse cursor over the branch description line, the button will appear in the pop-up menu on the right). You can also perform this operation on the rule page of this branch.

If necessary, it is possible to modify the branch to which a rule will be added. For this, click on the *If request is* clause in the rule-adding form and make changes to the branch description conditions. If a new branch is created, it will appear on the screen, and the application structure view will be updated.

![!Adding a new rule][img-add-rule]


## Branch Description

A branch description consists of a set of conditions for various parameters that an HTTP request must fulfill; otherwise, the rules associated with this branch will not be applied. Each line in the *If request is* section of the rule-adding form refers to a separate condition comprised of three fields: point, type, and comparison argument. The rules described in the branch are only applied to the request if all the conditions are fulfilled.

To configure the set of conditions, both the **URI constructor** and the **advanced edit form** can be used.

### URI constructor

#### Working with URI constructor

URI constructor allows configuring the rule conditions by specifying the request method and endpoint in only one string:

* For the request method, the URI constructor provides the particular selector. If the method is not selected, the rule will be applied to requests with any method.
* For the request endpoint, the URI constructor provides the particular field accepting the following value formats:

    | Format | Examples and request point values |
    | ------ | ------ |
    | Full URI including the following components:<ul><li>Scheme (the value is ignored, you can explicitly specify the scheme by using the advanced form)</li><li>Domain</li><li>Port</li><li>Path</li><li>Query string parameters</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | URI with some components omitted | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - any value</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | URI with `*` meaning any non‑empty value of the component | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - any non‑empty value (hidden in the advanced edit form)</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - any non‑empty value (hidden in the advanced edit form)</li><li>`[action_ext]` - any non‑empty value (hidden in the advanced edit form)</li>The value matches `example.com/api/create/user.php`<br>and does not match `example.com/create/user.php` and `example.com/api/create`.</ul>|
    | URI with `**` meaning any number of components including its absence | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>The value matches `example.com/api/create/user` and `example.com/api/user`.<br>The value does not match `example.com/user`, `example.com/api/user/index.php` and `example.com/api/user/?w=delete`.</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - any non‑empty value (hidden in the advanced edit form)</li><li>`[action_ext]` - any non‑empty value (hidden in the advanced edit form)</li>The value matches `example.com/api/create/user.php` and `example.com/api/user/create/index.php`<br>and does not match `example.com/api`, `example.com/api/user` and `example.com/api/create/user.php?w=delete`.</ul> |
    | URI with the [regular expression](#condition-type-regexp) to match certain component values (regexp must be wrapped in `{{}}`) | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>The value matches `example.com/user/3445`<br>and does not match `example.com/user/3445/888` and `example.com/user/3445/index.php`.</ul> |

The string specified in the URI constructor is automatically parsed into the set of conditions for the following [request points](#points):

* `method`
* `header`. The URI constructor allows specifying only the header `HOST`.
* `path`, `action_name`, `action_ext`. Before confirming the rule creation, please ensure the values of these request points are parsed in one of the following ways:
    * Explicit value of certain `path` number + `action_name` + `action_ext` (optional)
    * Explicit value of `action_name` + `action_ext` (optional)
    * Explicit value of certain `path` number without `action_name` and without `action_ext`
* `query`

The value specified in the URI constructor can be completed by other request points available only in the [advanced edit form](#advanced-edit-form).

#### Using wildcards

Can you use wildcards when working with URI constructor in Wallarm? No and yes. "No" means you cannot use them [classically](https://en.wikipedia.org/wiki/Wildcard_character), "yes" means you can achieve the same result acting like this:

* Within parsed components of your URI, instead of wildcards, use regular expressions.
* Place `*` or `**` symbol into the URI field itself to replace one or any number of components (see examples in the section [above](#working-with-uri-constructor)).

**Some details**

The syntax of the regular expression is different from the classical wildcards, but the same results can be achieved. For example, you want to get a mask corresponding to:

* `something-1.example.com/user/create.com` and
* `anything.something-2.example.com/user/create.com`

...which in classical wildcards you would try to get by typing something like:

* `*.example.com/user/create.com`

But in Wallarm, your `something-1.example.com/user/create.com` will be parsed into:

![!Example of parsing URI into components](../../images/user-guides/rules/something-parsed.png)

...where `something-1.example.com` is a `header`-`HOST` point. We mentioned that wildcard cannot be used within the point, so instead we need to use regular expression: set the condition type to REGEX and then use the regular expression Walarm [specific syntax](#condition-type-regex):

1. Do not use `*` in a meaning "any number of symbols".
1. Put all the `.` that we want to be interpreted as "actual dots" in square brackets:

    `something-1[.]example[.]com`

1. Use `.` without brackets as replacement of "any symbol" and `*` after it as quantifier "0 or more repetitions of the preceding", so `.*` and:
    
    `.*[.]example[.]com`

1. Add `$` in the end of the expression to say that what we created must end our component:
    
    `.*[.]example[.]com$`

    !!! info "The simpler way"
        You can omit `.*` and leave only `[.]example[.]com$`. In both cases, Walarm will assume that any character can appear before `[.]example[.]com$` any number of times.

    ![!Using regular expression in header component](../../images/user-guides/rules/wildcard-regex.png)

### Advanced edit form

#### Points

The *point* field indicates which parameter value should be extracted from the request for comparison. At present, not all of the points that can be analyzed by the filter node, are supported.

The following points are currently supported:

* **application**: application ID.
* **proto**: HTTP protocol version (1.0, 1.1, 2.0, ...).
* **scheme**: http or https.
* **uri**: part of the request URL without the domain (for example, `/blogs/123/index.php?q=aaa` for the request sent to `http://example.com/blogs/123/index.php?q=aaa`).
* **path**, **action_name**, **action_ext** is hierarchical URI component sequence where: 

    * **path**: an array with URI parts separated by the `/` symbol (the last URI part is not included in the array). If there is only one part in the URI, the array will be empty.
    * **action_name**: the last part of the URI after the `/` symbol and before the first period (`.`). This part of the URI is always presented in the request, even if its value is an empty string.
    * **action_ext**: the part of the URI after the last period (`.`). It may be missing in the request.
* **query**: query string parameters.
* **header**: request headers. When you enter a header name, the most common values are displayed in a drop-down list. For example: `HOST`, `USER-AGENT`, `COOKIE`, `X-FORWARDED-FOR`, `AUTHORIZATION`, `REFERER`, `CONTENT-TYPE`.
* **method**: request methods. If the value is not explicitly specified, the rule will be applied to requests with any method.

#### Condition type: EQUAL (`=`)

The point value must match precisely with the comparison argument. For example, only `example` matches with the point value `example`.

!!! info "EQUAL condition type for the HOST header value"
    To cover more requests with the rules, we have restricted the EQUAL condition type for the HOST header. Instead of the EQUAL type, we recommend using the type IEQUAL that allows parameter values in any register.
    
    If you have previously used the EQUAL type, it will be automatically replaced with the IEQUAL type.

#### Condition type: IEQUAL (`Aa`)

The point value must match with the comparison argument in any case. For example: `example`, `ExAmple`, `exampLe` match with the point value `example`.

#### Condition type: REGEX (`.*`)

The point value must match the regular expression. 

**Regular expression syntax**

To match requests with regular expressions, the PIRE library is used. Mostly, the syntax of expressions is standard but has some specifics as described below and in the README file of [PIRE repository][link-regex].

??? info "Show regular expression syntax"
    Characters that can be used as‑is:

    * Lowercase Latin letters: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * Capital Latin letters: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * Digits: `0 1 3 4 5 6 7 8 9`
    * Special characters: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * Whitespaces

    Characters that must be placed into square brackets `[]` instead of escaping with `\`:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    Characters that must be converted to ASCII according to ISO‑8859:

    * UTF‑8 characters (for example, the character `ʃ` converted to ASCII is `Ê`)

    Character groups:

    * `.` for any character except a newline
    * `()` for grouping regular expressions, searching symbols present inside `()` or establishing a precedence order
    * `[]` for a single character present inside `[]` (case sensitive); the group can be used for the specific cases:
        * to ignore case (for example, `[cC]`)
        * `[a-z]` to match one of lowercase Latin letters
        * `[A-Z]` to match one of capital Latin letters
        * `[0-9]` to match one of digits
        * `[a-zA-Z0-9[.]]` to match one of lowercase, or capital Latin letters, or digits, or dot

    Logic characters:

    * `~` is equal to NOT. The inverted expression and the character must be placed into `()`,<br>for example: `(~(a))`
    * `|` is equal to OR
    * `&` is equal to AND

    Characters to specify string boundaries:

    * `^` for the start of the string
    * `$` for the end of the string

    Quantifiers:

    * `*` for 0 or more repetitions of the preceding regular expression
    * `+` for 1 or more repetitions of the preceding regular expression
    * `?` for 0 or 1 repetitions of the preceding regular expression
    * `{m}` for `m` repetitions of the preceding regular expression
    * `{m,n}` for `m` to `n` repetitions of the preceding regular expression; omitting `n` specifies an infinite upper bound

    Character combinations that work with specifics:

    * `^.*$` is equal to `^.+$` (empty values does not match with `^.*$`)
    * `^.?$`, `^.{0,}$`, `^.{0,n}$` are equal to `^.+$`

    Temporarily not supported:

    * Character classes like `\W` for non-alphabetics, `\w` for alphabetics, `\D` for any non-digits, `\d` for any decimals, `\S` for non-whitespaces, `\s` for whitespaces

    Not supported syntax:

    * Three-digit octal codes `\NNN`, `\oNNN`, `\ONNN`
    * `\cN` passing control characters via `\c` (for example, `\cC` for CTRL+C)
    * `\A` for the start of the string
    * `\z` for the end of the string
    * `\b` before or after the whitespace character in the end of the string
    * `??`, `*?`, `+?` lazy quantifiers
    * Conditionals

**Testing regular expressions**

To test the regular expression, you can use the **cpire** utility on supported Debian or Ubuntu:

1. Add Wallarm repository:
    
    === "Debian 9.x (stretch)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/4.0/' | sudo tee --append /etc/apt/sources.list.d/wallarm.list"
        # for correct Wallarm node operation, uncomment the following line in /etc/apt/sources.list`:
        # deb http://deb.debian.org/debian stretch-backports main contrib non-free
        sudo apt update
        ```
    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node bullseye/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
2. Install the **cpire** utility:

    ```bash
    sudo apt install libcpire-utils
    ```
3. Run the **cpire** utility:
    ```bash
    cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
    ```
4. Enter the value to check whether it matches with the regular expression. The utility will return the result:
    * `0` if the value matches with the regular expression
    * `FAIL` if the value does not match with the regular expression
    * Error message if the regular expression is invalid

    !!! warning "Specifics of handling the `\` character"
        If the expression includes `\`, please escape it with `[]` and `\` (for example, `[\\]`).

**Examples of regular expressions added via Wallarm Console**

* To match any string that includes <code>/.git</code>

    ```
    /[.]git
    ```
* To match any string that includes <code>.example.com</code>

    ```
    [.]example[.]com
    ```
* To match any string ending with <code>/.example.*.com</code> where `*` can be any symbol repeated any number of times

    ```
    /[.]example[.].*[.]com$
    ```
* To match all IP addresses excluding 1.2.3.4 and 5.6.7.8

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* To match any string ending with <code>/.example.com.php</code>

    ```
    /[.]example[.]com[.]php$
    ```
* To match any string that includes <code>sqlmap</code>with letters in lower and upper case: <code>sqLmAp</code>, <code>SqLMap</code>, etc

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* To match any string that includes one or several values: <code>admin\\.exe</code>, <code>admin\\.bat</code>, <code>admin\\.sh</code>, <code>cmd\\.exe</code>, <code>cmd\\.bat</code>, <code>cmd\\.sh</code>

    ```
    (admin|cmd)[\].(exe|bat|sh)
    ```
* To match any string that includes one or several values: <code>onmouse</code> with letters in lower and upper case, <code>onload</code> with letters in lower and upper case, <code>win\\.ini</code>, <code>prompt</code>

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\].ini|prompt
    ```
* To match any string that starts with `Mozilla` but does not contain the string `1aa875F49III`
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* To match any string with one of the values: `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Condition type: ABSENT (`∅`)

The request should not contain the designated point. In this case, the comparison argument is not used.

## Rule

The added request processing rule is described in the *Then* section.

The following rules are supported:

* [Disable/Enable request parsers](disable-request-parsers.md)
* [Add or replace server response header](add-replace-response-header.md)
* [Set the filtration mode][link-filter-mode-rule]
* [Mask sensitive data][link-sensitive-data-rule]
* [Disable/Enable active threat verification](change-request-for-active-verification.md#disabling-enabling-the-active-threat-verification-module)
* [Rewrite attack before active verification](change-request-for-active-verification.md#rewriting-the-request-before-attack-replaying)
* [Apply a virtual patch][link-virtual-patch]
* [User-defined detection rules][link-regex-rule]
* [Ignore certain attack types](ignore-attack-types.md)
* [Ignoring certain attack signs in the binary data](ignore-attacks-in-binary-data.md)
