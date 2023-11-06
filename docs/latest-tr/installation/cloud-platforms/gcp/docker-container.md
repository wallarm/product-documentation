# GCP'ye Wallarm Docker İmajının Dağıtımı

Bu hızlı kılavuz, [Google Compute Engine (GCE) bileşenini](https://cloud.google.com/compute) kullanarak [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node) Google Cloud Platform'a dağıtma adımlarını sağlar.

!!! uyarı "Talimatların sınırlamaları"
    Bu talimatlar, yük dengelemeyi ve düğüm ölçeklendirmeyi yapılandırmayı kapsamaz. Bu bileşenleri kendiniz ayarlıyorsanız, uygun [GCP belgelerini](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) okumanızı öneririz.

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/cloud-platforms/google-gce-use-cases.md"

## Gereksinimler

* Aktif GCP hesabı
* [GCP projesi oluşturulmuş](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d) etkinleştirilmiş
* [Google Cloud SDK (gcloud CLI) kurulmuş ve yapılandırılmış](https://cloud.google.com/sdk/docs/quickstart)
* Çift faktörlü kimlik doğrulama özelliği Wallarm Konsolu'nda **Yönetici** rolüyle hesaba erişim [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/)

## Wallarm düğüm Docker konteynerinin yapılandırma seçenekleri

--8<-- "../include-tr/waf/installation/docker-running-options.md"

## Çevre değişkenleri üzerinden yapılandırılmış Wallarm düğüm Docker konteynerinin dağıtımı

Sadece çevre değişkenleri üzerinden yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için, [GCP Konsolu veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) kullanabilirsiniz. Bu talimatlarda, gcloud CLI kullanılır.

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Örneği Wallarm Bulutu'na bağlamak için kullanılacak Wallarm düğümü tokeni ile yerel çevre değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Çalışan Docker konteyneri bulunan örneği [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) komutunu kullanarak oluşturun:

    === "Wallarm US Cloud için Komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.8.1-1
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:4.8.1-1
        ```

    * `<INSTANCE_NAME>`: örneğin adı, örneğin: `wallarm-node`.
    * `--zone`: örneğin barındırılacağı [bölge](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: örnek etiketleri. Etiketler, örneği diğer kaynaklar için uygunluğu yapılandırmak için kullanılır. Bu durumda, örneğe port 80'i açan `http-server` etiketi atanır.
    * `--container-image`: filtreleme düğümünün Docker imajına bağlantı.
    * `--container-env`: filtreleme düğümü yapılandırması ile çevre değişkenleri (mevcut değişkenler aşağıdaki tabloda listelenmiştir). Lütfen dikkat edin, `WALLARM_API_TOKEN` değerini açıkça geçirmenin önerilmediğini unutmayın.

        --8<-- "../include-tr/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container` komutundaki tüm parametreler [GCP belgelerinde](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) tanımlanmıştır.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances)'ı açın ve örneğin listede görüntülendiğinden emin olun.
1. [Filtreleme düğümü işlemini test edin](#testing-the-filtering-node-operation).

## Monteli dosya üzerinden yapılandırılmış Wallarm düğüm Docker konteyneri dağınımı

Çevre değişkenleri ve monteli dosya üzerinden yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için, örneği oluşturmalı, bu örneğin dosya sistemi içine filtreleme düğümü yapılandırma dosyasını yerleştirmeli ve bu örnekte Docker konteynerini çalıştırmalısınız. Bu adımları [GCP Konsol veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) üzerinde gerçekleştirebilirsiniz. Bu talimatlarda, gcloud CLI kullanılır.

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Compute Engine kaydındaki herhangi bir işletim sistemi imajına dayanan örneği oluşturun [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) komutunu kullanarak:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: örneğin adı.
    * `--image`: Compute Engine kaydından işletim sistemi imajının adı. Oluşturulan örnek, bu imaja dayanacaktır ve daha sonra Docker konteynerini çalışırmak için kullanılacaktır. Bu parametre atlanırsa, örnek Debian 10 imajında temel alınır.
    * `--zone`: örneğin barındırılacağı [bölge](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: örnek etiketleri. Etiketlerö, örneğin diğer kaynaklarla uyumlu olup olmayacağını yapılandırmak için kullanılır. Bu durumda, port 80'i açan `http-server` etiketi örneğe atanmıştır.
    * `gcloud compute instances create` komutunun tüm parametreleri [GCP documentation](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create)'da tarif edilmiştir.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) açın ve örneğin listede görüntülendiğinden ve **RUNNING** durumunda olduğundan emin olun.
1. Örneğe SSH üzerinden bağlanmak için [GCP talimatlarını](https://cloud.google.com/compute/docs/instances/ssh) izleyin.
1. Docker paketlerini uygun işletim sistemine göre [talimatlara göre](https://docs.docker.com/engine/install/#server) örnekte yükleyin.
1. Örneği Wallarm Bulutu'na bağlamak için kullanılacak Wallarm düğümü tokeni ile yerel çevre değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Örnekte, filtreleme düğümü yapılandırmasını içeren `default` isimli dosyanın bulunduğu bir dizin oluşturun (örneğin, dizin adı `configs` olarak adlandırılabilir). Minimum ayarların olduğu dosyanın bir örneği:

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

    [Yapılandırma dosyasında belirlenebilecek filtreleme düğümü direktiflerinin kümesi →][nginx-waf-directives]
1. Wallarm düğüm Docker konteynerini, geçirilen çevre değişkenleri ve monte edilmiş yapılandırma dosyası ile birlikte `docker run` komutunu kullanarak çalıştırın:

    === "Wallarm US Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.1-1
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.1-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: Önceki adımda oluşturulan yapılandırma dosyasının yolu. Örneğin, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: Yapılandırma dosyasını monte edileceği konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine monte edilebilir:

        * `/etc/nginx/conf.d` — şekil ayarları
        * `/etc/nginx/sites-enabled` —sanal ev sahibi ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme düğümü direktiflerinin `/etc/nginx/sites-enabled/default` dosyasında açıklanması gerekir.
    
    * `-p`: filtreleme düğümünün dinlediği port. Değer, örneğin portuyla aynı olmalıdır.
    * `-e`: filtreleme düğümü yapılandırması ile çevre değişkenleri (mevcut değişkenler aşağıdaki tabloda listelenmiştir). Lütfen dikkat edin, `WALLARM_API_TOKEN` değerini açıkça geçirmenin önerilmediğini unutmayın.

        --8<-- "../include-tr/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Filtreleme düğümü işlemini test edin](#testing-the-filtering-node-operation).

## Filtreleme Düğümü İşleminin Test Edilmesi

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) açın ve **Dış IP** sütunundan örneğin IP adresini kopyalayın.

    ![Konteyner Serisi Ayarı][copy-container-ip-gcp-img]

    IP adresi boşsa, lütfen örneğin **RUNNING** durumunda olduğundan emin olun.

2. Kopyalanan adrese test [Path Traversal][ptrav-attack-docs] saldırısını içeren bir istek gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. [US Cloud'daki](https://us1.my.wallarm.com/search) veya [EU Cloud'daki](https://my.wallarm.com/search) Wallarm Konsolu → **Events**'ı açın ve saldırının listede göründüğünden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında oluşan hataların ayrıntıları **View logs** örnek menüsünde görüntülenir. Eğer örnek erişilemezse, lütfen gereken filtreleme düğümü parametrelerinin doğru değerlere sahip olduğunu kontrol edin.