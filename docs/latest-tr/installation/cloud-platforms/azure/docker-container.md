# Azure'a Wallarm Docker İmajının Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node) [Azure **Container Instances** hizmetini](https://docs.microsoft.com/en-us/azure/container-instances/) kullanarak Microsoft Azure bulut platformuna nasıl dağıtacağınızın adımlarını sağlar.

!!! uyarı "Talimatların kısıtlamaları"
    Bu talimatlar yük dengeleme ve düğüm otomatik ölçeklendirme konfigürasyonunu kapsamaz. Bu bileşenleri kendiniz kuruyorsanız, sizin [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview) belgelerini okumanızı öneririz.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## Gereklilikler

* Aktif Azure aboneliği
* [Azure CLI yüklü](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* İki etmenli kimlik doğrulaması etkisizleştirilmiş **Yönetici** rolüne ve Wallarm Konsolunda [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için hesap erişimi

## Wallarm düğüm Docker konteyner yapılandırma seçenekleri

--8<-- "../include-tr/waf/installation/docker-running-options.md"

## Çevre değişkenleri aracılığıyla yapılandırılan Wallarm düğüm Docker konteynerinin dağıtılması

Sadece çevre değişkenleri aracılığıyla yapılandırılan konteynırlaştırılmış Wallarm filtreleme düğümünü dağıtmak için aşağıdaki araçları kullanabilirsiniz:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM şablonu](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

Bu talimatlarda, konteyner Azure CLI kullanılarak dağıtılmaktadır.

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutuyla Azure CLI'ya giriş yapın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutuyla bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutu kullanarak Doğu ABD bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Wallarm Cloud'a bağlanmak için kullanılacak Wallarm düğüm tokeniyle yerel çevre değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Wallarm düğüm Docker konteynerinden bir Azure kaynağı oluşturun.[`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak:

    === "Wallarm US Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.1-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Wallarm EU Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.1-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com'
         ```
        
    * `--resource-group`: ikinci adımda oluşturulan kaynak grubunun adı.
    * `--name`: konteynerin adı.
    * `--dns-name-label`: konteyner için DNS adı etiketi.
    * `--ports`: filtreleme düğümünün dinlediği port.
    * `--image`: Wallarm düğüm Docker imajının adı.
    * `--environment-variables`: filtreleme düğümü yapılandırması ile çevre değişkenleri (mevcut değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açık bir şekilde geçirilmesinin önerilmediğini not alın.

        --8<-- "../include-tr/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azure portalını](https://portal.azure.com/) açın ve oluşturulan kaynağın kaynaklar listesinde göründüğünü kontrol edin.
1. [Filtreleme düğüm işleminin test edilmesi](#testing-the-filtering-node-operation).

## Monteli dosyanın üzerinden yapılandırılan Wallarm düğüm Docker konteynerinin dağıtılması

Çevre değişkenleri ve monteli dosyanın üzerinden yapılandırılan konteynırlaştırılmış Wallarm filtreleme düğümünü dağıtmak için sadece [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) kullanılabilir.

Çevre değişkenleri ve monteli yapılandırma dosyasıyla konteyneri dağıtmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutuyla Azure CLI'ya giriş yapın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutuyla bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutu kullanarak Doğu ABD bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Yerel olarak filtreleme düğüm ayarlarına sahip bir yapılandırma dosyası oluşturun. Minimum ayarlarla bir dosya örneği:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Yapılandırma dosyasında belirtilebilecek filtreleme düğümü yönergeleri →][nginx-waf-directives]
1. Azureda veri birimlerini monte etmek için uygun bir metodla yapılandırma dosyasını konumlandırın. Tüm yöntemler [**Mount data volumes** Azure belgelerinde](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files) tarif edilmiştir.

    Bu talimatlarda, yapılandırma dosyası Git depolarından monte edilmiştir.
1. Wallarm Cloud'a bağlanmak için kullanılacak Wallarm düğümü tokeniyle yerel çevre değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Wallarm düğüm Docker konteynerinden bir Azure kaynağı oluşturun.[`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak:

    === "Wallarm US Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.1-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Wallarm EU Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.1-1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN}
         ```

     * `--resource-group`: ikinci adımda oluşturulan kaynak grubunun adı.
     * `--name`: konteynerin adı.
     * `--dns-name-label`: konteyner için DNS adı etiketi.
     * `--ports`: filtreleme düğümünün dinlediği port.
     * `--image`: Wallarm düğüm Docker imajının adı.
     * `--gitrepo-url`: yapılandırma dosyasını içeren Git deposunun URL'si. Eğer dosya depo kökünde bulunuyorsa, sadece bu parametreyi geçmeniz gerekmektedir. Eğer dosya ayrı bir Git deposu dizini içindeyse, lütfen ayrıca `--gitrepo-dir` parametresine dizinin yolunu geçirin (örneğin,<br>`--gitrepo-dir ./dir1`).
     * `--gitrepo-mount-path`: yapılandırma dosyasının bağlandığı konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine monte edilebilir:

         * `/etc/nginx/conf.d` — genel ayarlar
         * `/etc/nginx/sites-enabled` — sanal host ayarları
         * `/var/www/html` — statik dosyalar

         Filtreleme düğüm yönergeleri `/etc/nginx/sites-enabled/default` dosyası içerisinde detaylandırılmalıdır.
    
    * `--environment-variables`: filtreleme düğümü ve Wallarm bulut bağlantısı için ayarları içeren çevre değişkenleri (mevcut değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açık bir şekilde geçirilmesinin önerilmediğini not alın.

        --8<-- "../include-tr/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azure portalını](https://portal.azure.com/) açın ve oluşturulan kaynağın kaynaklar listesinde göründüğünü kontrol edin.
1. [Filtreleme düğüm işleminin test edilmesi](#testing-the-filtering-node-operation).

## Filtreleme düğüm işleminin test edilmesi

1. Azure portalında oluşturulan kaynağı açın ve **FQDN** değerini kopyalayın.

    ![Container Instance Ayarı][copy-container-ip-azure-img]

    Eğer **FQDN** alanı boşsa, lütfen konteynerin **Running** durumunda olduğundan emin olun.

2. Kopyalanan domain'e test [Path Traversal][ptrav-attack-docs] saldırısını gönderin:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Wallarm Console → **Events**'ı [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) 'da açın ve saldırının listede gösterildiğinden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında oluşan hataların hakkındaki detaylar Azure portalındaki kaynak detaylarının **Containers** → **Logs** sekmesinde görüntülenir. Eğer kaynak bulunamıyorsa, lütfen konteynere gereken filtreleme düğüm parametrelerinin doğru değerlerle geçirildiğinden emin olun.