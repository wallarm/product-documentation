| APIコール: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| 認証: | 必要 | トークンを使用 |
| トークン付きHTTPヘッダ: | `X-WallarmAPI-Token` | トークンの値をAPIサーバに渡すために使用 |
| パラメータ: | `name` **(必須)** | テスト実行の名前 |
|  | `test_record_name` | テストレコードの名前。すべてのベースラインリクエストはこのテストレコードに記録されます。<br>デフォルト値: テスト実行の名前 |
|  | `desc` | テスト実行の詳細な説明。<br>デフォルト値: 空の文字列 |
|  | `file_extensions_to_exclude` | テスト中に評価プロセスから除外する必要のある特定のファイルタイプを指定するためのパラメータ。これらのファイルタイプは正規表現で指定されます。<br>例えば、`ico`ファイル拡張子を除外するように設定すると、`GET /favicon.ico`のベースラインリクエストはFASTによってチェックされずスキップされます。<br>正規表現は次の形式を持ちます：<br>- `.`: 任意の数（ゼロまたはそれ以上）の任意の文字<br>- `x*`: `x`文字の任意の数（ゼロまたはそれ以上）<br>- `x?`: 単一の`x`文字（またはなし）<br>- 任意の単一のファイル拡張子（例えば、`jpg`）<br>- 垂直バー（例えば、`jpg` &#124; `png`）で区切られたいくつかの拡張子<br>デフォルト値: 空の文字列（FASTは任意のファイル拡張子を持つベースラインリクエストをチェックします） |
|  | `policy_id` | テストポリシーのID。<br>パラメータが欠けている場合は、デフォルトのポリシーが実行されます |
|  | `stop_on_first_fail` | 脆弱性が検出されたときのFASTの振る舞いを指定するパラメータ：<br>`true`: 初めて検出された脆弱性でテスト実行を停止。<br>`false`: 脆弱性が検出されたかどうかに関わらず、すべてのベースラインリクエストを処理。<br>デフォルト値: `false` |
|  | `skip_duplicated_baselines` | 重複したベースラインリクエストが見つかったときのFASTの振る舞いを指定するパラメータ：<br>`true`: 重複したベースラインリクエストをスキップ（同じベースラインリクエストが複数ある場合、テストリクエストは最初のベースラインリクエストのみに対して生成）。<br>`false`: 各入力ベースラインリクエストに対してテストリクエストを生成。<br>デフォルト値: `true` |
|  | `rps_per_baseline` | ターゲットアプリケーションに送信されるテストリクエストの数（*RPS*、*リクエスト/秒*）の制限を指定するパラメータ（例えば、1つのベースラインリクエストから100のテストリクエストが生成される場合）。<br>制限はベースラインリクエストごとに設定されます（テスト実行中に個々のベースラインリクエストに対して`N`回以上のテストリクエストが秒に送信されないこと）<br>最小値: `1`。<br>最大値: `500`。<br>デフォルトベリュー: `null` (RPSは無制限) |
|  | `rps` | 上で説明したものと同様のパラメータですが、このパラメータはRPSをテスト実行ごと、すなわち単一のベースラインリクエストではなく全体で制限します。<br>言い換えれば、テストリクエストの総数は、テスト実行中に記録されたベースラインリクエストの数に関係なく、指定された値を超えないようにするべきです。<br>最小値: `1`。<br>最大値: `1000`。<br>デフォルト値: `null` (RPSは無制限) |
|  | `inactivity_timeout` | 新しいベースラインリクエストが到着するまでFASTノードが待機する時間間隔（秒単位）を指定するパラメータ。<br>この振る舞いは[ここ][doc-inactivity-timeout]で詳しく説明されています。<br>タイムアウトは、記録されたベースラインリクエストのセキュリティテストの作成と実行のプロセスには影響しません。<br>最小値: `300`（300秒または5分）。<br>最大値: `86400`（86400秒または1日）。<br>デフォルト値: `1800`（1800秒または30分） |

**リクエストの例:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
	"name":"demo-testrun"
}'
```

**レスポンスの例:**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "running",
    ...
}
```