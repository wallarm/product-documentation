# API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** section of Wallarm Console enables you to manage monitored [API sessions](../about-wallarm/api-sessions.md), as well as to fine-tune this monitoring. This guide instructs you on using this section.

When the **API Sessions** module is [enabled](#enabling-and-configuring-api-sessions), users of any role, except **API Developer** can view it.

## Viewing monitored sessions

In the **API Sessions** section, you can view the list of the sessions automatically monitored due to the applied [configuration](#configuring-api-sessions). Expand session to see the included requests.

![!API Sessions section](../images/api-sessions/api-sessions.png)

You can use filters and search. You can use fuzzy terms (`*` and `?`) in the search. The search will be performed on the endpoints that were accessed in the sessions.

## Configuring API Sessions

By clicking the **Configure API Sessions** button in the **API Sessions** section, you proceed to the session monitoring options:

* At **Monitored sessions**, select hosts or/and applications: only requests targeting them will be analyzed for the possibility of joining in a session. You can also select **Monitor all sessions**.

    ![!API Sessions - Settings](../images/api-sessions/api-sessions-settings.png)

* At **Traced parameters**, specify up to 10 request parameters which values should be exported to Wallarm in order to use them for:

    * Request analysis: add you own parameters that you want to have information about when looking through the details of session requests. 
    * Session identification: use added parameters in **Session identification rules**. Wallarm always uses the set of built-in parameters for session identification, the ones added manually extend this set if they were added to the session identification rules.

* At **Session identification rules**, add up to 5 rules, specify up to 3 parameters from the **Traced parameters** per each rule. Wallarm checks each request for these parameters. If all parameters from rule #1 are present, that rule determines the session ID. Otherwise, proceed to rule #2 and so on. After that the built-in rules are applied.

For example, if you specify `example.com:8080/path1/path2` URI with `Application 01` additional condition, and add 4 parameters `traced-par-ex-1..4` to trace and then combined:

* `traced-par-ex-1`, `traced-par-ex-2`, `traced-par-ex-3` → rule 1
* `traced-par-ex-1`, `traced-par-ex-2` → rule 2
* `traced-par-ex-1`, `traced-par-ex-4`→ rule 3

...requests to `Application 01`'s endpoint `example.com:8080/path1/path2` will be analyzed and requests containing both `traced-par-ex-1` and `traced-par-ex-2` and `traced-par-ex-3` will be considered to be the part of the same session. If some of the parameters are missing, rule 2 will be applied.

If, for example, you additionally want to have information about `traced-par-ex-5` parameter, you add this parameter to the list of traced, but do not add it to any identification rule. As a result, it will be displayed in the session request details, but will not be used for session identification.

