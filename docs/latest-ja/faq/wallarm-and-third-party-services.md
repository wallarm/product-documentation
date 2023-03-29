# Wallarmプラットフォームとサードパーティサービスのやり取り

Wallarmプラットフォームとサードパーティサービスのやり取り中に何らかの問題が発生した場合は、このトラブルシューティングガイドを確認して対処してください。ここで関連する詳細が見つからない場合は、[Wallarm技術サポート](mailto:support@wallarm.com)にお問い合わせください。

## Wallarmプラットフォームがどのサードパーティサービスとやり取りするか？

Wallarmプラットフォームは、以下のサードパーティサービスとやり取りします：

* [許可リスト、拒否リスト、またはグレーリスト](../user-guides/ip-lists/overview.md)に登録されている国、地域、データセンターのIPアドレスの実際のリストをダウンロードするためのGCPストレージ。

    Wallarmをインストールする前に、お使いのマシンが[GCPストレージIPアドレス](https://www.gstatic.com/ipranges/goog.json)にアクセスできることを確認することをお勧めします。
* 標準のTarantoolインスタンスデータをアップロードするためのTarantoolフィードバックサーバ(`https://feedback.tarantool.io`)。

    インメモリストレージTarantoolは、お使いのマシンにデプロイされたWallarmのpostanalyticsモジュールで使用されます。これは`wallarm-tarantool`パッケージからデプロイされます。Tarantoolストレージは、カスタム(`wallarm-tarantool`)と標準(`tarantool`)の2つのインスタンスとしてデプロイされます。標準インスタンスは、デフォルトでカスタムインスタンスとともにデプロイされ、Wallarmコンポーネントでは使用されません。

    Wallarmは、カスタムTarantoolインスタンスのみを使用し、`https://feedback.tarantool.io`にはデータを送信しません。ただし、デフォルトインスタンスは、Tarantoolフィードバックサーバーに1時間ごとにデータを送信することができます（[詳細](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)）。

## 標準Tarantoolインスタンスデータの送信を`https://feedback.tarantool.io`に無効にすることができますか？

はい、`https://feedback.tarantool.io`への標準Tarantoolインスタンスデータの送信を以下のように無効にすることができます：

* 標準的なTarantoolインスタンスを使用していない場合は、それを無効にできます：

    ```bash
    systemctl stop tarantool
    ```
* 標準Tarantoolインスタンスが問題に対処している場合は、パラメータ[`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled)を使用して、`https://feedback.tarantool.io`へのデータ送信を無効にできます。