#   Wallarm Cloud一覧

FASTは2つのクラウドを利用して動作します。これらのクラウドは地理的なロケーションに基づいて分かれており、次の2種類があります。
* 米国クラウド（別名*US cloud*）。
* 欧州クラウド（別名*EU cloud*）。

動作中、FASTはいずれかのクラウドに配置されているWallarmポータルとAPIサーバーとやり取りします:
* USクラウド:
    * Wallarmポータル: <https://us1.my.wallarm.com>
    * Wallarm APIサーバー: `us1.api.wallarm.com`
* EUクラウド:
    * Wallarmポータル: <https://my.wallarm.com>
    * Wallarm APIサーバー: `api.wallarm.com`

!!! warning "ご注意ください"
    **Wallarm Cloudとのやり取りのルール:**
        
    同じクラウド内にあるWallarmポータルおよびAPIサーバーとのみやり取りできます。
        
    **Wallarm CloudとFASTドキュメント:** 

    * 簡潔さのため、本ドキュメント全体では、FASTが米国のWallarm Cloudとやり取りするものと仮定しています。
    * 特に断りがない限り、本ドキュメントの情報は、利用可能なすべてのクラウドに同様に適用できます。   
    * 欧州クラウドを利用する場合は、FASTや本ドキュメントに従って作業する際に、WallarmポータルとAPIサーバーの対応するアドレスを使用してください。