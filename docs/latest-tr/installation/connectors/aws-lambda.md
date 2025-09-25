[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Amazon CloudFront için Wallarm Connector

[CloudFront](https://aws.amazon.com/cloudfront/), Amazon Web Services tarafından işletilen bir içerik teslim ağıdır. Wallarm, CloudFront üzerinden teslim edilen trafiği güvence altına almak ve izlemek için bir bağlayıcı olarak görev yapabilir.

Wallarm’ı CloudFront için bir bağlayıcı olarak kullanmak için, **Wallarm node’unu harici olarak dağıtmanız** ve trafiği analiz için Wallarm node’una yönlendirmek amacıyla **Wallarm tarafından sağlanan Lambda@Edge işlevlerini çalıştırmanız** gerekir.

CloudFront bağlayıcısı hem [in-line](../inline/overview.md) hem de [out-of-band](../oob/overview.md) trafik analizini destekler:

=== "Satır içi trafik akışı"

    Wallarm kötü amaçlı etkinlikleri engelleyecek şekilde yapılandırılmışsa:

    ![Wallarm ile CloudFront - satır içi şema](../../images/waf-installation/gateways/cloudfront/traffic-flow-inline.png)
=== "Bant dışı trafik akışı"
    ![Wallarm ile CloudFront - bant dışı şema](../../images/waf-installation/gateways/cloudfront/traffic-flow-oob.png)

!!! info "Güvenlik notu"
    Sunulan çözüm, en az ayrıcalık ilkesi gözetilerek tasarlanmıştır. İşlevler, CloudFront ve Wallarm Node ile çalışmak için gerekli en az izin kümesini talep eder ve varsayılan olarak güvenli dağıtımı sağlar.

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, trafiği Amazon CloudFront üzerinden ilettiğiniz durumlarda bu çözüm önerilir.

## Sınırlamalar

* Lambda@Edge işlev düzeyi kısıtlamaları:

    * Lambda@Edge işlevleri, 4xx HTTP durum kodlarına sahip görüntüleyici yanıtları tarafından tetiklenmez.
    * Lambda@Edge, hem origin response hem de viewer response olaylarında yanıt gövdesine erişime izin vermez; bu da yanıt içeriğine dayalı herhangi bir işlem yapılmasını kısıtlar.
    * Gövde boyutu, viewer istekleri için 40 KB ve origin istekleri için 1 MB ile sınırlıdır.
    * Wallarm node’undan gelen maksimum yanıt süresi, viewer istekleri için 5 saniye ve origin istekleri için 30 saniyedir.
    * Lambda@Edge, özel ağları (VPC) desteklemez.
    * Eşzamanlı istekler için varsayılan sınır bölge başına 1.000’dir, ancak on binlere kadar artırılabilir.
    * Wallarm Lambda@Edge işlevleri origin düzeyinde çalışır; bu, CDN önbelleği tarafından karşılanan isteklere yönelik izleme yapılmadığı anlamına gelir. Böylece bu tür isteklere yönelik olası saldırılar tespit edilemez.
* Özellik kısıtlamaları:
    * [Helm chart][helm-chart-native-node] kullanılarak `LoadBalancer` türüyle Wallarm servisi dağıtılırken, Node örneği alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Öz imzalı sertifikalar henüz desteklenmemektedir.
    * [Özel engelleme sayfası ve engelleme kodu][custom-blocking-page] yapılandırmaları henüz desteklenmiyor.
    * Lambda@Edge yanıt tetikleyici kısıtlamaları nedeniyle [pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve [API Discovery’de API yanıt yapısına](../../api-discovery/exploring.md#endpoint-details) dayalı güvenlik açığı tespiti sınırlıdır. Wallarm işlevleri yanıt gövdelerini alamadığından ve onlara dayanamadığından, bu özellikler kullanılamaz.
    * Wallarm kuralıyla [oran sınırlama](../../user-guides/rules/rate-limiting.md) desteklenmiyor.
    * [Multitenancy](../multi-tenant/overview.md) henüz desteklenmiyor.

## Gereksinimler

Dağıtıma devam etmeden önce aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* AWS CloudFront ve Lambda teknolojileri hakkında bilgi.
* CloudFront CDN üzerinden geçen API’ler veya trafik.

## Dağıtım

### 1. Bir Wallarm node’u dağıtın

Wallarm node’u, dağıtmanız gereken Wallarm platformunun temel bileşenidir. Gelen trafiği inceler, kötü amaçlı etkinlikleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Gereken kontrol düzeyine bağlı olarak, Wallarm tarafından barındırılan ya da kendi altyapınızda barındırılan şekilde dağıtabilirsiniz.

=== "Edge node"
    Bağlayıcı için Wallarm tarafından barındırılan bir node dağıtmak üzere [talimatlar](../security-edge/se-connector.md)ı izleyin.
=== "Self-hosted node"
    Self-hosted node dağıtımı için bir yapıt seçin ve ekli talimatları izleyin:

    * Bare metal veya VM’lerde Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
    * Container tabanlı dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    * AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm Lambda@Edge işlevlerini edinin ve dağıtın

CloudFront CDN’inizi Wallarm node’una bağlamak için Wallarm Lambda@Edge işlevlerini AWS üzerinde dağıtmanız gerekir.

İki adet Python tabanlı işlev vardır: biri istekleri iletme ve analiz etme, diğeri ise yanıtları iletme ve analiz etme için.

=== "Manuel indirme ve dağıtma"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidin ve platformunuz için bir kod paketi indirin.

        Self-hosted node çalıştırıyorsanız, kod paketini almak için sales@wallarm.com ile iletişime geçin.
    1. AWS Console’unuza gidin → **Services** → **Lambda** → **Functions**.
    1. [Lambda@Edge işlevleri için gerekli](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function) olan `us-east-1` (N. Virginia) bölgesini seçin.
    1. Aşağıdaki ayarlarla **Create function** oluşturun:

        * Runtime: Python 3.x.
        * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
        * Diğer ayarlar varsayılan bırakılabilir.
    1. İşlev oluşturulduktan sonra, **Code** sekmesinde Wallarm istek işleme kodunu yapıştırın.
    1. Koddaki aşağıdaki parametreleri güncelleyin:

        * `wlrm_node_addr`: Wallarm node’unuzun URL’si.
        * `wlrm_inline`: [asenkron (bant dışı)](../oob/overview.md) modu kullanılıyorsa `False` olarak ayarlayın.
        * Gerekirse diğer parametreleri değiştirin.
    1. **Actions** → **Deploy to Lambda@Edge** adımlarını izleyin ve aşağıdaki ayarları belirtin:

        * Configure new CloudFront trigger.
        * Distribution: korumak istediğiniz origin’e trafiği yönlendiren CDN’iniz.
        * Cache behavior: Lambda işlevi için önbellek davranışı, genellikle `*`.
        * CloudFront event: 
            
            * **Origin request**: yalnızca CloudFront CDN arka uçtan veri istediğinde işlevi çalıştırır. CDN önbellekten yanıt döndürürse işlev çalışmaz.
            * **Viewer request**: CloudFront CDN’e gelen her istek için işlevi çalıştırır.
        * **Include body** seçeneğini işaretleyin.
        * **Confirm deploy to Lambda@Edge** seçeneğini işaretleyin.

        ![CloudFront işlev dağıtımı](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. Wallarm tarafından sağlanan yanıt işlevi için de prosedürü tekrarlayın ve tetikleyici olarak yanıtları seçin.

        Yanıt tetikleyicisinin istek tetikleyicisiyle eşleştiğinden emin olun (origin request için origin response, viewer request için viewer response).
=== "AWS SAR üzerinden işlevleri dağıtma"
    Her iki işlevi de doğrudan AWS Serverless Application Repository (SAR) üzerinden dağıtabilirsiniz. İşlevler, [Lambda@Edge işlevleri için gerekli](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function) olan `us-east-1` (N. Virginia) bölgesine dağıtılacaktır.

    1. [AWS Serverless Application Repository’de Wallarm politikalarına](https://serverlessrepo.aws.amazon.com/applications/us-east-1/381492110259/wallarm-connector) gidin → **Deploy**.
    1. Dağıtım ayarlarını varsayılan bırakın.
    1. Dağıtım tamamlandıktan sonra, oluşturulan IAM rollerine gidin → **Trust relationships** ve her iki rolü de (biri istekler, diğeri yanıtlar için) aşağıdaki policy ile güncelleyin:

        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": [
                            "edgelambda.amazonaws.com",
                            "lambda.amazonaws.com"
                        ]
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
        ```

    1. AWS Console’unuza gidin → **Services** → **Lambda** → **Functions**.
    1. `serverlessrepo-wallarm-connector-RequestHandler-xxx` işlevini açın.
    1. **Code** sekmesinde aşağıdaki parametreleri güncelleyin:

        * `wlrm_node_addr`: [Wallarm node örneğinizin](#1-deploy-a-wallarm-node) adresi.
        * `wlrm_inline`: [out-of-band](../oob/overview.md) modu kullanılıyorsa `False` olarak ayarlayın.
        * Gerekirse diğer parametreleri değiştirin.
    1. **Actions** → **Deploy to Lambda@Edge** adımlarını izleyin ve aşağıdaki ayarları belirtin:

        * Configure new CloudFront trigger.
        * Distribution: korumak istediğiniz origin’e trafiği yönlendiren CDN’iniz.
        * Cache behavior: Lambda işlevi için önbellek davranışı, genellikle `*`.
        * CloudFront event: 
            
            * **Origin request**: yalnızca CloudFront CDN arka uçtan veri istediğinde işlevi çalıştırır. CDN önbellekten yanıt döndürürse işlev çalışmaz.
            * **Viewer request**: CloudFront CDN’e gelen her istek için işlevi çalıştırır.
        * **Include body** seçeneğini işaretleyin.
        * **Confirm deploy to Lambda@Edge** seçeneğini işaretleyin.

        ![CloudFront işlev dağıtımı](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. AWS Console’unuza geri dönün → **Services** → **Lambda** → **Functions**.
    1. `serverlessrepo-wallarm-connector-ResponseHandler-xxx` işlevini açın.
    1. Wallarm tarafından sağlanan yanıt işlevi için de prosedürü tekrarlayın ve tetikleyici olarak yanıtları seçin.

        Yanıt tetikleyicisinin istek tetikleyicisiyle eşleştiğinden emin olun (origin request için origin response, viewer request için viewer response).

## Test

Dağıtılan işlevlerin çalışırlığını test etmek için şu adımları izleyin:

1. CloudFront CDN’inize test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<CLOUDFRONT_CDN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzde saldırılar][attacks-in-ui-image]

    Wallarm node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmış ve trafik satır içi akıyorsa, istek ayrıca engellenecektir.

## Lambda@Edge işlevlerini yükseltme

Dağıtılmış Lambda@Edge işlevini [daha yeni bir sürüme](code-bundle-inventory.md#cloudfront) yükseltmek için:

=== "Manuel indirme ve dağıtma"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidin ve güncellenmiş Wallarm Lambda@Edge işlevlerini indirin.

        Self-hosted node çalıştırıyorsanız, güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
    1. Dağıtılmış Lambda@Edge işlevlerinizdeki kodu güncel paketle değiştirin.

        `wlrm_node_addr`, `wlrm_inline` ve diğerleri gibi parametreler için mevcut değerleri koruyun.

        Mevcut işlev tetikleyicilerini değiştirmeyin.
    1. Güncellenmiş işlevleri **Deploy** edin.
=== "AWS SAR üzerinden işlevleri dağıtma"
    1. İşlevlerin yeni sürümünü kullanarak [2. adımda](#2-obtain-and-deploy-the-wallarm-lambdaedge-functions) belirtilen adımları tekrarlayın.
    1. Güncellenmiş işlevleri dağıtımlarınıza bağladıktan sonra, çakışmaları önlemek için önceki sürümleri CloudFront tetikleyicilerinden kaldırın.

İşlev yükseltmeleri, özellikle ana sürüm güncellemelerinde, bir Wallarm node yükseltmesi gerektirebilir. Self-hosted Node sürüm notları ve yükseltme talimatları için [Native Node değişiklik günlüğü](../../updating-migrating/native-node/node-artifact-versions.md)ne veya [Edge connector yükseltme prosedürü](../security-edge/se-connector.md#upgrading-the-edge-node)ne bakın. Eskimeyi önlemek ve gelecekteki yükseltmeleri basitleştirmek için düzenli node güncellemeleri önerilir.