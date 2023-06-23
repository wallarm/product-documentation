    * The “Stop on first fail” checkbox defines whether the test run should be stopped after the first vulnerability was found.
    * The “Skip duplicated baselines” checkbox defines whether the duplicates of the baseline requests received earlier should be ignored. If the FAST node receives the same baseline request as the one received in this test run previously, then no test requests are created on its basis, and the FAST node console prints the following message: `[info] The baseline #8921 is duplicated and already was processed`.
    * The “Skip following files extensions” checkbox defines whether certain file types are excluded from the evaluation process during testing. These file types are specified by the regular expression.
    
        For example, if you set the `ico` file extension to be excluded, then the `GET /favicon.ico` baseline request will not be checked by FAST and will be skipped.
        
        The regular expression can contain one of the following mutually excluding expressions:
        
        * `.`: any number of any character
        * `x*`: any number of the `x` character
        * `x?`: the single `x` character (or no character `x` at all)
        * any single file extension (e.g., `jpg`)
        * several extensions delimited by either “|” or “,” character (e.g., `jpg | png` or `jpg, png`)
        
        If a regular expression is not specified, then FAST will check baseline requests with any file extension.
    
    * The “RPS per test run” slider defines the request per second limit for the test run. This setting can take values from `1` to `1000`. The default value is `1000`.
    * The “RPS per baseline” slider defines the request per second limit for one baseline request. This setting can take values from `1` to `500`. The default value is `500`.
    * The “Stop baseline recording after” slider defines the test run time limit. This setting can take values from `5 min` (5 minutes) to `1 day` (24 hours). The default value is `30 min` (30 minutes).