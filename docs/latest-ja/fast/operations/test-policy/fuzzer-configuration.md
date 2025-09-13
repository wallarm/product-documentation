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

# Fuzzerの設定

!!! info "fuzzerの有効化"
    fuzzerはデフォルトで無効です。WallarmアカウントのポリシーエディタのFuzz testingセクションで有効化できます:
    
    ![fuzzerの有効化][img-enable-fuzzer]

    fuzzerのスイッチと、Attacks to testセクションにあるUse only custom DSLスイッチは相互排他です。

    ポリシーはデフォルトではfuzzerをサポートしません。

fuzzerおよび異常検知に関する設定は、ポリシーエディタのFuzz testingセクションにあります。

アプリケーションの異常を検査するために、FASTは異常バイトを含むペイロードを持つリクエストに対する対象アプリケーションのレスポンスを解析します。指定した条件に応じて、FASTが送信したリクエストが異常とみなされるかどうかが判定されます。

Wallarmアカウントのポリシーエディタでは次の操作が可能です:

* Add payloadおよびAdd another payloadボタンをクリックしてペイロードを追加できます
* Add conditionおよびAdd another conditionボタンをクリックして、fuzzerの動作に影響する条件を追加できます
* それらの近くにある«—»記号をクリックして、作成済みのペイロードと条件を削除できます

![ペイロードと条件の管理][img-manipulate-items]

条件を設定する際には、次のパラメータを使用できます:

* **Status**: HTTPSレスポンスコード
* **Length**: レスポンス長（バイト）
* **Time**: レスポンス時間（秒）
* **Length diff**: FASTリクエストと元のベースラインリクエストに対するレスポンス長の差（バイト）
* **Time diff**: FASTリクエストと元のベースラインリクエストに対するレスポンス時間の差（秒）
* **DOM diff**: FASTリクエストと元のベースラインリクエストでのDOM要素数の差
* **Body**: [Ruby正規表現][link-ruby-regexp]。レスポンスボディがこの正規表現に一致した場合に条件が満たされます

[**Stop fuzzing if response**][anchor-stop-section]セクションでは、次のパラメータも設定できます:

* **Anomalies**: 検出された異常の数
* **Timeout errors**: サーバーからレスポンスが受信できなかった回数

これらのパラメータを組み合わせて、fuzzerの動作に影響する必要な条件を設定できます（以下を参照）。

## 「Payloads」セクション {#the-payloads-section}

このセクションでは1つ以上のペイロードを設定します。

ペイロードを挿入する場合は、次のデータを指定します:

* サイズを1〜255バイト
* ペイロードを挿入する位置: 先頭、ランダム、または末尾

ペイロードを置換する場合は、次のデータを指定します:

* 置換方法: 値内のランダムなセグメントの置換、先頭の`M`バイト、末尾の`M`バイト、または文字列全体
* サイズ`M`は1〜255バイト

## 「Consider Result an Anomaly if Response」セクション {#the-consider-result-an-anomaly-if-response-section}

アプリケーションからのレスポンスが「Consider result an anomaly if response」セクションで設定したすべての条件を満たす場合、異常が見つかったと見なされます。

**例:**

レスポンスボディが正規表現`.*SQLITE_ERROR.*`に一致する場合、送信したFASTリクエストが異常を引き起こしたと見なします:

![条件の例][img-anomaly-condition]

!!! info "デフォルトの動作"
    このセクションに条件が設定されていない場合、fuzzerはベースラインリクエストへのレスポンスと比較してパラメータが異常に異なるサーバーレスポンスを検出します。例えば、サーバーレスポンス時間が長いことが、サーバーレスポンスを異常と検出する理由になり得ます。

## 「Consider result not an anomaly if response」セクション {#the-consider-result-not-an-anomaly-if-response-section}

アプリケーションからのレスポンスが「Consider result not an anomaly if response」セクションで設定したすべての条件を満たす場合、異常は見つからなかったと見なされます。

**例:**

レスポンスコードが`500`未満であれば、送信したFASTリクエストは異常を引き起こしていないと見なします:

![条件の例][img-not-anomaly-condition]

## 「Stop fuzzing if response」セクション {#the-stop-fuzzing-if-response-section}

アプリケーションのレスポンス、検出された異常の数、またはタイムアウトエラーの回数が「Stop fuzzing if response」セクションで設定したすべての条件を満たした場合、fuzzerは異常の探索を停止します。

**例:**

2件を超える異常が検出された場合、ファジングは停止します。各異常における単一の異常バイトの個数は2でない任意の数で構いません。

![条件の例][img-stop-condition]

!!! info "デフォルトの動作"
    ファジングを停止する条件が設定されていない場合、fuzzerは255個すべての異常バイトをチェックします。異常が検出された場合、ペイロード内の各バイトを個別に停止します。