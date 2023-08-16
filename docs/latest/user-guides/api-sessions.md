# API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Sessions** section of Wallarm Console enables you to manage discovered [API sessions](../about-wallarm/api-sessions.md), as well as to fine-tune this discovery. This guide instructs you on using this section.

## Viewing discovered sessions

In the **API Sessions** section, you can view the list of the sessions automatically discovered due to the applied [configuration](#configuring-api-sessions). Expand session to see the included requests.

![!API Sessions section](../images/api-sessions/api-sessions.png)

## Configuring API Sessions

By clicking the **Configure API Sessions** button in the **API Sessions** section, you proceed to the session discovery options:

* At **Monitored sessions**, select applications or/and endpoints: only requests targeting them will be analyzed for the possibility of joining in a session. You can also select **Monitor all sessions**.
* At **Traced parameters**, specify up to 10 request parameters which values should be exported to Wallarm in order to use them for the session identification. Use selected parameters in **Session identification rules**. If nothing is specified, the default set of parameters is used.
* At **Session identification rules**, specify up to 3 parameters from the **Traced parameters** per session identification rule. Wallarm checks each request for these parameters. If all parameters from rule #1 are present, that rule determines the session ID. Otherwise, proceed to rule #2 and so on. After that the default rules are applied.

For example, if you specify `example.com:8080/path1/path2` URI with `Application 01` additional condition, and add 4 parameters `traced-par-ex-1..4` to trace and then combined:

* `traced-par-ex-1`, `traced-par-ex-2`, `traced-par-ex-3` → rule 1
* `traced-par-ex-1`, `traced-par-ex-2` → rule 2
* `traced-par-ex-1`, `traced-par-ex-4`→ rule 3

...requests to `Application 01`'s endpoint `example.com:8080/path1/path2` will be analyzed and requests containing both `traced-par-ex-1` and `traced-par-ex-2` and `traced-par-ex-3` will be considered to be the part of the same session (ALL? for all time? TBD). If some of the parameters are missing, rule 2 will be applied.

If, for example, you did not select any custom parameters to trace, you do not create rules and requests to `Application 01`'s endpoint `example.com:8080/path1/path2` are analyzed using default set of parameters.
