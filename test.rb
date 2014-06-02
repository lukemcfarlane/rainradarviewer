BASE_URL = 'http://metservice.com'

require 'json'
require 'date_core'

jsonStr = '[{"longDateTime":"10:58am Monday 2 Jun 2014","shortDateTime":"10:58am Mon","url":"\/IcePics\/ob\/249a-14659a760c0-14659adae25.ImgPlayerCHRISTCHURCH.jpeg","validFrom":"10:58am Monday 2 Jun 2014","validToex":"10:58am Monday 2 Jun 2014"},{"longDateTime":"10:50am Monday 2 Jun 2014","shortDateTime":"10:50am Mon","url":"\/IcePics\/ob\/249a-14659a00dc0-14659a6d028.ImgPlayerCHRISTCHURCH.jpeg","validFrom":"10:50am Monday 2 Jun 2014","validToex":"10:50am Monday 2 Jun 2014"}]'
data = JSON.parse(jsonStr)

result = []
data.each do |d|
    dt = DateTime.parse(d['longDateTime'])
    unixTime = dt.strftime('%s')
    newData = {
        datetime: unixTime,
        url: BASE_URL + d['url']
    }
    result.push(newData)
end

puts result