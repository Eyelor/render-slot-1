const http = require('http');
const geoip = require('geoip-lite');

// Funkcja obsługująca zapytania HTTP
const requestHandler = (request, response) => {
  // Pobranie adresu IP klienta
  const clientIP = request.connection.remoteAddress;
  

  // Ustalenie strefy czasowej i lokalizacji klienta na podstawie adresu IP
  const clientGeo = geoip.lookup(clientIP);

  const clientTimeZone = clientGeo && clientGeo.timezone ? clientGeo.timezone : 'UTC';
  const clientLocale = clientGeo && clientGeo.country ? clientGeo.country.toLowerCase() : 'en';

  // Pobranie daty i godziny w strefie czasowej klienta
  const clientTime = new Date().toLocaleString(clientLocale, {timeZone: clientTimeZone});

  // Ustawienie nagłówka odpowiedzi
  response.writeHead(200, {'Content-Type': 'text/html'});

  // Generowanie treści strony
  const htmlContent = `
    <html>
      <head>
        <title>Informacje o kliencie</title>
      </head>
      <body>
        <h1>Informacje o kliencie</h1>
        <p>Adres IP klienta: ${clientIP}</p>
        <p>Strefa czasowa klienta: ${clientTimeZone}</p>
        <p>Data i godzina w strefie czasowej klienta: ${clientTime}</p>
      </body>
    </html>
  `;

  // Wysłanie odpowiedzi do klienta
  response.end(htmlContent);
};

// Utworzenie serwera HTTP
const server = http.createServer(requestHandler);

// Konfiguracja portu
const port = 3000;

// Uruchomienie serwera
server.listen(port, (err) => {
  if (err) {
    return console.log('Błąd podczas uruchamiania serwera:', err);
  }

  // Pobranie aktualnej daty i godziny
  const currentDate = new Date().toLocaleString('pl-PL');

  // Wyświetlenie informacji o uruchomieniu serwera
  console.log(`Serwer został uruchomiony dnia ${currentDate} przez Jakuba Kopeć na porcie ${port}`);
});
