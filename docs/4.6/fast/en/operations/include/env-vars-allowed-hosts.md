[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

 > #### Info:: Valid `ALLOWED_HOSTS` Variable Values
> The `ALLOWED_HOSTS` variable accepts the following host formats:
> * fully qualified names (e.g. `node.example.local`)
> * a value beginning with a period (e.g. `.example.local`) that is recognized as a subdomain wildcard
> * a value of `*` that matches anything (in this case, all requests are recorded by the FAST node)
> * the set of several values, for example: `"(node.example.local|example.com)"`
> * regular expression in the [syntax supported by NGINX](http://nginx.org/en/docs/http/server_names.html#regex_names)
> 
> For more information about the `ALLOWED_HOSTS` variable values, proceed to this [link][link-allowed-hosts].

<!-- -->