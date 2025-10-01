# Wallarm Docker İmajının GCP'ye Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm node'unun Docker imajını](https://hub.docker.com/r/wallarm/node) [Google Compute Engine (GCE) bileşenini](https://cloud.google.com/compute) kullanarak Google Cloud Platform'a dağıtma adımlarını sunar.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar, yük dengeleme ve node otomatik ölçeklendirme yapılandırmasını kapsamaz. Bu bileşenleri kendiniz kuracaksanız, ilgili [GCP dokümantasyonunu](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) okumanızı öneririz.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## Gereksinimler

* Aktif GCP hesabı
* [GCP projesi oluşturuldu](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d) etkin
* [Google Cloud SDK (gcloud CLI) yüklü ve yapılandırılmış](https://cloud.google.com/sdk/docs/quickstart)
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* Saldırı tespit kurallarına ve [API spesifikasyonlarına][api-policy-enf-docs] güncellemeleri indirmek, ayrıca ülkeleriniz, bölgeleriniz veya veri merkezleriniz için [izinli listeye (allowlist), yasaklı listeye (denylist) veya gri listeye (graylist) alınmış][graylist-docs] IP'lerin tam listesini almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm node Docker konteyneri yapılandırma seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenleri aracılığıyla yapılandırılmış Wallarm node Docker konteynerinin dağıtımı

Yalnızca ortam değişkenleriyle yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için [GCP Console veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) kullanılabilir. Bu talimatta gcloud CLI kullanılmıştır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Örneği Wallarm Cloud'a bağlamak için kullanılacak Wallarm node token'ını yerel ortam değişkeni olarak ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Çalışan Docker konteyneriyle örneği [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) komutuyla oluşturun:

    === "Wallarm US Cloud için komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:6.5.1
        ```
    === "Wallarm EU Cloud için komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:6.5.1
        ```

    * `<INSTANCE_NAME>`: örnek adı, örneğin: `wallarm-node`.
    * `--zone`: örneğe ev sahipliği yapacak [bölge](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: örnek etiketleri. Etiketler, örneğin diğer kaynaklara erişilebilirliğini yapılandırmak için kullanılır. Bu durumda, 80 numaralı portu açan `http-server` etiketi örneğe atanır.
    * `--container-image`: filtreleme node'unun Docker imajına bağlantı.
    * `--container-env`: filtreleme node'u yapılandırması için ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). `WALLARM_API_TOKEN` değerinin açıkça geçirilmesi tavsiye edilmez.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container` komutunun tüm parametreleri [GCP dokümantasyonunda](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) açıklanmıştır.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) sayfasını açın ve örneğin listede görüntülendiğini doğrulayın.
1. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Bağlanan dosya üzerinden yapılandırılmış Wallarm node Docker konteynerinin dağıtımı

Ortam değişkenleri ve bağlanan dosya üzerinden yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için bir örnek oluşturmalı, filtreleme node'u yapılandırma dosyasını bu örneğin dosya sistemine yerleştirmeli ve Docker konteynerini bu örnekte çalıştırmalısınız. Bu adımlar [GCP Console veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) aracılığıyla gerçekleştirilebilir. Bu talimatta gcloud CLI kullanılmıştır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) komutunu kullanarak Compute Engine kayıt defterindeki herhangi bir işletim sistemi imajına dayalı örneği oluşturun:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: örnek adı.
    * `--image`: Compute Engine kayıt defterindeki işletim sistemi imajının adı. Oluşturulan örnek bu imaja dayanacaktır ve daha sonra Docker konteynerini çalıştırmak için kullanılacaktır. Bu parametre atlanırsa, örnek Debian 10 imajına dayanır.
    * `--zone`: örneğe ev sahipliği yapacak [bölge](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: örnek etiketleri. Etiketler, örneğin diğer kaynaklara erişilebilirliğini yapılandırmak için kullanılır. Bu durumda, 80 numaralı portu açan `http-server` etiketi örneğe atanır.
    * `gcloud compute instances create` komutunun tüm parametreleri [GCP dokümantasyonunda](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) açıklanmıştır.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) sayfasını açın ve örneğin listede görüntülendiğini ve **RUNNING** durumunda olduğunu doğrulayın.
1. [GCP talimatlarını](https://cloud.google.com/compute/docs/instances/ssh) izleyerek örneğe SSH üzerinden bağlanın.
1. Uygun işletim sistemi için [talimatları](https://docs.docker.com/engine/install/#server) izleyerek örneğe Docker paketlerini yükleyin.
1. Örneği Wallarm Cloud'a bağlamak için kullanılacak Wallarm node token'ını yerel ortam değişkeni olarak ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Örnekte, filtreleme node'u yapılandırmasını içeren `default` dosyasıyla birlikte bir dizin oluşturun (örneğin dizin adı `configs` olabilir). Minimum ayarlarla dosya örneği:

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

    [Yapılandırma dosyasında belirtilebilecek filtreleme node'u yönergeleri seti →][nginx-waf-directives]
1. Ortam değişkenleri geçirilmiş ve yapılandırma dosyası bağlanmış şekilde `docker run` komutunu kullanarak Wallarm node Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:6.5.1
        ```
    === "Wallarm EU Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:6.5.1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: önceki adımda oluşturulan yapılandırma dosyasının yolu. Örneğin, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: yapılandırma dosyasının bağlanacağı konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine bağlanabilir:

        * `/etc/nginx/conf.d` — genel ayarlar
        * `/etc/nginx/http.d` — sanal host ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme node'u yönergeleri `/etc/nginx/http.d/default.conf` dosyasında tanımlanmalıdır.
    
    * `-p`: filtreleme node'unun dinlediği port. Değer, örnek portuyla aynı olmalıdır.
    * `-e`: filtreleme node'u yapılandırması için ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). `WALLARM_API_TOKEN` değerinin açıkça geçirilmesi tavsiye edilmez.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme node'unun çalışmasını test etme

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) sayfasını açın ve **External IP** sütunundan örneğin IP adresini kopyalayın.

    ![Konteyner örneğinin ayarlanması][copy-container-ip-gcp-img]

    IP adresi boşsa, lütfen örneğin **RUNNING** durumunda olduğundan emin olun.

2. Kopyaladığınız adrese test [Path Traversal][ptrav-attack-docs] saldırısıyla istek gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede göründüğünden emin olun.
    ![UI'de Attacks][attacks-in-ui-image]
1. İsteğe bağlı olarak, node'un çalışmasının diğer yönlerini [test edin][link-docs-check-operation].

Konteyner dağıtımı sırasında oluşan hatalara ilişkin ayrıntılar, örneğin menüsündeki **View logs** bölümünde görüntülenir. Örnek erişilemezse, lütfen gerekli filtreleme node'u parametrelerinin doğru değerlerle konteynere geçirildiğinden emin olun.