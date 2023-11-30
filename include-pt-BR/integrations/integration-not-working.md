Notificações ao sistema são enviadas por meio de solicitações. Se o sistema estiver indisponível ou os parâmetros de integração estiverem configurados incorretamente, o código de erro é retornado na resposta à solicitação.

Se o sistema responder à solicitação de Wallarm com qualquer código diferente de `2xx`, Wallarm reenvia a solicitação com o intervalo até que o código `2xx` seja recebido:

* Os intervalos do primeiro ciclo: 1, 3, 5, 10, 10 segundos
* Os intervalos do segundo ciclo: 0, 1, 3, 5, 30 segundos
* Os intervalos do terceiro ciclo: 1, 1, 3, 5, 10, 30 minutos

Se a porcentagem de solicitações mal sucedidas atingir 60% em 12 horas, a integração é automaticamente desabilitada. Se você receber notificações do sistema, você receberá uma mensagem sobre a integração ser automaticamente desabilitada.

<!-- ## Videos de demonstração

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->