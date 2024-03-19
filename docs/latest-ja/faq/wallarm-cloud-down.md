# Wallarmクラウドがダウンしています

Wallarmクラウドがダウンしている場合でも、Wallarmノードは一部の制限付きで攻撃の緩和を続けます。詳細については、このトラブルシューティングガイドをご利用ください。

## Wallarmクラウドがダウンしている場合、Wallarmノードはどのように動作しますか？

Wallarmクラウドは非常に安定したスケーラブルなサービスです。さらに、すべての企業のアカウントデータは、[バックアップ](#how-does-wallarm-protect-its-cloud-data-from-loss)によって保護されています。

しかし、稀にWallarmクラウドが一時的にダウンする（例えば、メンテナンスのために一時停止する）場合でも、Wallarmノードは一部の制限付きで動作を続けます。

!!! info "Wallarmクラウドのステータスを確認する"
    Wallarmクラウドのステータスを確認するには、[status.wallarm.com](https://status.wallarm.com/)をご覧ください。最新の情報を得るために、更新情報の購読をお勧めします。

継続して動作するもの:

* 設定された[モード](../admin-en/configure-wallarm-mode.md#available-filtration-modes)でのトラフィック処理は、クラウドとノード間の最後に成功した[同期](../admin-en/configure-cloud-node-synchronization-en.md)中にノードにアップロードされたルールを使用して行います。ノードは、以下の要素の最新バージョンがスケジュールに従ってクラウドからアップロードされ、ノード内にローカルに保存されるため、動作を続けることができます。

    * [カスタムルールセット](../user-guides/rules/rules.md)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* [IPリスト](../user-guides/ip-lists/overview.md)もノードにアップロードされ、ノード内に保存されます。アップロードされたアドレスは引き続き処理されますが、有効期限が来るまでです。

    これらの日付/時間は、クラウドが復旧し同期されるまで更新されず、新たに追加/削除されたアドレスはクラウドの復旧/同期まで存在しません。

    なお、IPリスト内の一部のIPアドレスの有効期限が切れると、これらのアドレスに関連した[ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)からの保護が停止します。

動作を停止するもの:

* ノードは検出した攻撃と脆弱性のデータを収集しますが、クラウドに送信できません。なお、ノードの[postanalyticsモジュール](../admin-en/installation-postanalytics-en.md)には、インメモリストレージ(Tarantool)があり、クラウドに送信する前に収集したデータが一時的に保存されます。クラウドが復旧すると、バッファに保存されたデータがクラウドに送信されます。

    !!! warning "ノードのインメモリストレージの制限"
        バッファのサイズは[制限](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool)されており、制限を超えると古いデータは削除されます。したがって、クラウドがダウンしていた期間とその期間中に収集された情報の量が、クラウドの復旧後にWallarmコンソールで一部のデータしか取得できない状況を引き起こす可能性があります。

* ノードは処理したトラフィックの[指標](../admin-en/monitoring/intro.md)を収集しますが、クラウドに送信できません。
* [公開資産](../user-guides/scanner.md)および[典型的な脆弱性](../user-guides/vulnerabilities.md)のスキャンが停止します。
* [トリガー](../user-guides/triggers/triggers.md)が停止し、以下のことが停止します：
    * [IPリスト](../user-guides/ip-lists/overview.md)の更新が停止します。
    * [トリガーベースの通知](../user-guides/triggers/triggers.md)は表示されません。
* [APIインベントリの検出](../api-discovery/overview.md)は動作しません。
* [アクティブな脅威の検証](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)が停止します。
* [ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)の検出は停止します。
* インテグレーションが停止し、以下のことが停止します：
    * インスタントおよびメールの[通知](../user-guides/settings/integrations/integrations-intro.md)は表示されません。
    * レポートの作成が停止します。
* Wallarmコンソールへのアクセスが制限されます。
* [Wallarm API](../api/overview.md)は応答しません。

なお、上記で述べた全体的なダウン状態の他に、一部のサービスのみが一時的に利用できない場合があり、その他のサービスは動作を続けます。この場合、[status.wallarm.com](https://status.wallarm.com/)サービスが対応する情報を提供します。

## クラウドの復旧後はどうなりますか？

クラウドの復旧後には以下のようになります：

* Wallarmコンソールへのアクセスが復旧します。
* ノードはバッファされた情報をクラウドに送信します（上記の制限を考慮してください）。
* トリガーが新しいデータに反応し、通知を送信し、IPを更新します。
* IPの変更があった場合、それらは次の同期時にノードに送信されます。
* [未完のカスタムルールセット](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down)のビルドがあった場合、それは再開されます。
* クラウドとフィルタリングノードは、通常通りスケジュールに従って同期します。

## Wallarmクラウドがダウンする前に、ノードがWallarmコンソールで保存した設定を取得しなかったケースはありますか？

はい、それは可能です。たとえば、[同期](../admin-en/configure-cloud-node-synchronization-en.md)間隔が3分であるとして次のような状況が考えられます。

1. カスタムルールセットの最後のビルドはクラウドで21分前に完了し、それは20分前にノードにアップロードされました。
2. 次の6回の同期では、新しいものがなかったため、クラウドから何も取得されませんでした。
3. その後、クラウド上でルールが変更され、新しいビルドが開始しました - ビルドは完了するのに4分必要でしたが、2分後にクラウドがダウンしました。
4. ノードは完了したビルドだけを取得するので、2分間の同期ではノードにアップロードするためのものは何も得られません。
5. さらに1分後、ノードは新たな同期リクエストを行いますが、クラウドは応答しません。
6. ノードは24分前のカスタムルールセットに基づいてフィルタリングを続け、この時間はクラウドがダウンしている間増え続けます。

## Wallarmはどのようにしてクラウドデータの紛失から保護していますか？

Wallarmクラウドは、Wallarmコンソールでユーザーが提供した**全てのデータ**とノードからアップロードしたデータを保存します。上述したとおり、Wallarmクラウドが一時的にダウンすることは非常に稀です。しかし、これが起こった場合でも、ダウン状態が保存データに影響を与える可能性は非常に低いです。つまり、復旧後はすぐに全てのデータを使用して作業を再開できます。

Wallarmクラウドの実害データを格納しているハードドライブが破壊されるという低い可能性に対処するために、Wallarmは自動的にバックアップを作成し、必要に応じてそれらから復元します：

* RPO: バックアップは24時間ごとに作成されます
* RTO: システムは最大48時間以内に再度利用可能になります
* 最新の14バックアップが保存されています

!!! info "RPO/RTOの保護と利用可能性のパラメータ"
    * **RPO（recovery point objective）**はデータバックアップの頻度を決定するために使用されます：データが失われる可能性のある最大の時間を定義します。
    * **RTO（recovery time objective）**はビジネスが災害後にそのプロセスを許容可能なサービスレベルで復元するための実時間で、中断に関連する許容できない結果を避けるためのものです。

Wallarmのディザスタリカバリ(DR)計画とそれがご自身の企業にどのように適用されるかについての詳細は、[Wallarmサポートまでお問い合わせください](mailto:support@wallarm.com)。
