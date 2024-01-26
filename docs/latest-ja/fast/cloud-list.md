[link-trial-account]:   https://fast.wallarm.com/signup/

# Wallarmのクラウドリスト

FASTは、その運用のために2つのクラウドに依存しています。これらのクラウドは地理的な位置に基づいて区分されています。それらは以下の通りです：
* アメリカのクラウド (別名： *USクラウド*)
* ヨーロッパのクラウド (別名：*EUクラウド*)

運用中、FASTは次のうちのいずれかのクラウドに位置するWallarmポータルとAPIサーバーと相互作用します:
* USクラウド:
    * Wallarmポータル: <https://us1.my.wallarm.com>
    * Wallarm APIサーバー: `us1.api.wallarm.com`
* EUクラウド:
    * Wallarmポータル: <https://my.wallarm.com>
    * Wallarm APIサーバー: `api.wallarm.com`

!!! 警告 "注意してください"
    **Wallarmクラウドとの相互作用のルール:**
        
    * 同じクラウドに位置しているWallarmポータルとAPIサーバーとのみ相互作用できます。
    * [Wallarm試用アカウント][link-trial-account]にサインアップすると、それはアメリカのクラウドに紐づけられます。
        
    **WallarmのクラウドとFASTの文書化:** 

    * 簡潔さを保つため、文書全体を通じてFASTがアメリカのWallarmクラウドと相互作用していると想定しています。
    * ドキュメンテーションからのすべての情報は、特に指定がない限り、すべての利用可能なクラウドに等しく適用されます。   
    * ヨーロッパのクラウドを使用している場合は、FASTおよびドキュメンテーションの作業時に、WallarmポータルとAPIサーバーの対応するアドレスを使用してください。