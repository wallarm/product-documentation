Uma vez habilitada a proteção BOLA, a Wallarm:

1. Identifica os endpoints da API que são mais prováveis de serem alvo de ataques BOLA, por exemplo, aqueles com [variabilidade nos parâmetros do caminho][variability-in-endpoints-docs]: `domain.com/path1/path2/path3/{variative_path4}`.

    !!! info "Esta etapa leva um período de tempo"
        A identificação de endpoints vulneráveis da API leva um período de tempo necessário para uma profunda observação do inventário da API descoberta e das tendências de tráfego de entrada.
    
    Apenas os endpoints da API explorados pelo módulo **API Discovery** são protegidos contra ataques BOLA de maneira automatizada. Os endpoints protegidos são [destacados com o ícone correspondente][bola-protection-for-endpoints-docs].

1. Protege os endpoints vulneráveis da API contra ataques BOLA. A lógica de proteção padrão é a seguinte:

    * Solicitações a um endpoint vulnerável que excedam o limite de 180 solicitações do mesmo IP por minuto são consideradas ataques BOLA.
    * Apenas registra ataques BOLA na lista de eventos quando o limite de solicitações do mesmo IP é atingido. A Wallarm não bloqueia ataques BOLA. As solicitações vão continuar chegando às suas aplicações.

        A reação correspondente no modelo de autoproteção é **Apenas registrar ataques**.

1. Reage às [alterações na API][changes-in-api-docs] protegendo novos endpoints vulneráveis e desabilitando a proteção para endpoints removidos.
