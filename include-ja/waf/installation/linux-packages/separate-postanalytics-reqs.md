* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用Wallarm Consoleにおいて、**Administrator**ロールのアカウントにアクセス可能であり、二要素認証が無効になっている。
* SELinuxが無効化されているか、[手順][configure-selinux-instr]に従って構成されている。
* 全てのコマンドをスーパーユーザー（例:`root`）として実行する。
* パッケージをダウンロードするために`https://repo.wallarm.com`にアクセスできること。ファイアウォールによってアクセスがブロックされていないことを確認する。
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`にアクセスできること。アクセスがプロキシサーバー経由でのみ構成可能である場合は、[手順][configure-proxy-balancer-instr]を使用する。
* **vim**、**nano**、またはその他のテキストエディターがインストールされていること。このドキュメント中のコマンドでは**vim**を使用する。