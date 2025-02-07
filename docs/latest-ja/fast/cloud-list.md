# Wallarmクラウド一覧

FASTは動作のために2つのクラウドを利用します。これらのクラウドは地理的位置に基づいて区分されます。具体的には：
* アメリカクラウド（別名*US cloud*）。
* ヨーロッパクラウド（別名*EU cloud*）。

FASTは動作中に、いずれかのクラウド内に配置されたWallarmポータルおよびAPIサーバと連携します：
* USクラウド:
    * Wallarmポータル: <https://us1.my.wallarm.com>
    * Wallarm APIサーバ: `us1.api.wallarm.com`
* EUクラウド:
    * Wallarmポータル: <https://my.wallarm.com>
    * Wallarm APIサーバ: `api.wallarm.com`

!!! warning "ご注意ください"
    **Wallarmクラウドとの連携ルール：**
        
    同一のクラウド内に配置されたWallarmポータルおよびAPIサーバとのみ連携可能です。
        
    **WallarmクラウドとFASTドキュメント：** 

    * 簡潔さのため、ドキュメント全体ではFASTがアメリカクラウドと連携する前提となっています。
    * 特段の記載がない限り、ドキュメントのすべての情報は全てのクラウドに同様に適用可能です。   
    * ヨーロッパクラウドと連携する場合は、FASTおよびドキュメント利用時にWallarmポータルおよびAPIサーバの該当アドレスを使用してください。