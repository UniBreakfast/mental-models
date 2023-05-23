const fs = require('fs').promises

fs.readFile('mm.json', 'utf8').then((data, models = [...new Set(JSON.parse(data))]) => {
  require('http').createServer(async (req, res, body = '') => {
    for await (const chunk of req) body += chunk
    if (body) {
      const model = decodeURIComponent(body.slice(2))
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/\+/g, ' ')
      if (!models.includes(model)) {
        models = [model, ...models]
        await fs.writeFile('mm.json', JSON.stringify(models))
      }
    }
    res.end(`<!DOCTYPE html><meta charset="utf-8">
    <form method="POST"><input name="m" autofocus><button>+</button></form>
    ${models.map(model => `<button>${model}</button>`).join('')}`)
  }).listen(3000, () => require('child_process').exec('start http://localhost:3000'))
})
