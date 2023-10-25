Wallarm filtreleme düğümü Wallarm Bulutu ile etkileşim kurar. Düğümü Bulut'a bağlamanız gerekmektedir.

Düğümü Bulut'a bağlarken, düğümün adını belirleyebilir, Wallarm Konsolu UI'da hangi ad altında görüneceğini belirleyebilir ve düğümü uygun **düğüm grubuna** yerleştirebilirsiniz (UI'da düğümleri mantıksal olarak organize etmek için kullanılır).

![Gruplandırılmış düğümler][img-grouped-nodes]

Düğümü Bulut'a bağlamak için, [uygun türde][wallarm-token-types] bir Wallarm belirteci kullanın:

=== "API belirteci"

    1. Wallarm Konsolu'nu açın → **Ayarlar** → [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içindeki **API belirteçleri**.
    1. `Deploy` kaynak rolü ile API belirteci bulun veya oluşturun.
    1. Bu belirteci kopyalayın.
    1. Filtreleme düğümünün yüklendiği bir makinede `register-node` scriptini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` `Deploy` rolü ile API belirtecinin kopyalanan değeridir.
        * `--labels 'group=<GROUP>'` parametresi düğümünüzü `<GROUP>` düğüm grubuna ekler (mevcutsa, yoksa oluşturulur).

=== "Düğüm belirteci"

    1. Wallarm Konsolu'nu açın → **Düğümler** [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm düğümü** tipinde bir düğüm oluşturun ve üretilen belirteci kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğümün menüsü → **Belirteci kopyala** kullanarak belirteci kopyalayın.
    1. Filtreleme düğümünün yüklendiği bir makinede `register-node` scriptini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` düğüm belirtecinin kopyalanan değeridir.

* Node örneğiniz için özel bir ad belirlemek için `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnek ismi şu şekilde olacaktır: `HOST_NAME_NodeUUID`.