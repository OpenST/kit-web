module CompanyApi

  module Request

    class TestEconomy < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Puneet
      # * Date: 15/04/2019
      # * Reviewed By:
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::TestEconomy] returns an object of CompanyApi::Request::TestEconomy class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, true, headers)
        @service_base_route = 'test-economy/'

      end

      # Fetch test economy details
      #
      # * Author: Puneet
      # * Date: 15/04/2019
      # * Reviewed By:
      #
      def fetch_test_economy_details
        get('')
      end

    end

  end

end
