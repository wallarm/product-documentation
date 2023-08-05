					=== "USクラウド"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IPリストのタイプ>","rule_type":"proxy_type","source_values":[<プロキシサービスの配列>],"pools":[<APP_IDの配列>],"expired_at":"<削除日時>","reason":"<リストにエントリーを追加する理由>"},"force":false}'
    ```
=== "EUクラウド"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IPリストのタイプ>","rule_type":"proxy_type","source_values":[<プロキシサービスの配列>],"pools":[<APP_IDの配列>],"expired_at":"<削除日時>","reason":"<リストにエントリーを追加する理由>"},"force":false}'
    ```
