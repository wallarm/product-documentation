# Tarantool troubleshooting

Sections below provide the information about frequent errors in Tarantool operation and their troubleshooting.

## How can I solve the "readahead limit reached" problem?

In the `/var/log/wallarm/tarantool.log` or `/opt/wallarm/var/log/wallarm/tarantool-out.log` file [depending on a node installation method](../admin-en/configure-logging.md), you may get errors like:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

This problem is not critical but too many such errors may decrease the service performance.

To solve the problem:

1. Access the `/usr/share/wallarm-tarantool/init.lua` folder → `box.cfg` file.
1. Set one of the following:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

The `readahead` parameter defines the size of the read-ahead buffer associated with a client connection. The larger the buffer, the more memory an active connection consumes and the more requests can be read from the operating system buffer in a single system call. See more details in the Tarantool [documentation](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead).

## How can I solve the "net_msg_max limit is reached" problem?

In the `/var/log/wallarm/tarantool.log` or `/opt/wallarm/var/log/wallarm/tarantool-out.log` file [depending on a node installation method](../admin-en/configure-logging.md), you may get errors like:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

To solve the problem, increase the value of `net_msg_max` (default value `768`):

1. Access the `/usr/share/wallarm-tarantool/init.lua` folder → `box.cfg` file.
1. Increase the `net_msg_max` value, for example:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

To prevent fiber overhead from affecting the whole system, the `net_msg_max` parameter restricts how many messages the fibers handle. See details on using `net_msg_max` in the Tarantool [documentation](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max).
