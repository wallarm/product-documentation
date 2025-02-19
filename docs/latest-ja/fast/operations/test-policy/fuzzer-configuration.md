```markdown
[img-enable-fuzzer]:            ../../../images/fast/operations/common/test-policy/fuzzer/fuzzer-slider.png
[img-manipulate-items]:         ../../../images/fast/operations/common/test-policy/fuzzer/manipulate-fuzzer-items.png
[img-anomaly-condition]:        ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-condition.png
[img-not-anomaly-condition]:    ../../../images/fast/operations/common/test-policy/fuzzer/not-anomaly-condition.png
[img-stop-condition]:           ../../../images/fast/operations/common/test-policy/fuzzer/stop-condition.png

[link-ruby-regexp]:             http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html      

[anchor-payloads-section]:      #the-payloads-section
[anchor-anomaly-section]:       #the-consider-result-an-anomaly-if-response-section
[anchor-not-anomaly-section]:   #the-consider-result-not-anomaly-if-response-section
[anchor-stop-section]:          #the-stop-fuzzing-if-response-section

# ファザー設定

!!! info "ファザーを有効にする"
    ファザーはデフォルトで無効になっています。Wallarmアカウントの**Fuzz testing**セクションで有効にできます:
    
    ![Enabling fuzzer][img-enable-fuzzer]

    ファザーのスイッチと**Attacks to test**セクションの**Use only custom DSL**スイッチは相互に排他的です。

    ポリシーはデフォルトでファザーをサポートしていません。

ファザーおよび異常検知に関連する設定は、Wallarmアカウントのポリシーエディタ内の**Fuzz testing**セクションに配置されています。

アプリケーションの異常をテストするために、FASTは異常バイトを含むペイロードを使用したリクエストに対するターゲットアプリケーションの応答を解析します。指定された条件に応じて、FASTから送信されたリクエストが異常と認識されるかどうかが決定されます。

Wallarmアカウントのポリシーエディタでは、以下の操作が可能です:

* ペイロードを追加するには、**Add payload**および**Add another payload**ボタンをクリックしてください
* ファザーの動作に影響を与える条件を追加するには、**Add condition**および**Add another condition**ボタンをクリックしてください
* 作成したペイロードおよび条件を削除するには、それらの近くにある«—»記号をクリックしてください

![Payload and condition management][img-manipulate-items]

条件を設定する際に、以下のパラメーターを使用できます:

* **Status**: HTTPSレスポンスコード
* **Length**: 応答の長さ（バイト単位）
* **Time**: 応答時間（秒単位）
* **Length diff**: FASTリクエストと元のベースラインリクエストの応答長の差（バイト単位）
* **Time diff**: FASTリクエストと元のベースラインリクエストの応答時間の差（秒単位）
* **DOM diff**: FASTリクエストと元のベースラインリクエストのDOM要素数の差
* **Body**: [Ruby regular expression][link-ruby-regexp]. 応答本文がこの正規表現に一致すれば条件が満たされます

[**Stop fuzzing if response**][anchor-stop-section]セクションでは、以下のパラメーターも設定できます:

* **Anomalies**: 検出された異常の数
* **Timeout errors**: サーバーから応答が得られなかった回数

これらのパラメーターを組み合わせることで、ファザーの動作に影響を与える必要な条件を設定することができます（以下参照）.

## 「Payloads」セクション

このセクションは、一つ以上のペイロードを設定するために使用します.

ペイロードが挿入される際に、以下のデータを指定します:

* ペイロードサイズを1～255バイトで指定します.
* ペイロードが挿入される位置：先頭、ランダム、または末尾のいずれかを指定します.

ペイロードが置換される際に、以下のデータを指定します:

* 置換方法: 値のランダムな部分を置換します。先頭の`M`バイト、末尾の`M`バイト、または全文字列のいずれかです.
* サイズ`M`を1～255バイトで指定します.

## 「Consider Result an Anomaly if Response」セクション

アプリケーションの応答が**Consider result an anomaly if response**セクションで設定されたすべての条件を満たす場合、異常が検出されたとみなされます.

**例:**

もし応答本文が`.*SQLITE_ERROR.*`正規表現に一致する場合、送信されたFASTリクエストが異常を引き起こしたとみなされます:

![Condition example][img-anomaly-condition]

!!! info "デフォルトの動作"
    このセクションで条件が設定されていない場合、ファザーはベースラインリクエストの応答と著しく異なるパラメーターを持つサーバーの応答を異常として検出します。例えば、サーバーの応答時間が長い場合は、サーバーの応答が異常である理由となりえます.

## 「Consider result not an anomaly if response」セクション

アプリケーションの応答が**Consider result not an anomaly if response**セクションで設定されたすべての条件を満たす場合、異常は検出されなかったとみなされます.

**例:**

もし応答コードが`500`未満の場合、送信されたFASTリクエストが異常を引き起こしていないとみなされます:

![Condition example][img-not-anomaly-condition]

## 「Stop fuzzing if response」セクション

アプリケーションの応答、検出された異常の数、またはタイムアウトエラーの数が**Stop fuzzing if response**セクションで設定されたすべての条件を満たす場合、ファザーは異常の探索を停止します.

**例:**

異常が2つ以上検出された場合、ファザーは停止します。各異常において、2以外の任意の数の単一の異常バイトが存在する可能性があります.

![Condition example][img-stop-condition]

!!! info "デフォルトの動作"
    ファザーの停止条件が設定されていない場合、ファザーは全255バイトをチェックします。異常が検出されると、ペイロード内の各個別バイトが停止されます.
```