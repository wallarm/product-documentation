[img-enable-fuzzer]:            ../../../images/fast/operations/common/test-policy/fuzzer/fuzzer-slider.png
[img-manipulate-items]:         ../../../images/fast/operations/common/test-policy/fuzzer/manipulate-fuzzer-items.png
[img-anomaly-condition]:        ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-condition.png
[img-not-anomaly-condition]:    ../../../images/fast/operations/common/test-policy/fuzzer/not-anomaly-condition.png
[img-stop-condition]:           ../../../images/fast/operations/common/test-policy/fuzzer/stop-condition.png

[link-ruby-regexp]:             http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html      

[anchor-payloads-section]:      #the-payloads-section
[anchor-anomaly-section]:       #the-consider-result-an-anomaly-if-response-section
[anchor-not-anomaly-section]:   #the-consider-result-not-an-anomaly-if-response-section
[anchor-stop-section]:          #the-stop-fuzzing-if-response-section

# Fuzzer設定

!!! info "Fuzzerを有効にする"
    デフォルトでは、Fuzzerは無効です。 Wallarmアカウントのポリシーエディタの**Fuzzテスト**セクションで有効にできます。
    
    ![!Fuzzerを有効にする][img-enable-fuzzer]

    Fuzzerスイッチと**カスタムDSLのみを使用する**スイッチは**テストを攻撃**セクションで相互に排他的です。

    デフォルトでは、ポリシーはFuzzerをサポートしていません。

Fuzzerと異常検出に関連する設定は、ポリシーエディタの**Fuzzテスト**セクションに配置されます。

異常をテストするために、FASTはターゲットアプリケーションが異常バイトを含むペイロードリクエストの応答を分析します。 指定された条件に応じて、FASTによって送信されたリクエストは異常として認識されますのでないか。

Wallarmアカウントのポリシーエディタを使用して次の操作を行うことができます。

* **ペイロードを追加**ボタンと**別のペイロードを追加**ボタンをクリックしてペイロードを追加
* **条件を追加**ボタンと**別の条件を追加**ボタンをクリックして、Fuzzer操作に影響を与える条件を追加
* 「—」シンボルをクリックして作成したペイロードと条件を削除

![!ペイロードおよび条件管理][img-manipulate-items]

条件設定する際、以下のパラメータを使用することができます。

* **ステータス**： HTTPS応答コード
* **長さ**：バイト単位の応答長
* **時間**：秒単位の応答時間
* **長さ diff**：FASTとオリジナルの基準リクエストへの応答の長さの差（バイト）
* **時間diff**：FASTとオリジナルの基準リクエストへの応答時間の差（秒）
* **DOM diff**：FASTとオリジナルの基準リクエストのDOM要素の数の差
* **ボディ**：[Rubyの正規表現][link-ruby-regexp]。応答ボディがこの正規表現を満たす場合、条件が満たされます。

[**応答した場合にFuzzingを停止する**][anchor-stop-section]セクションでは、以下のパラメータも設定可能です。

* **異常**：検出された異常の数
* **タイムアウトエラー**：サーバーからの応答が受け取れなかった回数

これらのパラメータの組み合わせを使用して、Fuzzer操作に影響を与える必要な条件を設定することができます（下記参照）。

## "Payloads"セクション

このセクションは1つ以上のペイロードを設定するために使用します。

ペイロードが挿入される間、次のデータが指定されます：

* 1から255バイトの負荷サイズ
* ペイロードが挿入される値：始まり、ランダム、または終わり位置

ペイロードが置換される間、次のデータが指定されます：

* 置換方法：値のランダムなセグメントを置換 - 最初の`M`バイト、最後の`M`バイト、または全文字列
* 負荷サイズ`M`は1から255バイトです。

## "応答すると結果は異常と見なす"セクション

アプリケーションからの応答が**応答すると結果は異常と見なす**セクションで設定されたすべての条件を満たす場合、異常が発見されたと見なされます。

**例：**

応答の本文が`.*SQLITE_ERROR.*`正規表現に合致する場合、FASTリクエストが異常を引き起こしたと見なします。

![!条件例][img-anomaly-condition]

!!! info "デフォルトの動作"
    このセクションでは条件が設定されていない場合、Fuzzerは基準リクエストへの応答とあまりにも異なるパラメータでサーバーの応答を検出します。例えば、サーバーの応答時間が長いため、サーバーの応答が異常として検出される可能性があります。

## "応答すると結果は異常と見なさない"セクション

アプリケーションからの応答が**応答すると結果は異常と見なさない**セクションで設定されたすべての条件を満たす場合、異常が発見されていないと考えられます。

**例：**

応答コードが`500`未満なら、FASTリクエストが異常を引き起こしていないと見なします。

![!条件例][img-not-anomaly-condition]

## "応答するとFuzzingを停止"セクション

アプリケーションの応答、検出された異常の数、またはタイムアウトエラーの数が**応答するとFuzzingを停止**セクションで設定された全条件を満たした場合、Fuzzerは異常を探すのを停止します。

**例：**

2つ以上の異常が検出された場合、Fuzzingを停止します。各異常では、2と等しくない任意の個数の単一異常バイトを持つことができます。

![!条件例][img-stop-condition]

!!! info "デフォルトの動作"
    Fuzzingプロセスを停止する条件が設定されていない場合、Fuzzerは255の異常バイトすべてをチェックします。異常が検出された場合、ペイロードの各個々のバイトで停止します。