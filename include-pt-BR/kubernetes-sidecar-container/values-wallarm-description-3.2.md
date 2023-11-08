```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Sempre
  # Ponto de extremidade da API Wallarm: 
  # "api.wallarm.com" para o Cloud EU
  # "us1.api.wallarm.com" para o Cloud US
  wallarm_host_api: "api.wallarm.com"
  # Nome de usuário do usuário com a função de Implementação
  deploy_username: "username"
  # Senha do usuário com a função de Implementação
  deploy_password: "password"
  # Porta em que o contêiner aceita solicitações de entrada,
  # o valor deve ser idêntico a ports.containerPort
  # na definição do seu contêiner de aplicativo principal
  app_container_port: 80
  # Modo de filtragem de solicitação:
  # "off" para desativar o processamento de solicitações
  # "monitoring" para processar, mas não bloquear solicitações
  # "safe_blocking" para bloquear solicitações maliciosas originadas de IPs cinza
  # "block" para processar todas as solicitações e bloquear as maliciosas
  mode: "block"
  # Quantidade de memória em GB para dados de análise de solicitações
  tarantool_memory_gb: 2
```