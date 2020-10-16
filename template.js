export default ({ markup, css }) => {
  return `<!DOCTYPE html>
  <html lang='en'>
  <head>
  <meta charset='utf-8'>
  <title>MERN</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  </head>
  <body>
  <div id="root">${markup}</div>
  <style id='jss-server-side'>${css}</style>
  <script type='text/javascript' src='/dist/bundle.js'></script>
  </body>
  </html>`;
};
