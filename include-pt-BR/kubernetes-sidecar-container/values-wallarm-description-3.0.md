```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Sempre
  # Endereço da API Wallarm: 
  # "api.wallarm.com" para o Cloud EU
  # "us1.api.wallarm.com" para o Cloud EUA
  wallarm_host_api: "api.wallarm.com"
  # Nome de usuário do usuário com a função Deploy
  deploy_username: "nome_do_usuario"
  # Senha do usuário com a função Deploy
  deploy_password: "senha"
  # Porta na qual o contêiner aceita solicitações de entrada,
  # o valor deve ser idêntico ao ports.containerPort
  # na definição do seu aplicativo principal
  app_container_port: 80
  # Modo de filtragem de solicitação:
  # "off" para desativar o processamento de solicitações
  # "monitoring" para processar, mas não bloquear solicitações
  # "safe_blocking" para bloquear solicitações maliciosas originadas de IPs na lista cinza
  # "block" para processar todas as solicitações e bloquear as maliciosas
  mode: "block"
  # Quantidade de memória em GB para dados de análise de solicitação
  tarantool_memory_gb: 2
```