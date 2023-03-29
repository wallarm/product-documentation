[link-cwe-about]: https://cwe.mitre.org/about/index.html

[img-scanner-settings]: ../../images/user-guides/scanner/configure-scanner.png
[img-scanner-modules]: ../../images/user-guides/scanner/modules-overview.png
[img-filter-modules]: ../../images/user-guides/scanner/filter-modules.png

# スキャナーモジュールの設定 <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

スキャナートグルの下にある*構成*リンクをクリックして、スキャナーを構成します。

![!スキャナー設定][img-scanner-settings]

## 脆弱性検出リストの設定

スキャナーは、特定のタイプの脆弱性を検出するためにそれぞれ責任を持つ複数のモジュールで構成されています。「スキャナーの構成」メニューでモジュールのフルリストが指定されています。

![!スキャナーモジュールの設定][img-scanner-modules]

### タグでモジュールをフィルタリング

タグでモジュールをフィルタリングすることができ、タグはタイプ別にグループ化されます：
*   脆弱性タイプ - リモートコード実行、パストラバーサル、クロスサイトスクリプティングなど、さまざまな脆弱性タイプのタグ。
*   脆弱性のあるテクノロジー - 脆弱性検出が起こる可能性のあるさまざまなテクノロジーやソフトウェアのタグ。
*   Common Vulnerabilities and Exposures（CVE）データベースに登録された脆弱性 - `CVE`タグが付いた脆弱性。

タグでスキャナーモジュールをフィルタリングするには、次の操作を行います：
1. *タグでフィルター*フィールドをクリックします。
2. 表示されるドロップダウンリストで、タグはタイプごとにグループ化されています。クリックして必要なタグを選択します。

    タグ名の横にあるチェックマークをクリックして、フィルタリングフィールドからタグを削除できます。

!!! info "複数のタグでフィルタリング"
    フィルタリングフィールドに複数のタグがある場合、結果は指定されたタグすべてでマークされたモジュールのみで構成されます。

タグでモジュールをフィルタリングした後、Wallarmインタフェースは、指定されたタグに対応するモジュールの総数と、[Common Weakness Enumeration（CWE）][link-cwe-about]の脆弱性クラスごとのフィルタリングされたモジュールの数を表示します。

*Modules found*ラベルの横のトグルをクリックすることで、すべてのフィルタリングされたモジュールを一度に無効にできます。

特定の脆弱性クラスに対応するフィルタリングされたモジュールも無効にすることができます。そのためには、必要なトグルをクリックしてください。

![!タグでスキャナーモジュールをフィルタリング][img-filter-modules]

### すべてのモジュールの無効化と有効化

フィルタリングフィールドでタグが選択されていない場合、*All modules*トグルをクリックしてすべてのモジュールを一度に無効化または有効化できます。

### 特定のクラスの脆弱性を検出するすべてのモジュールの無効化と有効化

左側の列では、すべてのモジュールが[CWE][link-cwe-about]に従ってグループ化されています。特定のクラスの脆弱性を検出するモジュールをすべて無効化または有効化するには、対応するトグルをクリックします。

### 個々のモジュールの無効化と有効化

右側の列では、すべてのモジュールがフィルタリングフィールドに従ってフィルタリングされています。ここでは、モジュールを個別に有効化および無効化できます。

### 脆弱性の再確認の無効化と有効化

アクティブな脆弱性チェック中に、スキャナーは以前に検出された脆弱性がまだ存在するかどうかを確認するためにテストを再起動します。

再確認後に以前に検出された脆弱性が見つからない場合、スキャナーはそれを解決済みとしてマークします。

*Recheck vulnerabilities*トグルを使用して、脆弱性の再確認を無効または有効にできます。

<!-- ## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/qJ1evgbDMLA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->