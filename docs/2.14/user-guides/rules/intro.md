[link-request-processing]:      request-processing.md
[link-rules-compiling]:         compiling.md


# Application Profile Rules

On the *Profile & Rules* tab you may review and change the rules for handling requests enabled for the current application profile.

The application profile is a collection of known information about protected applications. It is used to fine-tune the behavior of the system during the analysis of requests and their further processing in the post-analysis module as well as in the cloud.

For a better understanding of how the traffic processing rules are applied, it is advisable to learn how the filter node [analyzes the requests][link-request-processing].

One important thing about making changes to the rules is that these changes don't take effect immediately. It may take some time to [compile the rules][link-rules-compiling] and download them into filter nodes.

## Terminology

#### Point

Each parameter of the HTTP request in the Wallarm system is described with a sequence of filters applied for request processing, e.g., headers, body, URL, Base64, etc. This sequence is called the *point*.

Request processing filters are also called parsers.


#### Rule Branch

The set of HTTP request parameters and their conditions is called the *branch*. If the conditions are fulfilled, the rules related to this branch will be applied.

For example, the rule branch `example.com/**/*.*` describes the conditions matching all requests to any URL of the domain `example.com`.


#### Endpoint (Endpoint Branch)
A branch without nested rule branches is called an *endpoint branch*. Ideally, an application endpoint corresponds to one business function of the protected application. For instance, such business function as authorization can be an endpoint rule branch of `example.com/login.php`.


#### Rule
A request processing setting for the filter node, the post-analysis module, or the cloud is called a *rule*.

Processing rules are linked to the branches or endpoints. A rule is applied to a request only if the request matches all the conditions described in the branch.
