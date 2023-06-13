[doc-inactivity-timeout]:           internals.md#test-run

| API call: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Authorization: | Required | With the token |
| HTTP header with the token: | `X-WallarmAPI-Token` | Serves to pass the token’s value to the API server |
| Parameters: | `name` **(required)** | Name of the test run |
|  | `test_record_name` | The test record name. All baseline requests will be placed in this test record.<br>Default value: the test run's name. |
|  | `desc` | Detailed description of the test run.<br>Default value: empty string |
|  | `file_extensions_to_exclude` | This parameter allows specifying certain file types that need to be excluded from the evaluation process during testing. These file types are specified by the regular expression.<br>For example, if you set the `ico` file extension to be excluded, then the `GET /favicon.ico` baseline request will not be checked by FAST and will be skipped.<br>The regular expression has the following format:<br>- `.`: any number (zero or more) of any character<br>- `x*`: any number (zero or more) of the `x` character<br>- `x?`: the single `x` character (or none)<br>- any single file extension (e.g., `jpg`)<br>- several extensions delimited by the vertical bar (e.g., `jpg` &#124; `png`)<br>Default value: empty string (FAST will check baseline requests with any file extension). |
|  | `policy_id` | The identifier of the test policy.<br>If the parameter is missing, then the default policy takes action |
|  | `stop_on_first_fail` | The parameter specifies FAST’s behavior when a vulnerability has been detected:<br>`true`: stop the execution of the test run on the first detected vulnerability.<br>`false`: process all the baseline requests no matter if any vulnerability is detected or not.<br>Default value: `false` |
|  | `skip_duplicated_baselines` | The parameter specifies FAST’s behavior when a duplicated baseline request has been encountered:<br>`true`: skip duplicated baseline requests (if there are a few identical baseline requests, then the test requests are generated for the first baseline request only).<br>`false`: the test requests are generated for each incoming baseline request.<br>Default value: `true` |
|  | `rps_per_baseline` | The parameter specifies a limit on the number of test requests (*RPS*, *requests per second*) to be sent to the target application (e.g. there might be 100 test requests derived from a single baseline request).<br>The limit is set per baseline request (no more than `N` test requests per second will be sent for an individual baseline request) in the test run.<br>Minimum value: `1`.<br>Maximum value: `500`.<br>Default value: `null` (RPS is unlimited) |
|  | `rps` | The parameter is similar to the one described above, except that it limits the RPS globally, per test run, not just a single baseline request.<br>In other words, the whole number of test requests per second should not exceed the specified value no matter how many baseline requests were recorded during the test run.<br>Minimum value: `1`.<br>Maximum value: `1000`.<br>Default value: `null` (RPS is unlimited) |
|  | `inactivity_timeout` | The parameter specifies the time interval in seconds during which the FAST node waits for a new baseline request to arrive.<br>This behavior is described [here][doc-inactivity-timeout] in detail.<br>The timeout has no influence on the processes of creation and execution of security tests for baseline requests that has been recorded.<br>Minimum value: `300` (300 seconds or 5 minutes).<br>Maximum value: `86400` (86400 seconds or 1 day).<br>Default value: `1800` (1800 seconds or 30 minutes) |

<!-- -->
<br><br>
**Example of a request:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
	"name":"demo-testrun"
}'
```

**Example of a response:**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "running",
    ...
}
```