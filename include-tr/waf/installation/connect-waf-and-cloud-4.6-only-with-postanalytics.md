The Wallarm filtering node, Wallarm Cloud ile etkileşir. Düğümü Cloud’a bağlamanız gerekir.

Cloud’a düğümü bağlarken, Wallarm Console UI’de görüntülenecek düğüm adını ayarlayabilir ve düğümü uygun **node group** içerisine (UI’de düğümleri mantıksal olarak organize etmek için kullanılır) ekleyebilirsiniz.

![Grouped nodes][img-grouped-nodes]

Düğümü Cloud’a bağlamak için, [appropriate type][wallarm-token-types] Wallarm token’ından kullanın:

=== "API token"

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden Wallarm Console → **Settings** → **API tokens** sayfasını açın.
2. `Deploy` kaynak rolüne sahip API token’ını bulun veya oluşturun.
3. Bu token’ı kopyalayın.
4. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
        ```
        
    * `<TOKEN>`, `Deploy` rolüne sahip API token’ın kopyalanmış değeridir.
    * `--labels 'group=<GROUP>'` parametresi, düğümünüzü `<GROUP>` düğüm grubuna ekler (varsa mevcut, yoksa oluşturulur).

=== "Node token"

1. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden Wallarm Console → **Nodes** sayfasını açın.
2. Aşağıdakilerden birini yapın:
    * **Wallarm node** türünde düğüm oluşturun ve oluşturulan token’ı kopyalayın.
    * Var olan düğüm grubunu kullanın – düğüm menüsünden **Copy token** seçeneği ile token’ı kopyalayın.
3. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN>
        ```

    * `<TOKEN>`, kopyaladığınız düğüm token’ının değeridir.

* Düğüm örneğiniz için özel bir isim ayarlamak isterseniz, `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Nihai örnek adı: `HOST_NAME_NodeUUID` olacaktır.