[img-remove-point]:         ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:           ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# ポイント処理ルールの設定

ポイントはWallarmアカウントのポリシーエディタ内の**Insertion Points**セクションで設定できます。このセクションは以下の2つのブロックに分かれています:

* 処理が許可されたポイントを含むリクエスト内の場所
* 処理が許可されないポイントを含むリクエスト内の場所

形成済みのポイントのリストを追加するには、必要なブロック内で**Add insertion point**ボタンを使用します。

ポイントを削除するには、ポイントの隣にある«—»シンボルを使用します:

![ポイントの削除][img-remove-point]

!!! info "基本のポイント"
    ポリシー作成時、通常のポイントは自動的に**Insertion Points**セクションの処理が許可されたリクエスト内の場所に追加されます:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URIの任意の部分 [path][link-path-point]
    * `ACTION_NAME`: [action][link-action-name-point]
    * `ACTION_EXT`: [extension][link-action-ext-point]
    * `GET_.*`: 任意の [GET parameter][link-get-point]
    * `POST_.*`: 任意の [POST parameter][link-post-point]
    
    処理が許可されないリクエスト内の場所にあるポイントのリストはデフォルトで空です。

    同じポイントのリストがデフォルトポリシーにも設定されています。このポリシーは変更できません.

!!! info "ポイントの参照"
    ポイントの作成または編集時に、ポイントに関する追加情報を取得するために**How to use**リンクをクリックできます。

    ![ポイントの参照][img-point-help]

    FASTが処理できるポイントの完全なリストは[こちら][doc-point-list]でご確認いただけます.