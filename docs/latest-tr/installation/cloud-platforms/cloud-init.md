# Wallarm cloud-init Scriptinin Özellikleri

Altyapı Kod Tekniği (IaC) yaklaşımını izliyorsanız, Wallarm düğümünü genel buluta dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) scriptini kullanmanız gerekebilir. 4.0 sürümünden itibaren Wallarm, bu konuda açıklanan hazır ve kullanıma uygun `cloud-init.py` scripti ile bulut imajlarını dağıtmaktadır.

## Wallarm cloud-init scriptinin genel bakışı

Wallarm `cloud-init` scripti, [Wallarm AWS bulut imajı](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) altında `/usr/share/wallarm-common/cloud-init.py` yoluyla erişilebilir. Bu script, hem başlangıç hem de ileri düzey örneğin yapılandırılmasını aşağıdaki ana aşamalarla gerçekleştirir:

* Wallarm `register-node` scriptini çalıştırarak daha önce Wallarm Bulutunda oluşturulmuş olan Wallarm düğümünü çalıştırır
* `preset` değişkeninde belirtilen proxy veya ayna yaklaşımına uygun olarak örneği yapılandırır (Wallarm'ı [Terraform modülü](aws/terraform-module/overview.md) kullanarak dağıtıyorsa)
* Örneği NGINX snippet'larına uygun şekilde ince ayarlar
* Wallarm düğümünü ince ayarlar
* Yük Dengeleyici için sağlık kontrolü gerçekleştirir

`cloud-init` scripti, instance'ın başlangıcında sadece bir kez çalıştırılır, instance'ın yeniden başlatılması scriptin başlatımasına neden olmaz.  Script konsepti hakkında daha fazla ayrıntıyı [AWS belgelendirmesinde](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) bulabilirsiniz.

## Wallarm cloud-init scriptini çalıştırma

Wallarm cloud-init scriptini aşağıdaki şekillerde çalıştırabilirsiniz:

* Bulut instance'ını başlatın ve `cloud-init.py` scriptin çalışmasını açıklamak için metadataını kullanın
* `cloud-init.py` scripti ile bir instance başlatma şablonu oluşturun ve ona dayalı otomatik ölçekleme grubu oluşturun

Scriptin [httpbin.org](https://httpbin.org) için bir proxy sunucusu olarak Wallarm düğümünü çalıştırmak amacıyla kullanımının örneği:

```bash
#!/bin/bash
set -e

### Prevent NGINX from running without
### Wallarm enabled, it is not recommended to
### run health check before all things get done
###
systemctl stop nginx.service

/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarm Node successfuly configured!
```

Altyapı Kod Tekniği (IaC) yaklaşımını karşılamak üzere, Wallarm `cloud-init` scriptin kullanımının açıklayıcı bir örneği olabilecek bir [AWS için Terraform modülü](aws/terraform-module/overview.md) uyguladık.

## Wallarm cloud-init scripti yardım verisi

```plain
usage: /usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Run the Wallarm node with the specified configuration in the PaaS cluster. https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        Wallarm node token copied from the Wallarm Console UI.
  -H HOST, --host HOST  Wallarm API server specific for the Wallarm Cloud being used: https://docs.wallarm.com/about-wallarm/overview/#cloud. By default, api.wallarm.com.
  --skip-register       Skips the stage of local running the node created in the Wallarm Cloud (skips the register-node script
                        execution). This stage is crucial for successful node deployment.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Wallarm node preset: "proxy" for the node to operate as a proxy server, "mirror" for the node to process
                        mirrored traffic, "custom" for configuration defined via NGINX snippets only.
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
