Para o nó Wallarm processar o tráfego espelhado, defina a seguinte configuração:

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

* A diretiva [`real_ip_header`](../../using-proxy-or-balancer-en.md) é necessária para que o Console Wallarm exiba os endereços IP dos invasores.
* As diretivas `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto as cópias recebidas do tráfego espelhado.
* Como as solicitações maliciosas [não podem](overview.md#limitations-of-mirrored-traffic-filtration) ser bloqueadas, o nó Wallarm sempre analisa as solicitações no [modo](../../configure-wallarm-mode.md) de monitoramento mesmo se a diretiva `wallarm_mode` ou o Wallarm Cloud definirem o modo de bloqueio seguro ou regular (além do modo definido para desligado).

O processamento de tráfego espelhado é suportado apenas pelos nós baseados em NGINX. Você pode definir a configuração fornecida da seguinte maneira:

* Se instalando o nó a partir de pacotes DEB/RPM - no arquivo de configuração NGINX `/etc/nginx/conf.d/default.conf`.
* Se implantando o nó a partir da imagem em nuvem [AWS](../../installation-ami-en.md) ou [GCP](../../installation-gcp-en.md) - no arquivo de configuração NGINX `/etc/nginx/nginx.conf`.
* Se implantando o nó a partir da [imagem Docker](../../installation-docker-en.md) - monte o arquivo com a configuração fornecida no contêiner.
* Se executando o nó como [Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md) ou [Ingress controller](../../installation-kubernetes-en.md) - monte o ConfigMap com a configuração fornecida em um pod.