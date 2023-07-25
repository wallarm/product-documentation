# Wallarmノード4.4の新しい機能

Wallarmノードの新しいマイナーバージョンがリリースされました！ Wallarmノード4.4には、JWTの強度チェックやSQLi攻撃の二重検証など、攻撃の軽減をさらに強力で使いやすくする新機能があります。

## JSON Web Tokenの強度チェック

[JSON Web Token (JWT)](https://jwt.io/)はAPIなどのリソース間で安全にデータを交換するために使用される一般的な認証標準です。 JWTの妥協は、攻撃者の一般的な目標であり、認証メカニズムを破ることでWebアプリケーションやAPIへのフルアクセスが可能になります。 JWTが弱いほど、妥協の可能性が高くなります。

バージョン4.4から、Wallarmで次のようなJWTの弱さを検出できるようになります：

* 暗号化されていないJWT
* 妥協した秘密キーを使用して署名されたJWT

有効にするには、[**Weak JWT**トリガー](../user-guides/triggers/trigger-examples.ja.md#detect-weak-jwts)を使用してください。

## libdetectionライブラリを使用した攻撃分析の強化

Wallarmによって実行される攻撃分析は、追加の攻撃確認レイヤーを含むことによって強化されました。 Wallarmノード4.4以降は**libdetection**ライブラリがデフォルトで有効になっており、[SQLi](../attacks-vulns-list.ja.md#sql-injection)攻撃のすべてに対して完全に文法ベースの二次バリデーションを実行し、SQLインジェクションの検出される誤検出数を減らします。

!!! warning "メモリ消費の増加"
    **libdetection**ライブラリが有効になっている場合、NGINX/EnvoyおよびWallarmプロセスによって消費されるメモリ量が約10%増加する場合があります。

[Wallarmが攻撃を検出する方法の詳細 →](../about-wallarm/protecting-against-attacks.ja.md)

## サポートされているインストールオプション

* Ubuntu 22.04 LTS(jammy)のサポート追加
* WallarmをNGINX安定版またはNGINX Plusのモジュールとしてインストールする場合のDebian 10.x（buster）のサポートを廃止

[サポートされているインストールオプションの完全リスト →](../installation/supported-deployment-options.ja.md)

## 新しい攻撃タイプ

**リリース4.4.3から**、Wallarmは新しい攻撃タイプを検出します：

* [Mass Assignment](../attacks-vulns-list.ja.md#mass-assignment)

    Mass Assignment攻撃では、攻撃者はHTTPリクエストパラメータをプログラムコードの変数やオブジェクトにバインドしようとします。APIが脆弱でバインディングを許可している場合、攻撃者は暴露されることのない感受性の高いオブジェクトプロパティを変更でき、特権の昇格、セキュリティメカニズムのバイパスなどにつながる可能性があります。
* [SSRF](../attacks-vulns-list.ja.md#serverside-request-forgery-ssrf)

    SSRF攻撃が成功すると、攻撃者は攻撃されたWebサーバーの代わりにリクエストを行うことができ、Webアプリケーションの使用中のネットワークポートの公開、内部ネットワークのスキャン、および認証のバイパスにつながる可能性があります。

## 統計サービスのパラメータ

**リリース4.4.3から**、Wallarmの統計サービスは新しいパラメータ`custom_ruleset_ver`を返します。

このパラメータは、Wallarmノードが使用している[カスタムルールセット](../glossary-en.ja.md#custom-ruleset-the-former-term-is-lom)の形式を示しています。

[統計サービスに関する詳細 →](../admin-en/configure-statistics-service.ja.md)

## ノード3.6以前をアップグレードする場合

バージョン3.6またはそれ以前からアップグレードする場合は、[別のリスト](older-versions/what-is-new.ja.md)からすべての変更を確認してください。

## アップグレードが推奨されるWallarmノード

* バージョン4.xのクライアントおよびマルチテナントWallarmノードをWallarmリリースに最新の状態に保ち、[インストールされたモジュールの非推奨](versioning-policy.ja.md#version-support)を防ぐためにアップグレードします。
* [サポートされていない](versioning-policy.ja.md#version-list)バージョン（3.6およびそれ以前）のクライアントおよびマルチテナントWallarmノード。 Wallarmノード4.4で利用可能な変更は、ノードの構成を簡素化し、トラフィックのフィルタリングを改善します。ただし、ノード4.4の一部の設定は、以前のバージョンのノードと**互換性がありません**。

## アップグレードプロセス

1. [モジュールのアップグレードに関する推奨事項](general-recommendations.ja.md)を確認してください。
2. Wallarmノードのデプロイメントオプションに対応した指示に従って、インストールされているモジュールをアップグレードします：

      * [NGINX、NGINX Plus用モジュール](nginx-modules.ja.md)
      * [NGINXまたはEnvoy用のDockerコンテナ内のモジュール](docker-container.ja.md)
      * [統合されたWallarmモジュールを備えたNGINX Ingressコントローラ](ingress-controller.ja.md)
      * [クラウドノードイメージ](cloud-image.ja.md)
      * [CDNノード](cdn-node.ja.md)
      * [マルチテナントノード](multi-tenant.ja.md)

----------

[Wallarm製品およびコンポーネントのその他のアップデート →](https://changelog.wallarm.com/)