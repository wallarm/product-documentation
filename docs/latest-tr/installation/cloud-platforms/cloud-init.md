# Wallarm cloud-init Betiği Özellikleri

Altyapıyı Kod (IaC) olarak uygulama yaklaşımını benimsiyorsanız, Wallarm düğümünü genel buluta dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) betiğini kullanmanız gerekebilir. 4.0 sürümünden itibaren, Wallarm, bu konuda açıklanan kullanıma hazır `cloud-init.py` betiği ile birlikte bulut imajlarını dağıtmaktadır.

## Wallarm cloud-init betiğinin genel görünümü

Wallarm `cloud-init` betiği, [Wallarm AWS cloud imajı](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) içinde `/opt/wallarm/usr/share/wallarm-common/cloud-init.py` yolunda bulunmaktadır. Bu betik, aşağıdaki ana aşamaların yer aldığı hem ilk hem de ileri düzey örnek yapılandırmayı gerçekleştirir:

* Wallarm Cloud üzerinden daha önce oluşturulan Wallarm düğümünü, Wallarm `register-node` betiğini çalıştırarak başlatır.
* [Terraform modülü](aws/terraform-module/overview.md) kullanılarak Wallarm dağıtımı yapılması durumunda, `preset` değişkeninde belirtilen proxy veya mirror yöntemi doğrultusunda örneği yapılandırır.
* Örneği, NGINX snippet'lerine göre ince ayar yapar.
* Wallarm düğümünü ince ayarlarla yapılandırır.
* Yük Dengeleyici için sağlık kontrolleri gerçekleştirir.

`cloud-init` betiği, yalnızca örnek ilk başlatıldığında çalıştırılır; örneğin yeniden başlatılması betiğin yeniden çalıştırılmasını tetiklemez. Daha fazla detayı, [AWS dokümantasyonundaki betik kavramı](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) içinde bulabilirsiniz.

## Wallarm cloud-init betiğinin çalıştırılması

Wallarm cloud-init betiğini şu şekilde çalıştırabilirsiniz:

* Bir bulut örneği başlatın ve `cloud-init.py` betiğinin çalıştırılmasını tanımlamak için metaverilerini kullanın.
* `cloud-init.py` betiği içeren bir örnek Launch Template oluşturun ve buna dayanarak otomatik ölçeklendirme grubu oluşturun.

[httpbin.org](https://httpbin.org) için bir proxy sunucusu olarak Wallarm düğümünü çalıştırmak üzere betik çalıştırma örneği:

```bash
#!/bin/bash
set -e

### Wallarm etkinleştirilmeden NGINX'in çalışmasını önler,
### tüm işlemler tamamlanmadan sağlık kontrolü yapılmaması önerilir
###
systemctl stop nginx.service

/opt/wallarm/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarm Node successfuly configured!
```

Altyapıyı Kod (IaC) yaklaşımına uygun olarak, Wallarm `cloud-init` betiğinin kullanımının örnekleyici bir örneği olabilecek [AWS için Terraform modülünü](aws/terraform-module/overview.md) uyguladık.

## Wallarm cloud-init betiği yardım verileri

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Wallarm düğümünü, PaaS kümesindeki belirtilen yapılandırma ile çalıştırır. https://docs.wallarm.com/installation/cloud-platforms/cloud-init/

optional arguments:
  -h, --help            bu yardım mesajını gösterir ve çıkış yapar.
  -t TOKEN, --token TOKEN
                        Wallarm Konsol Arayüzü'nden kopyalanan Wallarm düğüm token'ı.
  -H HOST, --host HOST  Kullanılan Wallarm Cloud için özel Wallarm API sunucusu: https://docs.wallarm.com/about-wallarm/overview/#cloud. Varsayılan olarak, api.wallarm.com.
  --skip-register       Wallarm Cloud'da oluşturulan düğümün yerel olarak çalıştırılması aşamasını atlar (register-node betiği çalıştırması atlanır). Bu aşama, düğümün başarılı bir şekilde dağıtılması için kritiktir.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Wallarm düğüm ön ayarı: Düğümün bir proxy sunucusu olarak çalışması için "proxy", yansıtılan trafiği işlemek için "mirror", yalnızca NGINX snippet'leriyle tanımlanan yapılandırma için "custom".
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Trafik filtreleme modu: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Proxy kullanılan sunucu protokolü ve adresi. "proxy" ön ayarı seçilmişse gereklidir.
  --libdetection        Trafik analizi esnasında libdetection kütüphanesi kullanılıp kullanılmayacağını belirtir: https://docs.wallarm.com/about-wallarm/protecting-against-attacks/#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        NGINX genel yapılandırmasına eklenecek özel yapılandırma.
  --http-snippet HTTP_SNIPPET_FILE
                        NGINX'in "http" yapılandırma bloğuna eklenecek özel yapılandırma.
  --server-snippet SERVER_SNIPPET_FILE
                        NGINX'in "server" yapılandırma bloğuna eklenecek özel yapılandırma.
  -l LOG_LEVEL, --log LOG_LEVEL
                        Ayrıntı düzeyi.

Bu betik, AWS, GCP, Azure ve diğer PaaS'ler için en popüler yapılandırmalardan birkaçını kapsamaktadır. Daha güçlü bir yapılandırmaya ihtiyaç duyarsanız, Wallarm düğümünün halka açık dokümantasyonunu inceleyebilirsiniz: https://docs.wallarm.com.
```