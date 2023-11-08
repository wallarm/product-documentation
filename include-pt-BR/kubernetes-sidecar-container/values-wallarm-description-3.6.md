```
wallarm:
  imagem:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Sempre
  # Endpoint de API do Wallarm: 
  # "api.wallarm.com" para o Cloud EU
  # "us1.api.wallarm.com" para o Cloud US
  wallarm_host_api: "api.wallarm.com"
  # Nome de usuário do usuário com a função Deploy
  deploy_username: "username"
  # Senha do usuário com a função Deploy
  deploy_password: "password"
  # Porta na qual o contêiner aceita solicitações de entrada,
  # o valor deve ser idêntico ao ports.containerPort
  # na definição do contêiner do seu aplicativo principal
  app_container_port: 80
  # Modo de filtragem de solicitação:
  # "off" para desabilitar o processamento de solicitações
  # "monitoring" para processar, mas não bloquear solicitações
  # "safe_blocking" para bloquear solicitações maliciosas originadas de IPs na lista cinza
  # "block" para processar todas as solicitações e bloquear as maliciosas
  mode: "block"
  # Quantidade de memória em GB para dados analíticos de solicitações
  tarantool_memory_gb: 2
```