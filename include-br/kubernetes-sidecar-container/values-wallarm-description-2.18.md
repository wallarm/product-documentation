```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # Endpoint da API Wallarm: 
  # "api.wallarm.com" para a Nuvem da EU
  # "us1.api.wallarm.com" para a Nuvem dos EUA
  wallarm_host_api: "api.wallarm.com"
  # Nome de usuário do usuário com a função Deploy
  deploy_username: "username"
  # Senha do usuário com a função Deploy
  deploy_password: "password"
  # Porta na qual o contêiner aceita solicitações de entrada,
  # o valor deve ser idêntico a ports.containerPort
  # na definição do seu aplicativo principal
  app_container_port: 80
  # Modo de filtragem de solicitação:
  # "off" para desativar o processamento de solicitações
  # "monitoring" para processar, mas não bloquear solicitações
  # "block" para processar todas as solicitações e bloquear as maliciosas
  mode: "block"
  # Quantidade de memória em GB para dados de análise de solicitações
  tarantool_memory_gb: 2
  # Defina como "true" para ativar a funcionalidade de Bloqueio de IP
  enable_ip_blocking: "false"
```