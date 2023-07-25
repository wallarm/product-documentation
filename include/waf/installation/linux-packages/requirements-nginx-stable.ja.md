## 要件

* Wallarm Consoleで**管理者**役割を持つアカウントへのアクセス。[USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)
* [指示][configure-selinux-instr]に従ってSELinuxを無効化または設定
* NGINXバージョン1.24.0
  
    !!! info "カスタムNGINXバージョン"
        異なるバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の指示を参照してください
* 全てのコマンドをスーパーユーザーとして実行（例：`root`）
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* US Wallarm Cloudを利用するための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudを利用するための`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr]を使用してください
* [許可リスト、否認リスト、またはグレーリストに登録された][ip-lists-docs]国、地域、またはデータセンターに登録されたIPアドレスの現行リストをダウンロードするための[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* インストールされたテキストエディター**vim**、**nano**、またはそれ以外のもの。説明では**vim**を使用します