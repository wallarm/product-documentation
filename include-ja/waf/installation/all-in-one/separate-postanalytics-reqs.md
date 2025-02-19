* Wallarm Consoleにおける[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用アカウントへアクセスするため、**Administrator**ロールが付与され、二要素認証が無効になっている必要があります  
* すべてのコマンドをスーパーユーザ（例:`root`）として実行します  
* all‑in‑one Wallarmインストーラをダウンロードするため、`https://meganode.wallarm.com`にアクセスしてください。ファイアウォールによってアクセスがブロックされていないことを確認します  
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`に、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`にアクセスしてください。アクセスをプロキシサーバ経由のみで構成できる場合は、[instructions][configure-proxy-balancer-instr]を使用してください  
* インストール済みのテキストエディタ、**vim**、**nano**、またはその他のエディタが必要です。本記事のコマンドでは**vim**を使用します