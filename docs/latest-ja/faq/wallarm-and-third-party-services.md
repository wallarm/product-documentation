# Wallarmプラットフォームとサードパーティサービスの相互作用

Wallarmプラットフォームとサードパーティサービスの相互作用中に何か問題が発生した場合、それらを解決するためのこのトラブルシューティングガイドをご覧ください。ここで関連する詳細を見つけられなかった場合は、どうか[Wallarm技術サポート](mailto:support@wallarm.com)までご連絡ください。

## Wallarmプラットフォームが対話するサードパーティサービスは何ですか？

Wallarmプラットフォームは以下のサードパーティサービスと相互作用します：

* 標準的なTarantoolインスタンスのデータをアップロードするためのTarantoolフィードバックサーバー (`https://feedback.tarantool.io`)。

    インメモリストレージTarantoolは、`wallarm-tarantool`パッケージからあなたのマシンにデプロイされたWallarmのpostanalyticsモジュールによって使用されます。 Tarantoolストレージは2つのインスタンス、カスタム（`wallarm-tarantool`）と標準（`tarantool`）としてデプロイされます。標準インスタンスはデフォルトでカスタムインスタンスと一緒にデプロイされ、Wallarmのコンポーネントには使用されません。

    WallarmはカスタムTarantoolインスタンスのみを使用し、`https://feedback.tarantool.io`へデータを送信しません。ただし、デフォルトのインスタンスは、1時間に1回、Tarantoolフィードバックサーバーにデータを送信することができます（[詳細](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)）。

## 標準的なTarantoolインスタンスのデータを`https://feedback.tarantool.io`に送信するのを無効にできますか？

はい、次のようにして標準的なTarantoolインスタンスのデータを`https://feedback.tarantool.io`に送信することを無効にできます：

* 標準的なTarantoolインスタンスを使用していない場合、それを無効にできます：

    ```bash
    systemctl stop tarantool
    ```
* 標準的なTarantoolインスタンスがあなたの問題に対処している場合、[`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled)パラメータを使用して、データを`https://feedback.tarantool.io`に送信するのを無効にできます。