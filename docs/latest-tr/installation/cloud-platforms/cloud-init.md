# Wallarm cloud-init Betiğinin Belirtimi

Infrastructure as Code (IaC) yaklaşımını izliyorsanız, Wallarm düğümünü genel buluta dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) betiğini kullanmanız gerekebilir. 4.0 sürümünden itibaren, Wallarm bulut imajlarını bu konuda açıklanan, kullanıma hazır `cloud-init.py` betiğiyle birlikte dağıtmaktadır.

## Wallarm cloud-init betiğine genel bakış

Wallarm `cloud-init` betiği, [Wallarm AWS bulut imajı](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) içinde `/opt/wallarm/usr/share/wallarm-common/cloud-init.py` yolunda bulunur. Bu betik, aşağıdaki ana aşamalarla hem ilk hem de gelişmiş örnek yapılandırmasını gerçekleştirir:

* Wallarm Cloud'da daha önce oluşturulmuş Wallarm düğümünü Wallarm `register-node` betiğini çalıştırarak başlatır
* Örneği `preset` değişkeninde belirtilen proxy yaklaşımına uygun şekilde yapılandırır (Wallarm'ı [Terraform modülü](aws/terraform-module/overview.md) ile dağıtıyorsanız)
* Örneği NGINX snippet'larına göre ince ayar yapar
* Wallarm düğümünü ince ayarlar
* Yük Dengeleyici için sağlık kontrollerini gerçekleştirir

`cloud-init` betiği yalnızca örnek önyüklemesinde bir kez çalışır, örneğin yeniden başlatılması betiği yeniden tetiklemez. Betik kavramına ilişkin daha fazla detayı [AWS dokümantasyonunda](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) bulabilirsiniz.

## Wallarm cloud-init betiğini çalıştırma

Wallarm cloud-init betiğini şu şekilde çalıştırabilirsiniz:

* Bir bulut örneği başlatın ve `cloud-init.py` betiğinin çalıştırılmasını örnek metadatası ile tanımlayın
* `cloud-init.py` betiğini içeren bir Launch Template oluşturun ve bunun üzerine bir Auto Scaling group oluşturun

Wallarm düğümünü [httpbin.org](https://httpbin.org) için bir proxy sunucusu olarak çalıştırmak amacıyla betiğin çalıştırılmasına örnek:

```bash
#!/bin/bash
set -e

### NGINX'in Wallarm etkin değilken çalışmasını engelleyin, tüm işlemler tamamlanmadan
### sağlık denetimi çalıştırılması önerilmez
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

Infrastructure as Code (IaC) yaklaşımını karşılamak için, Wallarm `cloud-init` betiğinin kullanımına dair açıklayıcı bir örnek olabilecek [AWS için Terraform modülünü](aws/terraform-module/overview.md) uyguladık.

## Wallarm cloud-init betiği yardım verileri

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Runs the Wallarm node with the specified configuration in the PaaS cluster. https://docs.wallarm.com/installation/cloud-platforms/cloud-init/

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        Wallarm node token copied from the Wallarm Console UI.
  -H HOST, --host HOST  Wallarm API server specific for the Wallarm Cloud being used: https://docs.wallarm.com/about-wallarm/overview/#cloud. By default, api.wallarm.com.
  --skip-register       Skips the stage of local running the node created in the Wallarm Cloud (skips the register-node script
                        execution). This stage is crucial for successful node deployment.
  -p {proxy,custom}, --preset {proxy,custom}
                        Wallarm node preset: "proxy" for the node to operate as a proxy server, "custom" for configuration defined via NGINX snippets only.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Traffic filtration mode: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Proxied server protocol and address. Required if "proxy" is specified as a preset.
  --libdetection        Whether to use the libdetection library during the traffic analysis: https://docs.wallarm.com/about-wallarm/protecting-against-attacks/#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        Custom configuration to be added to the NGINX global configuration.
  --http-snippet HTTP_SNIPPET_FILE
                        Custom configuration to be added to the "http" configuration block of NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        Custom configuration to be added to the "server" configuration block of NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        Level of verbosity.

This script covers a few most popular configurations for AWS, GCP, Azure and other PaaS. If you need a more powerful configuration,
you are welcome to review Wallarm node public documentation: https://docs.wallarm.com.
```