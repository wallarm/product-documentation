# Exporting Malicious Hits to MinIO

[MinIO](https://www.min.io/) is a high-performance, S3-compatible object storage system. It is commonly used for data archiving, backups, and application data storage where full control and scalability are required. You can set up Wallarm to send files with the information about detected hits to a MinIO S3-compatible bucket. Information will be sent in the files of JSON format each 10 minutes.

## Data format

Every 10 minutes, Wallarm exports data on detected [hits](../../../about-wallarm/protecting-against-attacks.md#hit) to a MinIO S3-compatible bucket. A **hit** is a serialized malicious request that includes the original request and metadata added by the Wallarm node.

Files are saved in JSON format using the naming convention `wallarm_hits_{timestamp}.json`.

Data fields for each hit:

* `time` - date and time of hit detection in the Unix Timestamp format
* `request_id`
* `ip` - attacker's IP
* Hit source type: `datacenter`, `tor`, `remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload` 
* `point`
* `tags`

## Setting up integration

To set up a MinIO S3-compatible bucket integration:

1. Create a MinIO S3-compatible bucket for Wallarm using either [MinIO Console](https://docs.min.io/enterprise/aistor-object-store/administration/console/managing-objects/#buckets) or [MinIO Client (mc)](https://docs.min.io/enterprise/aistor-object-store/reference/cli/mc-mb/).
1. Proceed to Wallarm Console UI → **Integrations** → **MinIO** block or click the **Add integration** button and choose **MinIO**.
1. Enter an integration name.
1. Specify the MinIO API endpoint.
1. Specify the created MinIO S3-compatible bucket name.
1. Specify the data for Wallarm request authentication:

    * Access key
    * Secret key
1. Make sure in the **Regular notifications** section, hits in the last 10 minutes are selected to be sent. If not chosen, data will not be sent to the bucket.
1. Click **Test integration** to check configuration correctness, availability of the integrated system, and the notification format.

    Here is the example of the JSON file with the data on hits detected in the last 10 minutes:

    ```json
    [
    {
        "time":"1687241470",
        "request_id":"d2a900a6efac7a7c893a00903205071a",
        "ip":"127.0.0.1",
        "datacenter":"unknown",
        "tor":"none",
        "remote_country":null,
        "application_id":[
            -1
        ],
        "domain":"localhost",
        "method":"GET",
        "uri":"/etc/passwd",
        "protocol":"none",
        "status_code":499,
        "attack_type":"ptrav",
        "block_status":"monitored",
        "payload":[
            "/etc/passwd"
        ],
        "point":[
            "uri"
        ],
        "tags":{
            "lom_id":7,
            "libproton_version":"4.4.11",
            "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
            "wallarm_mode":"monitoring",
            "final_wallarm_mode":"monitoring"
        }
    },
    {
        "time":"1687241475",
        "request_id":"b457fccec9c66cdb07eab7228b34eca6",
        "ip":"127.0.0.1",
        "datacenter":"unknown",
        "tor":"none",
        "remote_country":null,
        "application_id":[
            -1
        ],
        "domain":"localhost",
        "method":"GET",
        "uri":"/etc/passwd",
        "protocol":"none",
        "status_code":499,
        "attack_type":"ptrav",
        "block_status":"monitored",
        "payload":[
            "/etc/passwd"
        ],
        "point":[
            "uri"
        ],
        "tags":{
            "lom_id":7,
            "libproton_version":"4.4.11",
            "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
            "wallarm_mode":"monitoring",
            "final_wallarm_mode":"monitoring"
        }
    }
    ]
    ```
1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
