					# Wallarm Cloudがダウンしている

Wallarm Cloudがダウンしている場合でも、Wallarmノードはいくつかの制限を伴いながら攻撃の軽減を続けます。詳細については、このトラブルシューティングガイドを使ってください。

## Wallarm Cloudがダウンしている場合、Wallarmノードはどのように動作しますか？

Wallarm Cloudは非常に安定したスケーラブルなサービスです。また、すべての企業アカウントデータは[確定保存とバックアップ](#how-does-wallarm-protect-its-cloud-data-from-loss)によって保護されています。

しかし、稀なケースでWallarm Cloudが一時的にダウンすることがあります（例えば、メンテナンスのために一時停止する場合）、Wallarmノードはいくつかの制限を持ちながらも継続して動作します。

!!! info "Wallarm Cloudのステータスを確認する"
    Wallarm Cloudのステータスを確認するには、[status.wallarm.com](https://status.wallarm.com/)を訪問してください。最新情報を取得するには、登録してください。

続行して動作するもの：

* 設定された[モード](../admin-en/configure-wallarm-mode.md#available-filtration-modes)でトラフィックを処理し、Cloudとノード間の最後の成功した[同期](../admin-en/configure-cloud-node-synchronization-en.md)中にノードにアップロードされたルールを使用します。ノードは、以下の要素の最新バージョンがCloudからスケジュールに従ってアップロードされ、ノード内にローカルに保存されるため、引き続き動作できます。

    * [カスタムルールセット](../user-guides/rules/compiling.md)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* [IPリスト](../user-guides/ip-lists/overview.md)もノードにアップロードされ、ノード内に保存されます。アップロードされたアドレスは、有効期限が来るまで処理され続けます。

    これらの日付/時刻は、Cloudが復旧し同期されるまで更新されず、新しい/削除されたアドレスもCloudの復旧/同期までありません。

    一部のIPアドレスの有効期限が切れると、これらのアドレスに関連する[ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)からの保護が停止することに注意してください。

停止するもの：

* ノードは、検出された攻撃や脆弱性に関するデータを収集し、Cloudに送信することができません。ノードの[postanalyticsモジュール](../admin-en/installation-nginx-overview.md#modules-overview)は、インメモリストレージ（Tarantool）を持っており、Cloudに送信する前に一時的に収集データが保存されます。Cloudが復旧すると、バッファされたデータがCloudに送信されます。

    !!! warning "ノードのインメモリストレージの制限"
        バッファのサイズは[限定](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool)されており、超過すると古いデータが削除されます。そのため、Cloudがダウンしていた時間やその間に収集された情報の量によって、Cloudの復旧後にWallarm Consoleで一部のデータしか取得できなくなる場合があります。

* ノードは、処理されたトラフィックの[メトリクス](../admin-en/monitoring/intro.md)をCloudに送信することができません。
* 露出資産や一般的な脆弱性のための[スキャニング](../user-guides/scanner/intro.md)が停止します。
* [トリガー](../user-guides/triggers/triggers.md)が動作しなくなり、その結果として：
    * [IPリスト](../user-guides/ip-lists/overview.md)の更新が停止します。
    * [トリガーに基づく通知](../user-guides/triggers/triggers.md)が表示されません。
* [APIインベントリの検出](../about-wallarm/api-discovery.md)が動作しません。
* [アクティブな脅威の検証](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)が停止します。
* [ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)が検出されません。
* インテグレーションが停止し、その中には：
    * 即時およびEメール[通知](../user-guides/settings/integrations/integrations-intro.md)が表示されません。
    * レポートが停止します。
* Wallarm Consoleへのアクセスができません。
* [Wallarm API](../api/overview.md)が応答しません。

上記で説明した全体的なダウン状態以外にも、時々特定のサービスだけが一時的にアクセスできなくなることがありますが、他の機能は継続して動作します。このような場合、[status.wallarm.com](https://status.wallarm.com/)サービスが対応する情報を提供します。

## Cloud復旧後はどうなりますか？

Cloud復旧後：

* Wallarm Consoleへのアクセスが復元されます。
* ノードがバッファリングされた情報をCloudに送信します（上記の制限事項を考慮してください）。
* トリガーは新しいデータに反応して通知を送信し、IPを更新します。
* IPに変更があった場合、次の同期時にノードに送信されます。
* [未完了のカスタムルールセット](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down)のビルドがあった場合、それが再開されます。
* Cloudとフィルタリングノードは、通常どおりスケジュールで同期します。

## Wallarm Cloudがダウンする前に、ノードがWallarm Consoleで保存された設定を取得しないケースはありますか？

はい、それは可能です。例えば、[同期](../admin-en/configure-cloud-node-synchronization-en.md)間隔が3分であるとします。

1. カスタムルールセットの最後のビルドがCloudで21分前に終わり、20分前にノードにアップロードされました。
2. 次の6回の同期でCloudから何も取得されませんでした。
3. その後、Cloud上でルールが変更され、新しいビルドが開始されました。ビルドが終了するまでに4分かかりましたが、2分後にCloudがダウンしました。
4. ノードは完了したビルドだけを取るので、2分の同期ではノードにアップロードするものがありません。
5. もう1分経つと、ノードは新しい同期リクエストを持ってきますが、Cloudは応答しません。
6. ノードは、24分のカスタムルールセットを持つままフィルタリングを続け、Cloudがダウンしている間、この時間が伸び続けます。

## WallarmはどのようにしてCloudデータを喪失から保護していますか？

Wallarm Cloudは、Wallarm Consoleでユーザーが送信した**すべてのデータ**と、ノードからアップロードされたデータを保存します。上述のように、Wallarm Cloudが一時的にダウンすることは非常に珍しいケースです。しかし、これが起こった場合でも、保存されたデータに影響を与える可能性は非常に低いです。つまり、復旧後すぐにすべてのデータを持って作業を続けることができます。

Wallarm Cloudの現在のデータを保存しているハードドライブが破壊されることに対処するために、Wallarmは自動的にバックアップを作成し、必要に応じてそれらから復元します。

* RPO：バックアップは24時間ごとに作成されます
* RTO：システムは48時間以内に再び利用可能になります
* 最新の14バックアップが保存されます

!!! info "RPO/RTO保護および可用性パラメータ"
    * **RPO (recovery point objective / リカバリポイント目標）**は、データのバックアップ頻度を決定するために使用されます。データが失われる最大時間を定義します。
    * **RTO (recovery time objective / リカバリタイム目標）**は、事業が許容範囲内のサービスレベルでプロセスを復元するために、災害後に利用できる現実的な時間です。

Wallarmのディザスタリカバリ（DR）計画と、あなたの会社におけるそれらの特異性に関する詳細情報については、[Wallarmサポートにお問い合わせください](mailto:support@wallarm.com)。