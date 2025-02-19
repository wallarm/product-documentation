# Wallarm Docker Görüntüsünün Azure Üzerine Dağıtımı

Bu hızlı rehber, [NGINX tabanlı Wallarm node'unun Docker görüntüsünün](https://hub.docker.com/r/wallarm/node) [Azure **Container Instances** servisi](https://docs.microsoft.com/en-us/azure/container-instances/) kullanılarak Microsoft Azure bulut platformuna dağıtım adımlarını sunar.

!!! warning "Talimat sınırlamaları"
    Bu talimatlar yük dengeleme ve node otomatik ölçeklendirmesinin yapılandırılmasını kapsamaz. Bu bileşenleri kendiniz kuruyorsanız, [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview) dokümantasyonunu okumanızı öneririz.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## Gereksinimler

* Aktif bir Azure aboneliği
* [Azure CLI yüklü](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip ve iki faktörlü kimlik doğrulaması devre dışı bırakılmış hesaba erişim
* Saldırı tespit kuralları güncellemelerini ve [API specification][api-policy-enf-docs] indirmek ile [allowlisted, denylisted, or graylisted][graylist-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm node Docker konteyner yapılandırması için seçenekler

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenleriyle yapılandırılmış Wallarm node Docker konteynerinin dağıtılması

Sadece ortam değişkenleriyle yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için aşağıdaki araçları kullanabilirsiniz:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM template](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

Bu talimatlarda, konteyner Azure CLI kullanılarak dağıtılmaktadır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutunu kullanarak Azure CLI'ya giriş yapın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutunu kullanarak bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutla East US bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Wallarm Cloud'a bağlantı için kullanılacak Wallarm node token'ını içeren yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak Wallarm node Docker konteynerinden bir Azure kaynağı oluşturun:

    === "Wallarm US Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: İkinci adımda oluşturulan kaynak grubunun adı.
    * `--name`: Konteynerin adı.
    * `--dns-name-label`: Konteyner için DNS ad etiketi.
    * `--ports`: Filtreleme node'unun dinlediği port.
    * `--image`: Wallarm node Docker görüntüsünün adı.
    * `--environment-variables`: Filtreleme node yapılandırmasını içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça geçirilmesinin önerilmediğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azure portal](https://portal.azure.com/) sayfasını açın ve oluşturulan kaynağın kaynaklar listesinde görüntülendiğinden emin olun.
1. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Montelenmiş dosya ile yapılandırılmış Wallarm node Docker konteynerinin dağıtılması

Ortam değişkenleri ve montelenmiş dosya ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için sadece [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) kullanılabilir.

Ortam değişkenleri ve montelenmiş yapılandırma dosyası ile konteyneri dağıtmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutunu kullanarak Azure CLI'ya giriş yapın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutunu kullanarak bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutla East US bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Filtreleme node ayarlarını içeren bir yapılandırma dosyasını yerel olarak oluşturun. Minimal ayarların örneği:

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

    [Yapılandırma dosyasında belirtilebilen filtreleme node yönergeleri →][nginx-waf-directives]
1. Yapılandırma dosyasını Azure'da veri hacimlerini monte etme için uygun yöntemlerden biriyle yerleştirin. Tüm yöntemler, [Azure dokümantasyonunun **Mount data volumes** bölümünde](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files) açıklanmıştır.

    Bu talimatlarda, yapılandırma dosyası Git deposundan monte edilmektedir.
1. Wallarm Cloud'a bağlantı için kullanılacak Wallarm node token'ını içeren yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak Wallarm node Docker konteynerinden bir Azure kaynağı oluşturun:

    === "Wallarm US Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud için Komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:5.3.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: 2. adımda oluşturulan kaynak grubunun adı.
    * `--name`: Konteynerin adı.
    * `--dns-name-label`: Konteyner için DNS ad etiketi.
    * `--ports`: Filtreleme node'unun dinlediği port.
    * `--image`: Wallarm node Docker görüntüsünün adı.
    * `--gitrepo-url`: Yapılandırma dosyasını içeren Git deposunun URL'si. Dosya depo kökünde yer alıyorsa, sadece bu parametreyi geçirmeniz gerekir. Dosya ayrı bir Git depo dizinindeyse, lütfen `--gitrepo-dir` parametresinde dizin yolunu da belirtin (örneğin,<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: Yapılandırma dosyasının monte edileceği konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine monte edilebilir:

        * `/etc/nginx/conf.d` — ortak ayarlar
        * `/etc/nginx/sites-enabled` — sanal ana bilgisayar ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme node yönergeleri `/etc/nginx/sites-enabled/default` dosyasında tanımlanmalıdır.
    
    * `--environment-variables`: Filtreleme node ve Wallarm Cloud bağlantısı ayarlarını içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça geçirilmesinin önerilmediğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azure portal](https://portal.azure.com/) sayfasını açın ve oluşturulan kaynağın kaynaklar listesinde görüntülendiğinden emin olun.
1. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme Node İşleminin Test Edilmesi

1. Azure portalında oluşturulan kaynağı açın ve **FQDN** değerini kopyalayın.

    ![Settig up container instance][copy-container-ip-azure-img]

    **FQDN** alanı boşsa, lütfen konteynerin **Running** durumunda olduğundan emin olun.

2. Kopyalanan alan adına, test [Path Traversal][ptrav-attack-docs] saldırısını gönderin:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede görüntülendiğinden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında meydana gelen hatalarla ilgili detaylar, Azure portalındaki kaynak detaylarında **Containers** → **Logs** sekmesinde görüntülenir. Kaynak erişilemezse, lütfen konteynere doğru değerlerle gerekli filtreleme node parametrelerinin geçirildiğinden emin olun.