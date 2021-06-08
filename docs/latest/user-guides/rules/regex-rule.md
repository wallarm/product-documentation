[link-regex]:       https://github.com/yandex/pire

[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png

# User-Defined Detection Rules

In some cases, it may prove useful to add a signature for attack detection manually or to create a so-called *virtual patch*. As such, Wallarm does not use regular expressions to detect attacks, but it does allow users to add additional signatures based on regular expressions.

## Adding a New Detection Rule

To do this, you need to create the rule *Define a request as an attack based on a regular expression* and fill in the fields:

*Regex*: regular expression (signature). If the value of the following parameter matches the expression, that request is detected as an attack. Syntax and specifics of regular expressions are described in the [instructions on adding rules](add-rule.md#regex).

*Attack*: the type of attack that will be detected when the parameter value in the request matches the regular expression.

*Experimental*: this flag allows you to safely check the triggering of a regular expression without blocking requests. The requests won't be blocked even when the filter node is set to the blocking mode. These requests will be considered as attacks detected by the experimental method. They can be accessed using search query `experimental attacks`.

*in this part of request*: determines a point in the request, where the system should detect the corresponding attacks.


### Example: Blocking All Headers with an Incorrect X-Authentication Header

**If** the following conditions take place:

* the application is accessible at the domain *example.com*
* the application uses the *X-Authentication* header for user authentication
* the header format is 32 hex symbols

**Then**, to create a rule for rejecting incorrect format tokens:

1. Go to the *Rules* tab
2. Find the branch for `example.com/**/*.*` and click *Add rule*
3. Select *Define as an attack on the basis of a regular expression*
4. Set *Regex* value as `[^0-9a-f]|^.{33,}$|^.{0,31}$`
5. Choose `Virtual patch` as the type of *Attack*
6. Set the point `Header X-AUTHENTICATION`
7. Click *Create*

![!Regex rule first example][img-regex-example1]


## Partial Disabling of a New Detection Rule

If the created rule should be partially disabled for a particular branch, this can easily be done by creating the rule *Disable attack detection by the regular expressions* with the following fields:

- *Regex ID*: identifiers of the previously created regular expressions that must be ignored.
- *in this part of request*: indicates the parameter that requires setting up an exception.

### Getting an ID of a Regular Expression

Identifier is generated automatically when you add a new regular expression rule. To get an ID of a regular expression, proceed to the following steps:
1. In the *Rules* tab, welect the branch which the desired regular expression was set for.
2. Select the group of rules which contains the desired regular expression.
3. Click the desired regular expression entry and copy a regular expression ID.

![!Getting an ID of a regular expression][img-regex-id]

### Example: Permit an Incorrect X-Authentication Header for a Designated URL.

Let's say you have a script at `example.com/test.php`, and you want to change the format of the tokens for it.

To create the relevant rule:

1. Go to the *Rules* tab
1. Find or create the branch for `example.com/test.php` and click *Add rule*
1. Choose *Disable attack detection by the regular expressions*
1. Enter the ID of the rule that you want to disable into the *Regex ID* field
1. Set the point `Header X-AUTHENTICATION`
1. Click *Create*

![!Regex rule second example][img-regex-example2]
