[doc-inactivity-timeout]:           internals.md#test-run

| API call: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Authorization: | Required | Authorization is provided by the token |
| HTTP header with the token: | `X-WallarmAPI-Token` | Serves to pass the token’s value to the API server |
| Parameters: | `name` **(required)** | The name of the test run |
| | `test_record_id` **(required)** | The identifier of an existing test record |
|  | `desc` | Detailed description of the test run.<br>Default value: empty string |
|  | `file_extensions_to_exclude` | This parameter allows specifying certain file types that need to be excluded from the evaluation process during testing. These file types are specified by the regular expression.<br>For example, if you set the `ico` file extension to be excluded, then the `GET /favicon.ico` baseline request will not be checked by FAST and will be skipped.<br>The regular expression has the following format:<br>- `.`: any number (zero or more) of any character<br>- `x*`: any number (zero or more) of the `x` character<br>- `x?`: the single `x` character (or none)<br>- any single file extension (e.g., `jpg`)<br>- several extensions delimited by the vertical bar (e.g., `jpg` &#124; `png`)<br>Default value: empty string (FAST will check baseline requests with any file extension). | 
|  | `policy_id` | The identifier of the test policy.<br>If this parameter is missing, then the default policy takes action |
|  | `stop_on_first_fail` | This parameter specifies FAST’s behavior when a vulnerability is detected:<br>`true`: stops the execution of the test run at the first detected vulnerability.<br>`false`: processes all the baseline requests regardless of whether any vulnerability is detected.<br>Default value: `false` |
|  | `rps_per_baseline` | This parameter specifies a limit on the number of test requests (*RPS*, *requests per second*) to be sent to the target application (e.g., there might be 100 test requests derived from a single baseline request).<br>The limit is set per baseline request (no more than `N` test requests per second will be sent for an individual baseline request) in the test run.<br>Minimum value: `1`.<br>Maximum value: `500`.<br>Default value: `null` (RPS is unlimited) |
|  | `rps` | This parameter is similar to the one described above, except that it limits the RPS globally per test run, not just for a single baseline request.<br>In other words, the whole number of test requests per second should not exceed the specified value regardless of how many baseline requests were recorded during the test run.<br>Minimum value: `1`.<br>Maximum value: `1000`.<br>Default value: `null` (RPS is unlimited) |

**Example of a request:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
    "name":"demo-testrun",
    "test_record_id":"rec_0001"
}'
```

**Example of a response: test run copying is in progress**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "cloning",
    ...
    "test_record_id": "rec_0001",
    ...
}
```

The `cloning` state means that the baseline requests are being cloned from the original test run to its copy (the test run with the `tr_1234` identifier).  

**Example of a response: test run copying failed**

```
{
  "status": 400,
  "body": {
    "test_record_id": {
      "error": "not_ready_for_cloning",
      "value": "rec_0001"
    }
  }
}
```

The `not_ready_for_cloning` error means that it is not possible to clone baseline requests from the original test run to its copy because the recording process is active in the original test run (involving the test record with the `rec_0001` identifier).