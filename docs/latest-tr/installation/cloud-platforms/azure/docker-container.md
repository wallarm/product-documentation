# Wallarm Docker İmajının Azure’a Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node), [Azure **Container Instances** hizmetini](https://docs.microsoft.com/en-us/azure/container-instances/) kullanarak Microsoft Azure bulut platformuna dağıtma adımlarını sunar.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar yük dengeleme ve düğüm otomatik ölçeklendirme yapılandırmasını kapsamaz. Bu bileşenleri kendiniz kuracaksanız, [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview) belgelerini okumanızı öneririz.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## Gereksinimler

* Etkin Azure aboneliği
* [Azure CLI yüklü](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* Saldırı tespit kurallarını ve [API spesifikasyonlarını][api-policy-enf-docs] güncellemek, ayrıca [allowlisted, denylisted veya graylisted][graylist-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm düğümü Docker konteyneri yapılandırma seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenleri ile yapılandırılmış Wallarm düğümü Docker konteynerinin dağıtımı

Yalnızca ortam değişkenleri ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için aşağıdaki araçları kullanabilirsiniz:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM şablonu](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

Bu talimatlarda, konteyner Azure CLI kullanılarak dağıtılır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutunu kullanarak Azure CLI’a oturum açın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutunu kullanarak bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutla East US bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Örneği Wallarm Cloud’a bağlamak için kullanılacak Wallarm düğüm belirtecini içeren yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak Wallarm düğümü Docker konteynerinden bir Azure kaynağı oluşturun:

    === "Wallarm US Cloud için komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.5.1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud için komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.5.1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: ikinci adımda oluşturulan kaynak grubunun adı.
    * `--name`: konteynerin adı.
    * `--dns-name-label`: konteyner için DNS ad etiketi.
    * `--ports`: filtreleme düğümünün dinlediği bağlantı noktası.
    * `--image`: Wallarm düğümü Docker imajının adı.
    * `--environment-variables`: filtreleme düğümü yapılandırmasını içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerini açıkça iletmeniz önerilmez.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Azure portalını](https://portal.azure.com/) açın ve oluşturulan kaynağın kaynaklar listesinde görüntülendiğinden emin olun.
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Bağlanmış dosya üzerinden yapılandırılmış Wallarm düğümü Docker konteynerinin dağıtımı

Ortam değişkenleri ve bağlanmış dosya üzerinden yapılandırılan konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için yalnızca [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) kullanılabilir.

Ortam değişkenleri ve bağlanmış yapılandırma dosyasıyla konteyneri dağıtmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) komutunu kullanarak Azure CLI’a oturum açın:

    ```bash
    az login
    ```
1. [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) komutunu kullanarak bir kaynak grubu oluşturun. Örneğin, aşağıdaki komutla East US bölgesinde `myResourceGroup` grubunu oluşturun:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Filtreleme düğümü ayarlarını içeren bir yapılandırma dosyasını yerel olarak oluşturun. Minimum ayarlarla dosya örneği:

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

    [Yapılandırma dosyasında belirtilebilen filtreleme düğümü yönergeleri kümesi →][nginx-waf-directives]
1. Yapılandırma dosyasını, Azure’da veri birimlerini bağlamak için uygun yöntemlerden biriyle konumlandırın. Tüm yöntemler Azure belgelerinin [**Mount data volumes** bölümünde](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files) açıklanmıştır.

    Bu talimatlarda, yapılandırma dosyası Git deposundan bağlanır.
1. Örneği Wallarm Cloud’a bağlamak için kullanılacak Wallarm düğüm belirtecini içeren yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) komutunu kullanarak Wallarm düğümü Docker konteynerinden bir Azure kaynağı oluşturun:

    === "Wallarm US Cloud için komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.5.1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Wallarm EU Cloud için komut"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.5.1 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: 2. adımda oluşturulan kaynak grubunun adı.
    * `--name`: konteynerin adı.
    * `--dns-name-label`: konteyner için DNS ad etiketi.
    * `--ports`: filtreleme düğümünün dinlediği bağlantı noktası.
    * `--image`: Wallarm düğümü Docker imajının adı.
    * `--gitrepo-url`: yapılandırma dosyasını içeren Git deposunun URL’si. Dosya depo kökünde bulunuyorsa yalnızca bu parametreyi iletmeniz gerekir. Dosya ayrı bir Git depo dizininde bulunuyorsa lütfen `--gitrepo-dir` parametresinde dizinin yolunu da iletin (örneğin,<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: yapılandırma dosyasının bağlanacağı konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine bağlanabilir:

        * `/etc/nginx/conf.d` — genel ayarlar
        * `/etc/nginx/http.d` — sanal ana bilgisayar ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme düğümü yönergeleri `/etc/nginx/http.d/default.conf` dosyasında tanımlanmalıdır.
    
    * `--environment-variables`: filtreleme düğümü ve Wallarm Cloud bağlantısı için ayarları içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerini açıkça iletmeniz önerilmez.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Azure portalını](https://portal.azure.com/) açın ve oluşturulan kaynağın kaynaklar listesinde görüntülendiğinden emin olun.
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

<a id="testing-the-filtering-node-operation"></a>
## Filtreleme düğümünün çalışmasını test etme

1. Azure portalında oluşturduğunuz kaynağı açın ve **FQDN** değerini kopyalayın.

    ![Kapsayıcı örneğini ayarlama][copy-container-ip-azure-img]

    **FQDN** alanı boşsa, lütfen konteynerin durumunun **Running** olduğundan emin olun.

2. Kopyaladığınız alan adına test [Yol Geçişi (Path Traversal)][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede görüntülendiğinden emin olun.
    ![UI'de Attacks][attacks-in-ui-image]
1. İsteğe bağlı olarak, düğümün çalışmasının diğer yönlerini [test edin][link-docs-check-operation].

Konteyner dağıtımı sırasında oluşan hatalara ilişkin ayrıntılar, Azure portalındaki kaynak ayrıntılarının **Containers** → **Logs** sekmesinde görüntülenir. Kaynak kullanılamıyorsa, lütfen gerekli filtreleme düğümü parametrelerinin doğru değerlerle konteynere iletildiğinden emin olun.