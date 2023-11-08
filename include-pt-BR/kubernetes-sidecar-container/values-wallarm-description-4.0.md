```
wallarm:
  imagem:
     repositório: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Sempre
  # Ponto de acesso da API Wallarm:  
  # "api.wallarm.com" para a nuvem da EU
  # "us1.api.wallarm.com" para a nuvem dos EUA
  wallarm_host_api: "api.wallarm.com"
  # Token do nó Wallarm
  wallarm_api_token: "token"
  # Porta na qual o contêiner aceita solicitações recebidas,
  # o valor deve ser idêntico a ports.containerPort
  # na definição do contêiner do seu aplicativo principal
  app_container_port: 80
  # Modo de filtragem de solicitação:
  # "desligado" para desativar o processamento de solicitações
  # "monitoramento" para processar, mas não bloquear solicitações
  # "bloqueio_seguro" para bloquear solicitações maliciosas originadas de IPs em lista cinza
  # "bloquear" para processar todas as solicitações e bloquear as maliciosas
  modo: "bloquear"
  # Quantidade de memória em GB para dados de análise de solicitação
  tarantool_memory_gb: 2
```