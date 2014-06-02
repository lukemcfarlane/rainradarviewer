BASE_URL = 'http://metservice.com'

require 'sinatra'
require 'json'
require 'rest_client'

get '/radar/images' do
    response = RestClient.get 'http://metservice.com/publicData/rainRadarChristchurch_2h_7min_300K'

    dataArr = JSON.parse(response)

    newDataArr = []
    dataArr.each do |d|
        dt = DateTime.parse(d['longDateTime'])
        unixTime = dt.strftime('%s')
        newData = {
            datetime: unixTime,
            url: BASE_URL + d['url']
        }
        newDataArr.push(newData)
    end

    newDataArr.to_json
end

not_found do
  content_type :json
  halt 404, { error: 'URL not found' }.to_json
end