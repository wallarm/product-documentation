# Resolução de problemas com Tarantool

As seções abaixo fornecem informações sobre erros frequentes na operação do Tarantool e sua resolução.

## Como posso resolver o problema de "limite de leitura antecipada alcançado"?

No arquivo `/var/log/wallarm/tarantool.log`, você pode obter erros como:

```
limite de leitura antecipada alcançado, parando entrada na conexão fd 16, 
aka 127.0.0.1:3313, par de 127.0.0.1:53218
```

Este problema não é crítico, mas muitos desses erros podem diminuir o desempenho do serviço.

Para resolver o problema:

1. Acesse a pasta `/usr/share/wallarm-tarantool/init.lua` → arquivo `box.cfg`.
1. Defina uma das seguintes opções:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

O parâmetro `readahead` define o tamanho do buffer de leitura antecipada associado a uma conexão cliente. Quanto maior o buffer, mais memória uma conexão ativa consome e mais solicitações podem ser lidas do buffer do sistema operacional em uma única chamada de sistema. Veja mais detalhes na [documentação](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead) do Tarantool.

## Como posso resolver o problema de "limite de net_msg_max alcançado"?

No arquivo `/var/log/wallarm/tarantool.log`, você pode obter erros como:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> parando entrada na conexão fd 21, 
também conhecido como 127.0.0.1:3313, par de 127.0.0.1:44306, limite de net_msg_max alcançado
```

Para resolver o problema, aumente o valor de `net_msg_max` (valor padrão `768`):

1. Acesse a pasta `/usr/share/wallarm-tarantool/init.lua` → arquivo `box.cfg`.
1. Aumente o valor de `net_msg_max`, por exemplo:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

Para evitar que o excesso de fibras afete todo o sistema, o parâmetro `net_msg_max` restringe o número de mensagens que as fibras manipulam. Veja detalhes sobre o uso de `net_msg_max` na [documentação](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max) do Tarantool.