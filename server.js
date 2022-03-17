const axios = require('axios')
const cheerio = require('cheerio')
const app = require('express')()
const port = process.env.PORT || 8008

app.get('/', (req, res) => {
    res.status(200).send({ data: 'hello' })
})

app.get('/:stock', async (req, res) => {
    const { stock } = req.params
    const { api_key } = req.query
    if (!stock || !api_key) {
        return res.status(400).send({ message: 'please include api_key & stock ticker' })
    }




    try {
        const stockInfoType = await Promise.all(['key-statistics', 'history'].map(async type => {
            const url = `https://finance.yahoo.com/quote/${stock}/${type}?p=${stock}`
            const { data } = await axios.get(url)

            const $ = cheerio.load(data)

            if (type === 'history') {
                const prices = $('td:nth-child(6)').get().map(val => $(val).text())
                return { prices }
            }

            if (type === 'key-statistics') {
                const metrics = [
                    'Market Cap (intraday)',
                    'Trailing P/E',
                    'Forward P/E',
                    'PEG Ratio (5 yr expected)',
                    'Price/Sales (ttm)',
                    'Price/Book (mrq)',
                    'Enterprise Value/Revenue',
                    'Enterprise Value/EBITDA',
                    'Shares Outstanding5',
                    'Profit Margin',
                    'Operating Margin (ttm)',
                    'Return on Assets (ttm)',
                    'Return on Equity (ttm)',
                    'Revenue (ttm)',
                    'Revenue Per Share (ttm)',
                    'Quarterly Revenue Growth (yoy)',
                    'Gross Profit (ttm)',
                    'EBITDA',
                    'Net Income Avi to Common (ttm)',
                    'Quarterly Earnings Growth (yoy)',
                    'Total Cash (mrq)',
                    'Total Debt (mrq)',
                    'Total Debt/Equity (mrq)',
                    'Operating Cash Flow (ttm)'
                ]
                console.log($('section[data-test="qsp-statistics"] div:first-child tbody tr').get().map(val => $(val).text()))


                return {}
            }
        }))

        res.send({ data: 'hello' })
        // res.status(200).send({
        //     [stock]: stockInfoType.reduce((acc, curr) => {
        //         return {...acc, [Object.keys(curr)[0]]: Object.values(curr)[0]}
        //     }, {})
        // })


    } catch (err) {
        res.status(500).send({ message: err.message })
    }

    // res.status(200).send(`<h1>hello ${api_key} ticker: ${stock}</h1>`)
})


app.listen(port, () => console.log(`Server has started on port: ${port}`))