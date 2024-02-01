# Os ataques não estão sendo enviados para a Nuvem Wallarm

Se você suspeita que os ataques do tráfego não estão sendo enviados para a Nuvem Wallarm e, como resultado, não aparecem na interface do usuário do Console Wallarm, use este artigo para depurar o problema.

Para depurar o problema, execute as seguintes etapas em sequência:

1. Gere algum tráfego malicioso para realizar mais depurações.
1. Verifique o modo de operação do nó de filtragem.
1. Verifique se o Tarantool tem recursos suficientes para processar solicitações.
1. Capture logs e compartilhe-os com a equipe de suporte da Wallarm.

## 1. Gere algum tráfego malicioso

Para fazer mais depurações dos módulos Wallarm:

1. Envie o seguinte tráfego malicioso:

    ```bash
    for i in `seq 100`; do curl "http://<FILTRAGEM_NÓ_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    Substitua `<FILTRAGEM_NÓ_IP>` pelo IP do nó de filtragem que você deseja verificar. Se necessário, adicione o cabeçalho `Host:` ao comando.
1. Aguarde até 2 minutos para que os ataques apareçam no Console Wallarm → **Eventos**. Se todas as 100 solicitações aparecerem, o nó de filtragem está operando corretamente.
1. Conecte-se ao servidor com o nó de filtragem instalado e obtenha as [métricas do nó](../admin-en/monitoring/intro.md):

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Mais adiante, nos referiremos à saída do `wallarm-status`.

## 2. Verifique o modo de operação do nó de filtragem

Verifique o modo de operação do nó de filtragem da seguinte forma:

1. Verifique se o [modo](../admin-en/configure-wallarm-mode.md) do nó de filtragem é diferente de `off`. O nó não processa o tráfego de entrada no modo `off`.

    O modo `off` é uma razão comum para as métricas `wallarm-status` não aumentarem.
1. Reinicie o NGINX para ter certeza de que as configurações do nó Wallarm foram aplicadas (se o nó foi instalado a partir dos pacotes DEB/RPM):

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"
1. [Gere](#1-gerar-algum-tráfego-malicioso) tráfego malicioso novamente para ter certeza de que os ataques ainda não estão sendo enviados para a Nuvem.

## 3. Verifique se o Tarantool tem recursos suficientes para processar solicitações

As seguintes métricas básicas do Tarantool apontam para problemas do Tarantool relacionados à exportação de ataques:

* `wallarm.stat.export_delay` é um atraso no envio de ataques para a Nuvem Wallarm (em segundos)
* `wallarm.stat.timeframe_size` é o intervalo de tempo em que o Tarantool armazena solicitações (em segundos)
* `wallarm.stat.dropped_before_export` é o número de acertos que não tiveram tempo suficiente para serem enviados para a Nuvem Wallarm

Para visualizar as métricas:

1. Conecte-se ao servidor com o módulo postanalytics (Tarantool) instalado.
1. Execute os seguintes comandos:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

Se o valor de `wallarm.stat.dropped_before_export` for diferente de `0`:

* [Aumente](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) a quantidade de memória alocada para o Tarantool (se `wallarm.stat.timeframe_size` for menor que 10 minutos).

    !!! info "Memória Recomendada"
        É recomendado ajustar a memória alocada para o Tarantool para que a métrica `wallarm.stat.timeframe_size` não caia abaixo de `300` segundos durante as cargas de pico.

* Aumente o número de manipuladores `export_attacks` em `/etc/wallarm/node.yaml` → `export_attacks`, por exemplo:

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    As configurações `export_attacks` são as seguintes por padrão:

    * `threads: 2`
    * `api_chunk: 10`

## 4. Capture logs e compartilhe-os com a equipe de suporte da Wallarm

Se as etapas acima não ajudarem a resolver o problema, por favor, capture os logs do nó e compartilhe-os com a equipe de suporte da Wallarm da seguinte forma:

1. Conecte-se ao servidor com o nó Wallarm instalado.
1. Obtenha a saída do `wallarm-status` da seguinte forma:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Copie uma saída.
1. Execute o script de diagnóstico Wallarm:

    ```bash
    sudo /usr/share/wallarm-common/collect-info.sh
    ```

    Obtenha o arquivo gerado com os logs.
1. Envie todos os dados coletados para a [equipe de suporte Wallarm](mailto:support@wallarm.com) para investigação futura.