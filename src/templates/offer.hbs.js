module.exports = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      .title {
        font-size: 20px;
        text-align: right;
      }

      h3 {
        font-size: 13.5px;
        font-family: sans-serif;
      }

      p {
        font-size: 13.5px;
        margin: 0px;
      }

      .investment {
        width: 100%;
        font-size: 12px;
        padding: 0px;
        font-family: sans-serif;
      }

      .investment tr {
        height: 30px;
        padding: 0px;
        margin: 0px
      }

      .investment th {
        text-align: left;
        width: 25%;
        border-right: 1px solid silver;
        margin-left: 5px;
      }

      .investment td {
        margin-left: 5px;
      }
    </style>
  </head>

  <body style="font-family: sans-serif;">
    <main>
      <img 
        src="data:image/png;base64,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"
      >
      <h1 class="title">Carta Oferta</h1>
      <h3>Estimad@ {{signerName}}</h3>
      <p>
        <br>Ha sido un placer conocer tus inquietudes y propósitos como desarrollador web.<br><br>

        En Kodemia estamos exageradamente comprometidos con el desarrollo de tu talento como desarrollador, por lo que te
        extendemos la presente carta oferta para el Bootcamp <strong>“Full-Stack developer JavaScript”</strong> en
        modalidad <strong>“Live”</strong> que iniciamos el próximo {{startBootcampDate}}.<br><br>

        Este bootcamp te permitirá entender inicialmente la forma de pensar de un gran programador, a través de los
        fundamentos de programación y la resolución de algoritmos, dándote el entendimiento claro de la estructura de
        programación para adoptar cualquier lenguaje en el futuro. Así como consolidarte en el mundo del desarrollo Web
        creando una aplicación que combina tus nuevas habilidades de Front-end y Back-end con patrones de diseño, todo lo
        anterior consolidado en el bootcamp.<br><br>

        Luego de conocer tus expectativas, nos gustaría trabajar contigo durante este bootcamp y por ello, te presentamos
        el programa con el siguiente <strong>esquema de financiamiento</strong> , Quedando de la siguiente manera:
        <br><br>
      </p>
      <h3 style="font-size:14px;">INVERSIÓN REGULAR CON IVA:</h3>
      <table class="investment">
        <tr style=" background-color: silver">
          <th> MONTO A FINANCIAR:</th>
          <td>{{formatCurrency amountToFinance}} {{ numberToTextInPesos amountToFinance}} pesos mexicanos</td>
        </tr>
        <tr>
          <th> INSCRIPCIÓN:</th>
          <td>{{formatCurrency inscription}} {{ numberToTextInPesos inscription }} pesos mexicanos</td>
        </tr>
        <tr style=" background-color: silver">
          <th> ESQUEMA DE PAGO:</th>
          <td>{{paymentScheme}}</td>
        </tr>
        <tr>
          <th> PAGOS TOTALES:</th>
          <td> {{totalPayments}}</td>
        </tr>
        <tr style=" background-color:silver;">
          <th> MONTO MENSUAL:</th>
          <td>{{formatCurrency monthlyPayment}} {{numberToTextInPesos monthlyPayment}} pesos mexicanos</td>
        </tr>
      </table>
      <br>
      <p>
        *La presente carta oferta tiene vigencia limite al {{deadline}}para realizar la inscripción.
        <br><br>
        **Después de la aplicación con Accede se tiene un total de 10 días hábiles para concluir el proceso de
        financiamiento.
        <br><br>
        *Al aprobarse el financiamiento, Accede solicita el 5%por apertura de contrato del monto solicitado.<br><br>
      </p>
      <table style="border: 1px solid black; width: 100%; font-family: sans-serif;">
        <tr stylle="width: 70%">
          <th style="text-align:left; border-right: 1px solid black; font-size: 13.5px;">Datos Bancarios</th>
          <th style="text-align:center; font-size: 13.5px;">Firma del alumno</th>
        </tr>
        <tr stylle="width: 30%">
          <td style="border-right: 1px solid black;">
            <p>
              Banco BBVA <br> Titular: Kodemia SC <br> Número de cuenta: 0113364240 <br>
              CLABE: 012180001133642404<br>
            </p>
          </td>
          <td>
            <span style="color: white; diplay:block; text-align:center;">**signature_1**/</span>
          </td>
        </tr>
      </table>
    </main>
    <footer>
      <br>
      <p style="text-align: center;">Kodemia es tu casa: COW Roma, <br> Tonalá 10, Roma norte, 03800, CDMX.</p>
    </footer>
  </body>
</html>
`
