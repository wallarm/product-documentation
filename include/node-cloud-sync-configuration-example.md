Example of the valid `node.yaml` contents:

{{ extra.var }}

```bash
hostname: example-node-name
uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
secret: b827axxxxxxxxxxxcbe45c855c71389a2a5564920xxxxxxxxxxxxxxxxxxc4613260
{{ extra.var }}

api:
    host: api.wallarm.com
    port: 443
    ca_verify: true

syncnode:
    owner: root
    group: wallarm
    mode: 0640
```