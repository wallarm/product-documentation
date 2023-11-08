# Verificando a operação do nó de filtragem

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

Se tudo estiver configurado corretamente, o Wallarm filtra as solicitações e faz proxy das solicitações filtradas de acordo com as configurações do arquivo de configuração.

Para verificar a operação correta, você deve:

1. Executar a solicitação `wallarm-status`.
2. Executar um ataque de teste.

    
## 1. Executar a solicitação `wallarm-status`

Você pode obter estatísticas de operação do nó de filtragem solicitando a URL `/wallarm-status`.

Execute o comando:

```
curl http://127.0.0.8/wallarm-status
```

A saída será assim:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

Isso significa que o serviço de estatísticas do nó de filtragem está funcionando corretamente.

!!! informação "O serviço de estatísticas"
    Você pode ler mais sobre o serviço de estatísticas e como configurá-lo [aqui][doc-stat-service].

## 2. Execute um ataque de teste

Para verificar se o Wallarm detecta corretamente os ataques, envie uma solicitação maliciosa para o recurso protegido.

Por exemplo:

```
http://<URL_do_recurso>/etc/passwd
```

O Wallarm deve detectar na solicitação [Path Traversal](../attacks-vulns-list.md#path-traversal).

Agora, o contador do número de ataques aumentará quando uma solicitação para `wallarm-status` for executada, o que significa que o nó de filtragem está operando normalmente.

Para saber mais sobre as configurações do nó de filtragem do Wallarm, veja o capítulo [Opções de Configuração][doc-configure-parameters].