Postanalytics uses the in-memory storage Tarantool. The Tarantool database is used to keep in a circular buffer a local copy of the data stream processed by a filtering node, including request/response headers and request bodies (but not response bodies). 

The recommended value is 75% of the total server memory. However, there is a more accurate way to define the required value. To make a filtering node efficient, the database should keep at least 15 minutes of transmitted data with about 2x overhead for data serialization. Following these points, the amount of memory can be estimated by the formula:

```
Speed of request processing per minute in bytes * 15 * 2
```

For example, if a filtering node is handling at peak 50 MBps of end user requests, the required Tarantool database memory consumption can be estimated as the following:

```
50 MBps / 8 (bits in a byte) * 60 (seconds in a minute) * 15 * 2 = 11,250 MB (or ~ 11 GB)
```