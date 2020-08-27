# Masking Sensitive Data

The Wallarm node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks.
* Wallarm system counters.
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure.

You can mask the data that the filter node sends to the Wallarm cloud. The pattern can be set up to mask the sensitive data even in malicious requests: `user_session`, `password`, `token`, etc.

To turn on and set up the data masking, contact [Wallarm support](mailto:support@wallarm.com).