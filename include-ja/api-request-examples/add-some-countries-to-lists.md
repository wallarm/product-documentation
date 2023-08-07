					=== "USクラウド"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IPリストの種類>","rule_type":"country","source_values":[<国や地域の配列>],"pools":[<アプリIDの配列>],"expired_at":"<期限切れの日時>","reason":"<リストへのエントリ追加理由>"},"force":false}'
    ```
=== "EUクラウド"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IPリストの種類>","rule_type":"country","source_values":[<国や地域の配列>],"pools":[<アプリIDの配列>],"expired_at":"<期限切れの日時>","reason":"<リストへのエントリ追加理由>"},"force":false}'
    ```
