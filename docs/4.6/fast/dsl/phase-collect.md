[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-collect-uniq]:    ../../images/fast/dsl/en/phases/collect-uniq.png

# The Collect Phase

!!! info "Scope of the phase"
    This phase is used in a modifying extension and is optional for its operation (the `collect` section may be either absent or present in the YAML file).
    
    Also, this phase is implicitly used by a nonmodifying extension because this extension type makes use of the uniqueness condition.
    
    Read about the extension types in detail [here][link-ext-logic].

!!! info "Request elements description syntax"
    When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points.
    
    To see detailed information, proceed to this [link][link-points].

 This phase collects all the baseline requests that satisfy the specified condition. To make the decision about collecting the request, the phase uses the information about the requests that were already collected during the test run.

The baseline request collection procedure happens in real time. Each of the requests will be processed in the order in which the FAST node writes the baseline requests. There is no need to wait until the request-writing process is finished for the requests to be processed and collected by the Collect phase.

## The Uniqueness Condition

The uniqueness condition does not allow those baseline requests that are not unique according to the specified criteria to proceed for processing in the remaining phases. No test requests are generated for these filtered-out requests. This can be useful for target application load reduction in the case that it receives multiple baseline requests of the same type.

The uniqueness of each of the received requests is determined on the basis of the data in the requests that were received earlier.

![!The Collect phase with the uniqueness condition][img-collect-uniq]

The list of the elements in a request that should be used to determine the uniqueness of the baseline request is defined in the uniqueness condition.

Upon receiving the baseline request, the extension in the Collect phase performs the following actions for each of the elements of the request in the list:
1. If there is no such element in the baseline request, proceed to the next element in the list.
2. If there is such an element in the baseline request and this element's data is unique (in other words, it does not match any of the previously received baseline requests' data), treat this baseline request as unique and transfer it to the next phases. Remember the data of this request element.
3. If there is such an element in the baseline request and this element's data is not unique (in other words, it matches a previously received baseline requests' data), discard this baseline request because it does not satisfy the uniqueness condition. The extension will not be executed for the given request.
4. If the end of the list is reached and no request element that can be checked for uniqueness was found, discard this baseline request. The extension will not be executed for this request.

You can describe the uniqueness condition in the `collect` section of the extension's YAML file using the `uniq` list that contains the elements by which the uniqueness of the baseline request will be defined.

```
collect:
  - uniq:
    - [request element]
    - [request element 1, request element 2, …, request element N]
    - testrun
```  

The request element in the list may contain [regular expressions in the Ruby regular expression format][link-ruby-regexp].

The `uniq` uniqueness condition comprises the array of the request elements that contain the data that is used to check the uniqueness of the baseline request. The `testrun` parameter may be used as well.

The uniqueness condition parameters are as follows:

* **`- [request element]`**
    
    The request should contain unique data in the request element for the request to be treated as unique.
    
    ??? info "Example"
        `- [GET_uid_value]` — the request’s uniqueness is defined by the `uid` GET parameter data (in other words, the extension should run for each of the baseline requests with a unique value of the `uid` GET parameter).

        * `example.com/example/app.php?uid=1` is a unique request.
        * `example.com/demo/app.php?uid=1` is not a unique request.
        * `example.com/demo/app.php?uid=` is a unique request.
        * `example.org/billing.php?uid=1` is not a unique request.
        * `example.org/billing.php?uid=abc` is a unique request.

* **`- [request element 1, request element 2, …, request element N]`**
    
    The request should contain the set of N elements, and the request element data in each of these sets should be unique for the request to be treated as unique.
    
    ??? info "Example 1"
        `- [GET_uid_value, HEADER_COOKIE_value]` — the request’s uniqueness is determined by the `uid` GET parameter data and the `Cookie` HTTP header data (in other words, the extension should run for each of the baseline requests with the unique value of the `uid` GET parameter and the `Cookie` header).

        * `example.org/billing.php?uid=1, Cookie: client=john` is a unique request.
        * `example.org/billing.php?uid=1, Cookie: client=ann` is a unique request.
        * `example.com/billing.aspx?uid=1, Cookie: client=john` is not a unique request.
    
    ??? info "Example 2"
        `- [PATH_0_value, PATH_1_value]` — define the request’s uniqueness by the pair of the first and the second elements of the path (in other words, run the extension for each of the baseline requests with the unique value of the pair containing the `PATH_0` and `PATH_1` parameters).
            
        Wallarm performs the parsing of the request elements during element processing. For each of the URI paths in the form of `/en-us/apps/banking/` the Path parser puts each of the path elements into the PATH array.
            
        You can access each of the array element values using its index. For the `/en-us/apps/banking/` path mentioned earlier, the parser provides the following data:

        * `"PATH_0_value": "en-us"`
        * `"PATH_1_value": "apps"`
        * `"PATH_2_value": "banking"`
            
        Thus, the uniqueness condition for the `[PATH_0_value, PATH_1_value]` will be satisfied by any request that contains different values in the first and the second element of the path.

        * `example.com/en-us/apps/banking/charge.php` is a unique request.
        * `example.com/en-us/apps/banking/vip/charge.php` is not a unique request.
        * `example.com/de-de/apps/banking/vip/charge.php` is a unique request.
    
* **`- testrun`**
    
    The extension will be executed once in a test run if the test request is successfully created (in other words, if all the other phases are passed).
    
    For example, if no test requests can be generated based on the received baseline request because of the baseline requests being discarded in the Match phase, then the extension in the Collect phase continues to collect the baseline requests until one of them is processed through the Match phase and then the test requests for the target application are created based on it.
    
    Using any of the request elements in the `uniq` list is not allowed if you are already using the `testrun` parameter. The `uniq` uniqueness condition will contain a single element.
    
    ```
    collect:
      - uniq:
        - testrun 
    ```
    
    If there are multiple elements in the `uniq` list, then it is necessary for the request to have at least one unique parameter from the `uniq` list in order to define the baseline request as unique. 



!!! info "Collect phase parameters"
    Currently, only the uniqueness condition for the received baseline requests is supported in the Collect phase. In the future, the functionality of this phase may be expanded.
    