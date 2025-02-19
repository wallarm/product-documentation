* US CloudまたはEU Cloud向けWallarm Consoleにある**Administrator**ロールのアカウントにアクセスできること。
* オールインワンWallarmインストーラをダウンロードするために`https://meganode.wallarm.com`にアクセスできること。ファイアウォールでアクセスがブロックされていないことを確認してください。
* US Wallarm Cloudを操作するために`https://us1.api.wallarm.com`にアクセスするか、EU Wallarm Cloudを操作するために`https://api.wallarm.com`にアクセスできること。アクセスをプロキシサーバ経由でのみ設定できる場合は、[instructions][configure-proxy-balancer-instr]を使用してください。
* すべてのコマンドをスーパーユーザー（例：`root`）で実行できること。
* 攻撃検知ルールとAPI仕様の更新をダウンロードするため、またはホワイトリスト、ブラックリスト、グレイリストに登録された国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスにアクセスできること。

    --8<-- "../include/wallarm-cloud-ips.md"