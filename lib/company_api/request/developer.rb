module CompanyApi

  module Request

    class Developer < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Ankit
      # * Date: 03/01/2019
      # * Reviewed By: Kedar
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Developer] returns an object of CompanyApi::Request::Developer class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, true, headers)
        @service_base_route = 'developer/'

      end

      # Developer page details
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By: Sunil
      #
      def index
        get('')
      end

    end

  end

end
