# Wallarm Cloudがダウンしています

Wallarm Cloudがダウン中の場合でも、Wallarmノードは一部制限はありますが攻撃軽減を継続します。詳細については、このトラブルシューティングガイドをご参照ください。

## Wallarm Cloudがダウン中の場合のWallarmノードの動作はどのようになりますか？

Wallarm Cloudは非常に安定しており、拡張性のあるサービスです。さらに、御社のアカウントデータはすべて[バックアップ](#how-does-wallarm-protect-its-cloud-data-from-loss)により保護されています。

しかし、稀なケースですが、Wallarm Cloudが一時的に停止した場合（メンテナンスのための一時停止など）、一部制限はありますが、Wallarmノードは動作を継続します。

!!! info "Wallarm Cloud状態の確認"
    Wallarm Cloudの状態を確認するには、[status.wallarm.com](https://status.wallarm.com/)をご覧ください。最新情報を受け取るには、通知の購読を行ってください。

継続して動作する機能:

* 最後にCloudとノード間で正常に[同期](../admin-en/configure-cloud-node-synchronization-en.md)された際にノードにアップロードされたルールを使用して、設定された[モード](../admin-en/configure-wallarm-mode.md#available-filtration-modes)でのトラフィック処理。ノードには、Cloudからスケジュールに従ってアップロードされ、ローカルに保存されている、以下の要素の最新バージョンが存在するため動作を継続できます:
    * [カスタムルールセット](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)
* [IPリスト](../user-guides/ip-lists/overview.md)もノードにアップロードされ、保存されます。アップロードされたアドレスは、期限日時まで引き続き処理されます。

    これらの日時は、Cloudが復旧し同期が行われるまで更新されず、Cloudの復旧／同期が行われるまで新規追加や削除はありません。

    一部のIPアドレスのリストの期限切れは、これらのアドレスに関連する[ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)に対する保護の停止につながります。

動作が停止する機能:

* ノードは検出された攻撃や脆弱性に関するデータを収集しますが、Cloudに送信することができません。ノードの[postanalytics module](../admin-en/installation-postanalytics-en.md)には、Cloudに送信する前に一時的にデータを保存するメモリ内ストレージ（Tarantool）が存在します。Cloudが復旧次第、バッファ内のデータが送信されます。

    !!! warning "ノードのメモリ内ストレージの制限"
        バッファのサイズは[制限](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool)されており、制限を超えると古いデータが削除されます。そのため、Cloudがダウンしていた時間とその間に収集された情報量により、Cloud復旧後にWallarm Consoleで取得できるデータが一部になる場合があります。

* ノードは処理されたトラフィックに関する[メトリクス](../admin-en/configure-statistics-service.md)を収集しますが、Cloudに送信できません。
* [公開資産](../user-guides/scanner.md)や[一般的な脆弱性](../user-guides/vulnerabilities.md)のスキャンが停止します。
* [トリガー](../user-guides/triggers/triggers.md)が停止し、その結果:
    * [IPリスト](../user-guides/ip-lists/overview.md)の更新が停止します。
    * [トリガーによる通知](../user-guides/triggers/triggers.md)が表示されなくなります。
* [APIインベントリの検出](../api-discovery/overview.md)が動作しません。
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)が停止します。
* [ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)が検出されません。
* 統合機能が停止し、以下を含みます:
    * 即時およびメールでの[通知](../user-guides/settings/integrations/integrations-intro.md)が表示されなくなります。
    * レポート作成が停止します。
* Wallarm Consoleへのアクセスができません。
* [Wallarm API](../api/overview.md)が応答しません。

なお、上記の完全な停止状態に加え、特定のサービスのみが一時的にアクセスできなくなり、その他は引き続き機能する場合もあります。このような場合、[status.wallarm.com](https://status.wallarm.com/)サービスに該当情報が提供されます。

## Cloud復旧後はどうなりますか？

Cloud復旧後:

* Wallarm Consoleへのアクセスが回復します。
* ノードはバッファに蓄積された情報をCloudに送信します（上記の制限を考慮してください）。
* トリガーは新しいデータに反応し、通知を送信しIPを更新します。
* IPに変更があった場合、次回の同期時にノードへ送信されます。
* [未完了のカスタムルールセット](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down)があった場合、再起動されます。
* Cloudとフィルタリングノードは通常通りスケジュールに従って同期を行います。

## Wallarm Cloudがダウンする前に、Wallarm Consoleに設定が保存されなかったケースはありますか？

はい、その可能性はございます。例えば、[同期](../admin-en/configure-cloud-node-synchronization-en.md)間隔が3分であり、以下の状況を考えます:

1. カスタムルールセットの最後のビルドがCloudで21分前に完了し、20分前にノードへアップロードされました。
2. 次の6回の同期では新たなデータがなかったため、Cloudからは何も取得されませんでした。
3. その後、Cloud上でルールが変更され、新しいビルドが開始されました―ビルド完了までに4分必要でしたが、2分後にCloudがダウンしました。
4. ノードは完了したビルドのみを取得するため、2分間の同期ではノードにアップロードされるデータはありません。
5. さらに1分後、ノードは新たな同期要求を送信しますが、Cloudは応答しません。
6. ノードは24分経過したカスタムルールセットに基づいてフィルタリングを継続し、Cloudがダウンしている間、この時間は増加していきます。

## WallarmはCloudのデータ損失からどのように保護しますか？

Wallarm Cloudは、Wallarm Consoleでユーザーにより提供され、ノードからアップロードされた**すべてのデータ**を保存します。前述の通り、Wallarm Cloudが一時的にダウンするのは極めて稀なケースです。しかし、万が一そのような事態が発生した場合でも、保存されたデータに影響が及ぶ可能性は非常に低いです。つまり、復旧後すぐにすべてのデータを用いて業務を継続することができます。

ハードドライブが破壊され、Wallarm Cloudの実際のデータが失われるという低い確率に対処するため、Wallarmは自動的にバックアップを作成し、必要に応じてそこから復元します:

* RPO: バックアップは24時間ごとに作成されます
* RTO: システムは48時間以内に再び利用可能になります
* 直近14件のバックアップが保存されます

!!! info "RPO／RTO保護および可用性パラメーター"
    * **RPO (recovery point objective)** はデータバックアップの頻度を決定するために使用され、データ損失が許される最大時間を定義します。
    * **RTO (recovery time objective)** は災害発生後、業務を受け入れ可能なサービスレベルで復旧させるために必要な実時間を示します。

Wallarmのディザスタリカバリ( DR )プランおよび御社におけるその特性についての詳細は、[Wallarm support](mailto:support@wallarm.com)までご連絡ください。