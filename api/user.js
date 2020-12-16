const cheerio = require('cheerio');
const got = require('got');

export default (req, res) => {
  let GH_DOMAIN = 'https://github.com'
  let year = "2020"
  if (req.query.year) {
    year = req.query.year
  }
  let contributions = []
  let minCount = 1000
  let maxCount = 0
  let median = 0
  let percentile80 = 0
  let percentile90 = 0
  let percentile99 = 0

  let nonZeroValues = []

  let url = `${req.query.username}?tab=overview&from=${year}-12-01&to=${year}-12-31`
  got(url, {prefixUrl: GH_DOMAIN}).then(response => {
    const $ = cheerio.load(response.body)
    let weeks = $('.js-yearly-contributions svg > g g')

    weeks.each((i, w) => {
      let week = {}
      week['week'] = i
      week['days'] = []
      $(w).find('rect').each((j, r) => {
        let day = {}
        let count = $(r).data('count')
        day['date'] = $(r).data('date')
        day['count'] = count
        week['days'].push(day)

        if (count > 0)
        {
          nonZeroValues.push(count)
          if (count <= minCount) {
            minCount = count
          }
        }

        if (count > maxCount) {
          maxCount = count
        }
      })
      contributions.push(week)
    })

    // If we've only had 0's returned
    if (maxCount === 0)
    {
      minCount = 0
    }

    // Calculate distributions
    if(nonZeroValues.length > 0)
    {
      nonZeroValues.sort(function(a,b){
        return a-b;
      });
  
      var half = Math.floor(nonZeroValues.length / 2);
      if (nonZeroValues.length % 2)
      {
        median = nonZeroValues[half]
      }
      else {
        median = (nonZeroValues[half - 1] + nonZeroValues[half]) / 2.0
      }

      percentile80 = (nonZeroValues[Math.floor(nonZeroValues.length * 0.8) - 1] + nonZeroValues[Math.floor(nonZeroValues.length * 0.8)]) / 2.0
      percentile90 = (nonZeroValues[Math.floor(nonZeroValues.length * 0.9) - 1] + nonZeroValues[Math.floor(nonZeroValues.length * 0.9)]) / 2.0
      percentile99 = (nonZeroValues[Math.floor(nonZeroValues.length * 0.99) - 1] + nonZeroValues[Math.floor(nonZeroValues.length * 0.99)]) / 2.0
    }

    res.json({
      username: req.query.username,
      year: year,
      min: minCount,
      max: maxCount,
      median: median,
      p80: percentile80,
      p90: percentile90,
      p99: percentile99,
      contributions: contributions
    })
  }).catch(err => {
    // TODO: something better
    console.log(err)
  })
}
