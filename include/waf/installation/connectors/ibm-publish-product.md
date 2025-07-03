To apply changes to the traffic flow, re-publish the product that includes the modified API:

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```
