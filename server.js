const http = require('http');
const geoip = require('geoip-lite');

// Funkcja obsługująca zapytania HTTP
const requestHandler = (request, response) => {
  // Pobranie adresu IP klienta
  //const clientIP = request.connection.remoteAddress;
  const clientIP = request.socket.remoteAddress;
  const clientIPForwarded = request.headers['x-forwarded-for'];

  // Ustalenie strefy czasowej i lokalizacji klienta na podstawie adresu IP
  const clientGeo = geoip.lookup(clientIP);

  const clientTimeZone = clientGeo && clientGeo.timezone ? clientGeo.timezone : 'UTC';
  const clientLocale = clientGeo && clientGeo.country ? clientGeo.country.toLowerCase() : 'en';

  // Pobranie daty i godziny w strefie czasowej klienta
  const clientTime = new Date().toLocaleString(clientLocale, {timeZone: clientTimeZone});

  // Pobranie daty i godziny serwera
  const serverTime = new Date().toLocaleString(clientLocale);

  // Ustawienie nagłówka odpowiedzi
  response.writeHead(200, {'Content-Type': 'text/html'});

  // Generowanie treści strony
  const htmlContent = `
    <html>
      <head>
        <title>Dane klienta</title>
      </head>
      <body>
        <h1>Dane klienta</h1>
        <p>Adres IP klienta: ${clientIP}</p>
        <p>Adresy IP forwarded klienta: ${clientIPForwarded}</p>
        <p>Strefa czasowa klienta: ${clientTimeZone}</p>
        <p>Data i godzina w strefie czasowej klienta: ${clientTime}</p>
        <p>Data i godzina serwera: ${serverTime}</p>
      </body>
    </html>
  `;

  // Wysłanie odpowiedzi do klienta
  response.end(htmlContent);
};

// Utworzenie serwera HTTP
const server = http.createServer(requestHandler);

// Konfiguracja hosta
const host = '0.0.0.0';

// Konfiguracja portu
const port = process.env.PORT || 3000;

// Uruchomienie serwera
server.listen(port, host, (err) => {
  if (err) {
    return console.log('Błąd podczas uruchamiania serwera:', err);
  }

  // Pobranie aktualnej daty i godziny
  const currentDate = new Date().toLocaleString('pl-PL');

  // Wyświetlenie informacji o uruchomieniu serwera
  console.log(`Serwer został uruchomiony na porcie ${port}, data: ${currentDate}, autor Jakub Kopeć`);
});
