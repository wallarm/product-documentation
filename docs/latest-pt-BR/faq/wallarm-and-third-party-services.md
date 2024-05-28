# Interação entre a plataforma Wallarm e serviços de terceiros

Se ocorrerem alguns problemas durante a interação entre a plataforma Wallarm e os serviços de terceiros, verifique este guia de solução de problemas para resolvê-los. Se não encontrar detalhes relevantes aqui, por favor, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

## Com quais serviços de terceiros a plataforma Wallarm interage?

A plataforma Wallarm interage com os seguintes serviços de terceiros:

* Servidor de feedback do Tarantool (`https://feedback.tarantool.io`) para carregar dados padrão da instância Tarantool.

    O armazenamento na memória do Tarantool é usado pelo módulo pós-analítico da Wallarm instalado na sua máquina a partir do pacote `wallarm-tarantool`. O armazenamento do Tarantool é instalado como duas instâncias, personalizado (`wallarm-tarantool`) e padrão (`tarantool`). Uma instância padrão é instalada junto com a personalizada por padrão e não é utilizada pelos componentes da Wallarm.
    
    A Wallarm utiliza apenas uma instância personalizada do Tarantool que não envia nenhum dado para `https://feedback.tarantool.io`. No entanto, uma instância padrão pode enviar dados para o servidor de feedback do Tarantool uma vez por hora ([mais detalhes](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)).

## Posso desabilitar o envio de dados da instância padrão do Tarantool para `https://feedback.tarantool.io`?

Sim, você pode desabilitar o envio de dados da instância padrão do Tarantool para `https://feedback.tarantool.io` da seguinte maneira:

* Se você não utiliza a instância padrão do Tarantool, pode desativá-la:

    ```bash
    systemctl stop tarantool
    ```
* Se a instância padrão do Tarantool está atendendo aos seus problemas, você pode desativar o envio de dados para `https://feedback.tarantool.io` usando o parâmetro [`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled).