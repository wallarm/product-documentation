[link-request-processing]:      request-processing.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.md
[link-sensitive-data-rule]:     sensitive-data-rule.md
[link-virtual-patch]:           vpatch-rule.md
[link-regex-rule]:              regex-rule.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# Adding Rules in the Application Profile

To add a new rule, go to the *Profile & Rules* tab.

Rules can be added to both existing and new branches. They can be created from scratch or based on one of the existing branches.

To add a rule to an existing branch, click *Add rule* (after hovering the mouse cursor over the branch description line, the button will appear in the pop-up menu on the right). You can also perform this operation on the rule page of this branch.

If necessary, it is possible to modify the branch to which a rule will be added. For this, click on the *If request is* clause in the rule-adding form and make changes to the branch description conditions. If a new branch is created, it will appear on the screen, and the application structure view will be updated.

![!Adding a new rule][img-add-rule]


## Branch Description

A branch description consists of a set of conditions for various parameters that an HTTP request must fulfill; otherwise, the rules associated with this branch will not be applied. Each line in the *If request is* section of the rule-adding form refers to a separate condition comprised of three fields: point, type, and comparison argument. The rules described in the branch are only applied to the request if all the conditions are fulfilled.

### Points

The *point* field indicates which parameter value should be extracted from the request for comparison. At present, not all of the points that can be analyzed by the filter node, are supported.

The following points are currently supported:

* **instance**: application ID
* **proto**: HTTP protocol version (1.0, 1.1, 2.0, ...)
* **scheme**: http or https
* **uri**: part of the request URL without the domain (for example, `/blogs/123/index.php?q=aaa` for the request sent to `http://example.com/blogs/123/index.php?q=aaa`)
* **path**, **action_name**, **action_ext**: URL elements (recommended format for URL describing). More details are provided in the [request analysis description][link-request-processing]
* **get**: GET parameters in the request
* **header**: request headers
* **method**: request methods

### Condition types

#### EQUAL

The point value must match precisely with the comparison argument. For example, only `example` matches with the point value `example`.

#### IEQUAL

The point value must match with the comparison argument in any case. For example: `example`, `ExAmple`, `exampLe` match with the point value `example`.

#### REGEX

The point value must match the regular expression. 

**Regular expression syntax**

To match requests with regular expressions, the Pire library is used. Mostly, the syntax of expressions is standard but has some specifics as described below and in the README file of [Pire repository][link-regex].

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

    * `~` is equal to NOT
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

    * Character classes like `\W` for non-alphanumerics, `\w` for alphanumerics, `\D` for any non-digits, `\d` for any decimals, `\S` for non-whitespaces, `\s` for whitespaces

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
    
    === "Debian 8.x (jessie)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 9.x (stretch)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Debian 10.x (buster)"
        ```bash
        sudo apt update
        sudo apt install dirmngr
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 14.04 LTS (trusty)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node trusty/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 16.04 LTS (xenial)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt update
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt update
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/2.14/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
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
    
    If the expression includes `\`, please escape it with `[]` and `\` (for example, `[\\]`). If the regular expression is invalid, then the utility will return an error message.
4. Enter the value to check whether it matches with the regular expression. The utility will return the result:
    * `0` if the value matches with the regular expression
    * `FAIL` if the value does not match with the regular expression

**Examples of regular expressions**

* To match any string that includes <code>/.git</code>

    ```
    /[.]git
    ```
* To match any string that includes <code>.example.com</code>

    ```
    [.]example[.]com
    ```
* To match any string ending with <code>/.example.*.com</code>

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

#### ABSENT

The request should not contain the designated point. In this case, the comparison argument is not used.

## Rule

The added request processing rule is described in the *Then* section.

The following rules are supported:

* [Set the filter mode][link-filter-mode-rule].
* [Mask sensitive data][link-sensitive-data-rule].
* [Apply a virtual patch][link-virtual-patch].
* [User-defined detection rules][link-regex-rule].
