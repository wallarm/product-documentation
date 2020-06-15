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

To add a rule to an existing branch, click *Add rule* (the button will appear in the pop-up menu on the right after hovering the mouse cursor over the branch description line). You can also perform this operation on the rule page of this branch.

If necessary, it is possible to modify the branch to which a rule will be added. For this, click on the *If request is* clause in the rule-adding form and make changes to the branch description conditions. If a new branch is created, it will appear on the screen, and the application structure view will be updated.

![!Adding a new rule][img-add-rule]


### Branch Description

A branch description consists of a set of conditions for various parameters that an HTTP request must fulfill; otherwise, the rules associated with this branch will not be applied. Each line in the *If request is* section of the rule-adding form refers to a separate condition comprised of three fields: point, type, and comparison argument. The rules described in the branch are only applied to the request if all the conditions are fulfilled.

The *point* field indicates which parameter value should be extracted from the request for comparison. At present, not all of the points that can be analyzed by the filter node, are supported.

The following points are currently supported:
* **instance**: application ID.
* **proto**: HTTP protocol version (1.0, 1.1, 2.0, ...).
* **scheme**: http or https.
* **url**: full URL of the request in the same form as it was passed in the first line of the HTTP request.
* **path**, **action_name**, **action_ext**: URL elements. The details are provided in the [request analysis description][link-request-processing].
* **get**: GET parameters in the request.
* **header**: request headers.
* **method**: request methods.

Condition categories:

* **equal**: point value must match precisely with the comparison argument.
* **regex**: point value must match the regular expression. To match requests with regular expressions, the Pire library is used. Mostly, the syntax of expressions is standard but has some specifics as described below and in the README file of [Pire repository][link-regex].

    ??? info "Supported regular expression syntax"
        Characters that can be used as‑is:

        * Lowercase Latin letters: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
        * Capital Latin letters: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
        * Digits: `0 1 3 4 5 6 7 8 9`
        * Special characters: <code>! " # % & ' , - / : ; < = > @ ] _ ` } ~</code>
        * Whitespaces

        Characters that must be escaped with a backslash (`\`):

        * `. $ ^ { [ ( | ) * + ? \`

        Characters that must be converted to ASCII according to ISO‑8859:

        * UTF‑8 characters (for example, Russian letter `т` coverted to ASCII is `Ñ`)

        Character classes:

        * `\W` for any non-alphanumeric character; this is equivalent to the set `[^a-zA-Z0-9_]`
        * `\w` for any alphanumeric character and the underscore; this is equivalent to the set `[a-zA-Z0-9_]`
        * `\D` for any non-digit character; this is equivalent to the set `[^0-9]`
        * `\d` for any decimal digit; this is equivalent to the set `[0-9]`
        * `\S` for any non-whitespace character
        * `\s` for any whitespace character
        * `.` for any character except a newline
        * `()` to match whatever regular expression present inside `()`
        * `[]` for a single character present inside `[]` (case sensitive); the class can be used for the specific cases:
            * to ignore case (for example, `[cC]`)
            * `[a-z]` to match one of lowercase Latin letters
            * `[A-Z]` to match one of capital Latin letters
            * `[0-9]` to match one of digits
            * `[a-zA-Z0-9\.]` to match one of lowercase, or capital Latin letters, or digits, or dot
        
        Logic characters:

        * `~` is equal to NOT
        * `|` is equal to OR
        * `&` is equal to AND


        Characters to specify string boundaries:

        * `^` for the start of the string
        * `$` for the end of the string

        Quantifiers:

        * `*` for 0 or more repetitions of the preceding RE
        * `+` for 1 or more repetitions of the preceding RE
        * `?` for 0 or 1 repetitions of the preceding RE
        * `{m}` for `m` repetitions of the preceding RE
        * `{m,n}` for `m` to `n` repetitions of the preceding RE; omitting `n` specifies an infinite upper bound

        Character combinations that work with specifics:

        * `^.*$` is equal to `^.+$` (for example, empty HEADER will not be blocked if `^.*$` is passed in the rule)
        * `^.?$`, `^.{0,}$`, `^.{0,n}$` are equal to `^.+$`

        Not supported syntax:

        * Three-digit octal codes `\NNN`, `\oNNN`, `\ONNN`
        * `\cN` passing control characters via `\c` (for example, `cC` for CTRL+C)
        * `\A` for the start of the string
        * `\z` for the end of the string
        * `\b` before or after the whitespace character in the end of the string
        * `??`, `*?`, `+?` lazy quantifiers
        * Conditionals
        * Characters from not [basic Latin characters](https://unicode-table.com/en/blocks/basic-latin/) list

* **absent**: the request should not contain the designated point. In this case, the comparison argument is not used.

### Rule

The added request processing rule is described in the *Then* section.

The following rules are supported:

* [Set the filter mode][link-filter-mode-rule].
* [Mask sensitive data][link-sensitive-data-rule].
* [Apply a virtual patch][link-virtual-patch].
* [User-defined detection rules][link-regex-rule].
