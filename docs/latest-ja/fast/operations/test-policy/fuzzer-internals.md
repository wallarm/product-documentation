[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Fuzzerの動作原理

fuzzerは`0x01`から`0xFF`までの255個の*異常バイト*をチェックします。このようなバイトを1つ以上リクエストのポイントに挿入すると、対象アプリケーションが異常動作を示す可能性があります。

各バイトを個別に確認する代わりに、fuzzerは固定長の異常バイトのシーケンス（*ペイロード*）を1つ以上ポイントに追加し、そのリクエストをアプリケーションに送信します。

許可されたポイントを変更するために、fuzzerは次の処理を行います:

* ペイロードを挿入します:

    * 値の先頭
    * 値のランダムな位置
    * 値の末尾
* ペイロードで次のように値を置換します:

    * ランダムなセグメント
    * 先頭の`M`バイト
    * 末尾の`M`バイト
    * 文字列全体

[fuzzerの設定][doc-fuzzer-configuration]では、FASTからアプリケーションへ送信するリクエストに含めるペイロードのサイズ`M`をバイト数で指定します。これは次の点に影響します:

* ペイロードの挿入を使用する場合に、ポイントの値に追加されるバイト数
* ペイロードの置換を使用する場合に、ポイントの値で置換されるバイト数
* アプリケーションに送信されるリクエストの数

ペイロード付きリクエストに対するレスポンスで異常動作が検出された場合、fuzzerは各ペイロードバイトごとに個別のリクエストをアプリケーションへ送信します。こうして、異常動作を引き起こした特定のバイトを特定します。

![異常バイトのチェックの模式図][img-search-for-anomalies]

検出されたバイトはすべて、異常の説明に表示されます:

![異常の説明][img-anomaly-description]

??? info "Fuzzerの動作例"
    ペイロードサイズを250バイトとして、あるポイント値の先頭250バイトを[置換](fuzzer-configuration.md)するとします。

    この条件では、既知の異常バイトをすべて送信するために、fuzzerは250バイトのペイロードを用いるリクエストと5バイトのペイロードを用いるリクエストの2つを作成します。

    ベースラインリクエストの初期のポイント値は次のように変更されます:

    * 値が250バイトより長い場合: まず先頭250バイトが250バイトのペイロードで置換され、次に先頭250バイトが5バイトのペイロードで置換されます。
    * 値が250バイトより短い場合: まず値全体が250バイトのペイロードで置換され、その後、値全体が5バイトのペイロードで置換されます。

    仮に、5バイトの`ABCDE`というペイロードが、長いポイント値`_250-bytes-long-head_qwerty`の先頭250バイトを置換して異常を引き起こしたとします。言い換えると、ポイント値が`ABCDEqwerty`のテストリクエストが異常を引き起こしたということです。

    この場合、fuzzerは各バイトを確認するために、次のポイント値で5つの追加リクエストを作成します:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    このうち1つ以上のリクエストで再び異常が発生し、fuzzerは検出された異常バイトの一覧を作成します。例えば、`A`、`C`です。

次に、[ファジングの設定][doc-fuzzer-configuration]および異常が検出されたかどうかを判定するルールの説明を確認できます。

FASTのfuzzerは、1回のイテレーション（*ファジング*）につき1つの許可されたポイントを処理します。[ファジングの停止ルール][link-stop-fuzzing-section]に応じて、1つ以上のポイントが順次処理されます。