[img-remove-point]:          ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:            ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:            ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:           ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:           ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:    ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:     ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:            ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:            ../../dsl/points/parsers.md

# ポイント処理ルールの設定

ポイントは、Wallarmアカウントのポリシーエディタの**挿入ポイント**セクションで構成されています。このセクションは2つのブロックに分かれています：

* 処理を許可したポイントの**リクエストに含める場所**
* 処理を許可していないポイントの**リクエストから除外する場所**

形成したポイントリストを追加するには、必要なブロックで**挿入ポイントを追加**ボタンを使います。

ポイントを削除するには、その隣にある「—」記号を使います：

![点を削除する][img-remove-point]

!!! info "基本的なポイント"
    ポリシーを作成するとき、典型的なポイントが自動的に**リクエストに含める場所**セクションに追加されます：

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URIの[path][link-path-point]
    * `ACTION_NAME`: [アクション][link-action-name-point]
    * `ACTION_EXT`: [拡張子][link-action-ext-point]
    * `GET_.*`: 全ての[GETパラメータ][link-get-point]
    * `POST_.*`: 全ての[POSTパラメータ][link-post-point]
    
    **リクエストから除外する場所**セクションのポイントリストはデフォルトで空です。

    同じポイントリストがデフォルトポリシーに設定されています。このポリシーは変更できません。

 
!!! info "ポイントの参照"
    ポイントを作成または編集するとき、ポイントに関する詳細な情報を取得するために**使い方**リンクをクリックできます。

    ![ポイント参照][img-point-help]

    FASTが処理できるポイントの完全なリストは[リンク][doc-point-list]から利用可能です。