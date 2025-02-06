To install node, you will need a Wallarm token of the [appropriate type][wallarm-token-types]. To prepare a token:

Düğümü kurmak için, [uygun türde][wallarm-token-types] bir Wallarm token'ına ihtiyacınız olacak. Bir token hazırlamak için:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bağlantılarına [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden erişin.
    1. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.

=== "Node token"

    1. Wallarm Console → **Nodes** bağlantılarına [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden erişin.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan token'ı kopyalayın.
        * Var olan node grubunu kullanın – node menüsünden → **Copy token** seçeneğiyle token'ı kopyalayın.