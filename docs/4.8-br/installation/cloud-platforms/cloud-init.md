# Especificação do Script cloud-init da Wallarm

Ao seguir a abordagem de Infraestrutura como Código (IaC), você pode precisar usar o script [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) para implantar o nó Wallarm na nuvem pública. A partir do lançamento 4.0, a Wallarm distribui suas imagens na nuvem com o script `cloud-init.py` pronto para uso que é descrito neste tópico.

## Visão geral do script cloud-init da Wallarm

O script `cloud-init` da Wallarm está disponível no caminho `/usr/share/wallarm-common/cloud-init.py` na [imagem na nuvem da Wallarm na AWS](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe). Este script realiza um inicial e uma configuração de instância avançada com as seguintes principais etapas:

* Executa o nó Wallarm criado anteriormente na Nuvem Wallarm executando o script `register-node` da Wallarm
* Configura a instância de acordo com a abordagem de proxy ou espelho especificada na variável `preset` (se implantar o Wallarm usando o [módulo Terraform](aws/terraform-module/overview.md))
* Refina a instância de acordo com os snippets do NGINX
* Refina o nó da Wallarm
* Executa verificações de saúde para o Load Balancer

O script `cloud-init` é executado apenas uma vez na inicialização da instância, a reinicialização da instância não força seu lançamento. Você encontrará mais detalhes na [documentação da AWS sobre o conceito de script](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html).

## Executando o script cloud-init da Wallarm

Você pode executar o script cloud-init da Wallarm da seguinte maneira:

* Inicie uma instância na nuvem e use seus metadados para descrever a execução do script `cloud-init.py`
* Crie um modelo de lançamento de instância com o script `cloud-init.py` e aplique com base nele um grupo de dimensionamento automático

Exemplo da execução do script para executar o nó Wallarm como um servidor proxy para [httpbin.org](https://httpbin.org):

```bash
#!/bin/bash
set -e

### Impedir a execução do NGINX sem
### Wallarm habilitado, não é recomendado
### verificar a saúde antes de tudo estar pronto
###
systemctl stop nginx.service

/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Nó Wallarm configurado com sucesso!
```

Para atender à abordagem Infraestrutura como Código (IaC), implementamos o [módulo Terraform para AWS](aws/terraform-module/overview.md) que pode ser um exemplo ilustrativo do uso do script `cloud-init` da Wallarm.

## Dados de ajuda do script cloud-init da Wallarm

```plain
usage: /usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Executa o nó Wallarm com a configuração especificada no cluster PaaS. https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

argumentos opcionais:
  -h, --help            mostrar esta mensagem de ajuda e sair
  -t TOKEN, --token TOKEN
                        Token do nó Wallarm copiado da interface de usuário do Console Wallarm.
  -H HOST, --host HOST  Servidor de API Wallarm específico para a nuvem Wallarm em uso: https://docs.wallarm.com/about-wallarm-
                        waf/overview/#cloud. Por padrão, api.wallarm.com.
  --skip-register       Pula a etapa de execução local do nó criado na nuvem Wallarm (pula a execução do script register-node).
                        Esta etapa é crucial para o sucesso da implantação do nó.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Preset do nó Wallarm: "proxy" para o nó operar como um servidor proxy, "mirror" para o nó processar
                        tráfego espelhado, "custom" para configuração definida apenas via snippets NGINX.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Modo de filtragem de tráfego: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Protocolo e endereço do servidor proxy. Necessário se "proxy" for especificado como um preset.
  --libdetection        Se deve usar a biblioteca libdetection durante a análise de tráfego: https://docs.wallarm.com/about-wallarm-
                        waf/protecting-against-attacks.md#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        Configuração personalizada para ser adicionada à configuração global do NGINX.
  --http-snippet HTTP_SNIPPET_FILE
                        Configuração personalizada para ser adicionada ao bloco de configuração "http" do NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        Configuração personalizada para ser adicionada ao bloco de configuração "server" do NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        Nível de verbosidade.
                        
Este script abrange algumas das configurações mais populares para AWS, GCP, Azure e outros PaaS. Se você precisa de uma configuração mais poderosa,
você está convidado a revisar a documentação pública do nó Wallarm: https://docs.wallarm.com.
```
