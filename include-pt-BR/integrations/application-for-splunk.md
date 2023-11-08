Para organizar eventos Wallarm em um painel de controle pronto para usar no Splunk 9.0 ou posterior, você pode instalar o [aplicativo Wallarm para Splunk](https://splunkbase.splunk.com/app/6610).

Este aplicativo fornece um painel de controle pré-configurado que é automaticamente preenchido com os eventos recebidos da Wallarm. Além disso, o aplicativo permite que você prossiga para logs detalhados sobre cada evento e exporte os dados do painel de controle.

![Painel Splunk][splunk-dashboard-by-wallarm-img]

Para instalar o aplicativo Wallarm para Splunk:

1. Na interface do usuário Splunk ➝ **Apps**, encontre o aplicativo `Wallarm API Security`.
1. Clique em **Instalar** e insira as credenciais do Splunkbase.

Se alguns eventos Wallarm já estiverem registrados no Splunk, eles serão exibidos no painel de controle, bem como eventos adicionais que a Wallarm descobrirá.

Além disso, você pode personalizar completamente o painel pronto para uso, por exemplo, sua visualização ou [strings de pesquisa](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search) usados ​​para extrair dados de todos os registros Splunk.