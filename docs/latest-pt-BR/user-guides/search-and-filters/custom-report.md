[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png

[link-using-search]:        use-search.md

# Criando um relatório personalizado

Você pode filtrar eventos e depois exportar os resultados para um relatório em PDF ou CSV. A Wallarm enviará o relatório personalizado para o endereço especificado.

O PDF é um relatório visualmente rico, bom para análise de dados e apresentação. Este relatório inclui:

* Resumos de ataques, vulnerabilidades e incidentes
* Informações detalhadas sobre os eventos

O CSV inclui detalhes sobre cada evento que corresponde ao filtro e é bom para fins técnicos. Você pode usá-lo para criar painéis de controle, obter IPs exclusivos de atacantes, produzir uma lista de hosts/aplicações da API atacados, etc.

O relatório CSV pode incluir vários arquivos CSV, um para cada tipo de evento - ataque, incidente, vulnerabilidade. Cada CSV tem um máximo de 10.000 eventos, ordenados pelos eventos com mais acertos.

## Criar relatório

1. Na aba **Eventos**, [filtre][link-using-search] os eventos.
1. Clique em **Exportar** e selecione PDF ou CSV.
1. Defina o e-mail em **Enviar para**.

    ![Janela de criação de relatório personalizado][img-custom-report]
1. Clique em **Exportar**. A Wallarm irá gerar o relatório e enviá-lo por e-mail.

## Baixar relatório PDF criado anteriormente

Os três últimos relatórios em PDF, incluindo aqueles [gerados para vulnerabilidades](../vulnerabilities.md#downloading-vulnerability-report) são salvos. Se necessário, baixe-os da janela de exportação.