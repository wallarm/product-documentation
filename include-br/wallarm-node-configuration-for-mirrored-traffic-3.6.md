Para que o nó Wallarm processe o tráfego espelhado, defina a seguinte configuração:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#Mude 222.222.222.22 para o endereço do servidor de espelhamento
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* A diretiva [`real_ip_header`](../../using-proxy-or-balancer-en.md) é necessária para que o Console Wallarm exiba os endereços IP dos atacantes. 
* As diretivas `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto para cópias recebidas do tráfego espelhado.
* Como as solicitações maliciosas [não podem](overview.md#limitations-of-mirrored-traffic-filtration) ser bloqueadas, o nó Wallarm sempre analisa solicitações no [modo](../../configure-wallarm-mode.md) de monitoramento, mesmo que a diretiva `wallarm_mode` ou Wallarm Cloud configure o modo de bloqueio seguro ou regular (além do modo definido como desativado).

O processamento de tráfego espelhado é suportado apenas pelos nós baseados em NGINX. Você pode definir a configuração fornecida da seguinte maneira:

* Se instalar o nó a partir de pacotes DEB/RPM - no arquivo de configuração do NGINX `/etc/nginx/conf.d/default.conf`.
* Se implantar o nó a partir da imagem da nuvem [AWS](../../installation-ami-en.md) ou [GCP](../../installation-gcp-en.md) - no arquivo de configuração do NGINX `/etc/nginx/nginx.conf`.
* Se implantar o nó a partir da [imagem Docker](../../installation-docker-en.md) - monte o arquivo com a configuração fornecida no contêiner.
* Se executar o nó como [controlador Ingress](../../installation-kubernetes-en.md) - monte o ConfigMap com a configuração fornecida em um pod.