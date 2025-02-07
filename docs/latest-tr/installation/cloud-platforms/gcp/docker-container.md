# GCP'ye Wallarm Docker Görüntüsünün Dağıtımı

Bu hızlı rehber, [NGINX tabanlı Wallarm node'un Docker görüntüsünü](https://hub.docker.com/r/wallarm/node) [Google Compute Engine (GCE)](https://cloud.google.com/compute) bileşeni kullanarak Google Cloud Platform'a dağıtmanın adımlarını sunar.

!!! warning "Talimatların Sınırlamaları"
    Bu talimatlar, yük dengeleme ve node otomatik ölçeklendirme yapılandırmasını kapsamamaktadır. Bu bileşenleri kendiniz yapılandırıyorsanız, lütfen uygun [GCP dokümantasyonunu](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) okuyunuz.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## Gereksinimler

* Aktif GCP hesabı
* [Oluşturulmuş bir GCP projesi](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* Etkinleştirilmiş [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d)
* Kurulmuş ve yapılandırılmış [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/quickstart)
* Wallarm Console'da iki faktörlü doğrulama devre dışı bırakılmış **Administrator** rolüne sahip hesaba erişim ([US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/))
* Saldırı tespit kuralları güncellemelerinin indirilmesi, [API specifications][api-policy-enf-docs] alınması ve [allowlisted, denylisted, or graylisted][graylist-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'lerin elde edilebilmesi amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm node Docker konteyner yapılandırması için Seçenekler

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam Değişkenleri ile Yapılandırılmış Wallarm Node Docker Konteynerinin Dağıtılması

Sadece ortam değişkenleri ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için [GCP Console veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) kullanabilirsiniz. Bu talimatlarda gcloud CLI tercih edilmiştir.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Instance'ı Wallarm Cloud'a bağlamak için kullanılacak Wallarm node token'ı ile yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) komutunu kullanarak Docker konteynerinin çalıştığı instance'ı oluşturun:

    === "Wallarm US Cloud için Komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:5.3.0
        ```

    * `<INSTANCE_NAME>`: instance'ın adı, örneğin: `wallarm-node`.
    * `--zone`: instance'ı barındıracak [zone](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: instance etiketleri. Etiketler, instance'ın diğer kaynaklarla uyumluluğunu yapılandırmak için kullanılır. Bu örnekte, 80 nolu portu açmak üzere `http-server` etiketi instance'a atanır.
    * `--container-image`: Filtreleme düğümünün Docker görüntüsüne bağlantı.
    * `--container-env`: Filtreleme düğümü yapılandırması için ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça geçirilmesinin önerilmediğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * `gcloud compute instances create-with-container` komutunun tüm parametreleri [GCP dokümantasyonunda](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) açıklanmıştır.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) açarak instance'ın listede göründüğünden emin olun.
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Bağlanmış Dosya Üzerinden Yapılandırılmış Wallarm Node Docker Konteynerinin Dağıtılması

Ortam değişkenleri ile ve bağlanmış dosya üzerinden yapılandırılmış konteynerleştirilmiş Wallarm filtreleme node'unu dağıtmak için, instance'ı oluşturmalı, bu instance dosya sisteminde filtreleme düğümü yapılandırma dosyasını bulmalı ve Docker konteynerini çalıştırmalısınız. Bu adımları [GCP Console veya gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers) ile gerçekleştirebilirsiniz. Bu talimatlarda gcloud CLI kullanılmaktadır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Compute Engine kayıt defterindeki herhangi bir işletim sistemi görüntüsünü temel alarak, [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) komutunu kullanarak instance'ı oluşturun:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: instance'ın adı.
    * `--image`: Compute Engine kayıt defterindeki işletim sistemi görüntüsünün adı. Oluşturulan instance bu görüntüye dayalı olacak ve daha sonra Docker konteynerini çalıştırmak için kullanılacaktır. Bu parametre atlanırsa, instance Debian 10 görüntüsüne dayalı oluşturulacaktır.
    * `--zone`: instance'ı barındıracak [zone](https://cloud.google.com/compute/docs/regions-zones).
    * `--tags`: Instance etiketleri. Bu etiketler, instance'ın diğer kaynaklarla uyum içinde kullanılmasını sağlamak içindir. Bu örnekte, 80 nolu portu açmak üzere `http-server` etiketi instance'a atanır.
    * `gcloud compute instances create` komutunun tüm parametreleri [GCP dokümantasyonunda](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) açıklanmıştır.
1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) açarak instance'ın listede göründüğünden ve **RUNNING** durumunda olduğundan emin olun.
1. [GCP dokümantasyonundaki SSH bağlantısı talimatlarını](https://cloud.google.com/compute/docs/instances/ssh) izleyerek instance'a SSH ile bağlanın.
1. [Uygun işletim sistemi için talimatları](https://docs.docker.com/engine/install/#server) izleyerek instance üzerinde Docker paketlerini kurun.
1. Instance'ı Wallarm Cloud'a bağlamak için kullanılacak Wallarm node token'ı ile yerel ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Instance içinde, filtreleme düğümü yapılandırmasını içeren `default` dosyasını barındıracak bir dizin oluşturun (örneğin, dizin adı `configs` olabilir). Minimal ayarları içeren dosya örneği:

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

    [Yapılandırma dosyasında belirtilmesi mümkün filtreleme düğümü yönergeleri seti →][nginx-waf-directives]
1. Geçilen ortam değişkenleri ve bağlanmış yapılandırma dosyası ile `docker run` komutunu kullanarak Wallarm node Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: Bir önceki adımda oluşturulan yapılandırma dosyasının yolu. Örneğin, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: Yapılandırma dosyasının konteyner içine monte edileceği dizin. Yapılandırma dosyaları, NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine monte edilebilir:

        * `/etc/nginx/conf.d` — Ortak ayarlar
        * `/etc/nginx/sites-enabled` — Sanal host ayarları
        * `/var/www/html` — Statik dosyalar

        Filtreleme düğümü yönergeleri, `/etc/nginx/sites-enabled/default` dosyasında belirtilmelidir.
    
    * `-p`: Filtreleme düğümünün dinlediği port. Değer, instance portu ile aynı olmalıdır.
    * `-e`: Filtreleme düğümü yapılandırması için ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça geçirilmesinin önerilmediğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme Düğümünün Çalışmasını Test Etme

1. [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) açın ve **External IP** sütunundan instance IP adresini kopyalayın.

    ![Settig up container instance][copy-container-ip-gcp-img]

    Eğer IP adresi boşsa, lütfen instance'ın **RUNNING** durumunda olduğundan emin olun.

2. Kopyaladığınız adrese test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü, [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede göründüğünden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında oluşan hataların detayları, instance menüsündeki **View logs** bölümünde görüntülenir. Instance erişilemezse, lütfen konteynere doğru değerlerle gerekli filtreleme düğümü parametrelerinin geçirildiğinden emin olun.