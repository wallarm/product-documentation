Node'u yüklemek için, [uygun türde][wallarm-token-types] bir Wallarm belirtecine ihtiyacınız olacaktır. Belirteci hazırlamak için:

=== "API belirteci"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
    1. Kullanım türü `Node deployment/Deployment` olan bir API belirtecini bulun veya oluşturun.
    1. Bu belirteci kopyalayın.

=== "Düğüm belirteci"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
    1. Aşağıdakilerden birini yapın: 
        * Wallarm node türünde bir node oluşturun ve oluşturulan belirteci kopyalayın.
        * Mevcut node group'u kullanın - node'un menüsünden → **Copy token** ile belirteci kopyalayın.