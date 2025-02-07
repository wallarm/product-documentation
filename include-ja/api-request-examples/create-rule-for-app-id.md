=== "USクラウド"
```{.bash .wrapped-code}
curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"vpatch\",\"action\":[{\"point\":[\"instance\"],\"type\":\"equal\",\"value\":\"-1\"},{\"point\":[\"path\",0],\"type\":\"equal\",\"value\":\"my\"},{\"point\":[\"path\",1],\"type\":\"equal\",\"value\":\"api\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"point\":[[\"header\",\"HOST\"]],\"attack_type\":\"any\"}"
```
=== "EUクラウド"
```{.bash .wrapped-code}
curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"vpatch\",\"action\":[{\"point\":[\"instance\"],\"type\":\"equal\",\"value\":\"-1\"},{\"point\":[\"path\",0],\"type\":\"equal\",\"value\":\"my\"},{\"point\":[\"path\",1],\"type\":\"equal\",\"value\":\"api\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"point\":[[\"header\",\"HOST\"]],\"attack_type\":\"any\"}"
```