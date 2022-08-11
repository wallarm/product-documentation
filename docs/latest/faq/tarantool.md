# Tarantool questions

Sections below are related to using Tarantool and solving some problems related to its usage.

## How can I solve the "readahead limit reached" problem?

In the `tarantool.log` file, you may get errors like:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

In the Tarantool version 1.9.2, this error is not critical. In the earlier versions, if there are too many such errors, there may be some problems with performance, but this is also not critical.

To solve the problem:

1. Access the `/usr/share/wallarm-tarantool/init.lua` folder → `box.cfg` file.
1. Set one of the following:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

## How can I solve the "net_msg_max limit is reached" problem?

In the `tarantool.log` file, you may get errors like:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

To solve the problem, increase the value of `net_msg_max` (default value `768`):

1. Access the `/usr/share/wallarm-tarantool/init.lua` folder → `box.cfg` file.
1. Increase value for `net_msg_max`, for example:
    ```
    box.cfg {
    net_msg_max = 6000
    }
    ```
