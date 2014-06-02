# The main purpose of this Sinatra app is to get the data from
# Metservice, transform it, and then return JSON data ready for
# the AngularJS app to pick up and do something useful with it.
#
# Author: https://github.com/lukemcfarlane
# Date:   June 2014

BASE_URL = 'http://metservice.com'

require 'sinatra'
require 'json'
require 'rest_client'

# Serve the AngularJS app
get '/' do
    send_file 'public/index.html'
end

# This is the endpoint used by the AngularJS app to get the radar image data
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